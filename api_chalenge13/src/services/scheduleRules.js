const { db } = require('../db/database');
const { AppError } = require('../utils/errors');
const { brtDate, brtParts, diffDays } = require('../utils/dates');

const SLOT_MINUTES = 30;
const SLOT_MS = SLOT_MINUTES * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
// Blocos de atendimento em minutos desde 00:00 (Brasília): 08:00–12:00 e 14:00–18:00.
const BLOCKS = [
  [8 * 60, 12 * 60],
  [14 * 60, 18 * 60],
];
const MIN_LEAD_MS = 2 * HOUR_MS;
const MAX_DAYS_AHEAD = 60;
const MAX_PER_DAY = 2;

// Dois intervalos [início, fim) se sobrepõem?
function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// R2: dia útil, múltiplo de 30 min, dentro de um bloco de atendimento.
function assertWorkingSlot(start) {
  const p = brtParts(start);
  if (p.weekday === 0 || p.weekday === 6) {
    throw new AppError(422, 'Médico não atende aos fins de semana');
  }
  const aligned =
    start.getUTCSeconds() === 0 && start.getUTCMilliseconds() === 0 && p.minutes % SLOT_MINUTES === 0;
  if (!aligned) {
    throw new AppError(422, 'Horário deve começar em múltiplo de 30 minutos');
  }
  const inBlock = BLOCKS.some(([from, to]) => p.minutes >= from && p.minutes + SLOT_MINUTES <= to);
  if (!inBlock) {
    throw new AppError(422, 'Horário fora do expediente');
  }
}

// R3: antecedência mínima e janela máxima. Devolve a mensagem de erro ou null.
function leadTimeViolation(start, now) {
  if (start.getTime() <= now.getTime() + MIN_LEAD_MS) {
    return 'Agendamento exige antecedência mínima de 2 horas';
  }
  if (diffDays(now.toISOString().slice(0, 10), brtDate(start)) > MAX_DAYS_AHEAD) {
    return 'Agendamento permitido somente até 60 dias à frente';
  }
  return null;
}

function assertLeadTime(start, now) {
  const message = leadTimeViolation(start, now);
  if (message) throw new AppError(422, message);
}

function scheduledAppointments() {
  return db.appointments.filter((a) => a.status === 'scheduled');
}

// R4: o médico já tem consulta marcada que se sobrepõe a [start, end)?
function doctorIsBusy(doctorId, start, end, ignoreId) {
  return db.appointments.some(
    (a) =>
      a.id !== ignoreId &&
      a.doctorId === doctorId &&
      overlaps(start, end, new Date(a.startsAt), new Date(a.endsAt))
  );
}

// R4 e R5: conflitos de agenda do médico e do paciente.
function assertNoConflicts({ doctorId, patientId, start, end, ignoreId }) {
  if (doctorIsBusy(doctorId, start, end, ignoreId)) {
    throw new AppError(409, 'Horário indisponível para este médico');
  }
}

// R6: no máximo 2 consultas agendadas por paciente no mesmo dia (Brasília).
function assertDailyLimit(patientId, start, ignoreId) {
  const day = brtDate(start);
  const count = scheduledAppointments().filter(
    (a) => a.id !== ignoreId && a.patientId === patientId && brtDate(new Date(a.startsAt)) === day
  ).length;
  if (count >= MAX_PER_DAY) {
    throw new AppError(422, 'Limite de 2 consultas por dia atingido');
  }
}

module.exports = {
  SLOT_MINUTES,
  SLOT_MS,
  HOUR_MS,
  BLOCKS,
  assertWorkingSlot,
  leadTimeViolation,
  assertLeadTime,
  doctorIsBusy,
  assertNoConflicts,
  assertDailyLimit,
};
