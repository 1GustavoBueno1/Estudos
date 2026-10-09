const { db } = require('../db/database');
const clock = require('../utils/clock');
const { AppError } = require('../utils/errors');
const { round2 } = require('../utils/money');
const { brtDate } = require('../utils/dates');
const patientService = require('./patientService');
const doctorService = require('./doctorService');
const rules = require('./scheduleRules');
const { cancellationFee } = require('./pricing');

const PLAN_DISCOUNT = { particular: 0, convenio: 0.3 };

// R13: "done" é derivado (consulta agendada cujo horário já terminou); nunca é gravado.
function present(appt) {
  const done = appt.status === 'scheduled' && clock.now() >= new Date(appt.endsAt);
  return { ...appt, status: done ? 'done' : appt.status };
}

function findAppt(id) {
  const appt = db.appointments.find((a) => a.id === id);
  if (!appt) throw new AppError(404, 'Consulta não encontrada');
  return appt;
}

// R16: startsAt é obrigatório, ISO 8601 com fuso (Z ou ±hh:mm).
function parseStart(value) {
  const ok = typeof value === 'string' && /(Z|[+-]\d{2}:\d{2})$/.test(value);
  const date = ok ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    throw new AppError(400, 'startsAt inválido (use ISO 8601 com fuso, ex.: 2026-11-10T09:00:00-03:00)');
  }
  return date;
}

function getById(id) {
  return present(findAppt(id));
}

function create({ patientId, doctorId, startsAt }) {
  if (!Number.isInteger(patientId) || !Number.isInteger(doctorId)) {
    throw new AppError(400, 'patientId e doctorId são obrigatórios (números inteiros)');
  }
  const patient = patientService.getById(patientId);
  const doctor = doctorService.getById(doctorId);
  const start = parseStart(startsAt);
  const now = clock.now();

  rules.assertWorkingSlot(start);
  rules.assertLeadTime(start, now);
  if (patient.owed > 0) {
    throw new AppError(422, 'Paciente com débito pendente');
  }
  const end = new Date(start.getTime() + rules.SLOT_MS);
  rules.assertNoConflicts({ doctorId, patientId, start, end });
  rules.assertDailyLimit(patientId, start);

  const appt = {
    id: db.nextAppointmentId++,
    patientId,
    doctorId,
    startsAt: start.toISOString(),
    endsAt: end.toISOString(),
    status: 'scheduled',
    price: doctor.price * (1 - PLAN_DISCOUNT[patient.plan]),
    fee: 0,
    reschedules: 0,
    cancelledAt: null,
  };
  db.appointments.push(appt);
  return present(appt);
}

function cancel(id) {
  const appt = findAppt(id);
  const now = clock.now();
  const start = new Date(appt.startsAt);
  if (appt.status === 'cancelled') {
    throw new AppError(409, 'Consulta já cancelada');
  }
  if (now >= start) {
    throw new AppError(409, 'Consulta já iniciada ou realizada');
  }

  const fee = cancellationFee(appt, start, now);
  const patient = patientService.getById(appt.patientId);
  patient.owed = round2(patient.owed + fee);
  appt.status = 'cancelled';
  appt.fee = fee;
  appt.cancelledAt = now.toISOString();
  return present(appt);
}

function reschedule(id, { startsAt } = {}) {
  const appt = findAppt(id);
  const newStart = parseStart(startsAt);
  const now = clock.now();
  const oldStart = new Date(appt.startsAt);

  if (appt.status === 'cancelled') {
    throw new AppError(409, 'Consulta cancelada não pode ser remarcada');
  }
  if (now >= oldStart) {
    throw new AppError(409, 'Consulta já iniciada ou realizada');
  }
  if (appt.reschedules >= 1) {
    throw new AppError(409, 'Consulta já foi remarcada uma vez');
  }
  if (newStart.getTime() - now.getTime() < 24 * rules.HOUR_MS) {
    throw new AppError(409, 'Remarcação exige 24 horas de antecedência');
  }

  rules.assertLeadTime(newStart, now);
  const newEnd = new Date(newStart.getTime() + rules.SLOT_MS);
  rules.assertNoConflicts({
    doctorId: appt.doctorId,
    patientId: appt.patientId,
    start: newStart,
    end: newEnd,
    ignoreId: appt.id,
  });
  rules.assertDailyLimit(appt.patientId, newStart, appt.id);

  appt.startsAt = newStart.toISOString();
  appt.endsAt = newEnd.toISOString();
  appt.reschedules += 1;
  return present(appt);
}

// R15: listagem paginada; filtros aplicados antes de paginar; status é o derivado.
function list({ doctorId, status, date, page, pageSize } = {}) {
  const toInt = (v, def) => {
    const n = parseInt(v, 10);
    return Number.isInteger(n) && n >= 1 ? n : def;
  };
  page = toInt(page, 1);
  pageSize = Math.min(toInt(pageSize, 5), 20);

  let items = db.appointments.map(present);
  if (doctorId !== undefined) {
    items = items.filter((a) => a.doctorId === parseInt(doctorId, 10));
  }
  if (status !== undefined) {
    items = items.filter((a) => a.status === status);
  }
  if (date !== undefined) {
    items = items.filter((a) => brtDate(new Date(a.startsAt)) === date);
  }
  items.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt) || a.id - b.id);

  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

module.exports = { create, getById, cancel, reschedule, list };
