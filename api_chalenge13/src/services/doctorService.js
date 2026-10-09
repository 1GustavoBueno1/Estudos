const { db } = require('../db/database');
const clock = require('../utils/clock');
const { AppError } = require('../utils/errors');
const { atBrt } = require('../utils/dates');
const rules = require('./scheduleRules');

function list() {
  return db.doctors;
}

function getById(id) {
  const doctor = db.doctors.find((d) => d.id === id);
  if (!doctor) throw new AppError(404, 'Médico não encontrado');
  return doctor;
}

// R14: horários livres de um médico em um dia (YYYY-MM-DD, Brasília).
function slots(doctorId, date) {
  getById(doctorId);
  const valid =
    typeof date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    !Number.isNaN(new Date(`${date}T00:00:00Z`).getTime()) &&
    new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;
  if (!valid) throw new AppError(400, 'Parâmetro date inválido (use YYYY-MM-DD)');

  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  if (weekday === 0 || weekday === 6) return { doctorId, date, slots: [] };

  const now = clock.now();
  const out = [];
  for (const [from, to] of rules.BLOCKS) {
    for (let m = from; m <= to; m += rules.SLOT_MINUTES) {
      const start = atBrt(date, m);
      const end = new Date(start.getTime() + rules.SLOT_MS);
      if (rules.leadTimeViolation(start, now)) continue;
      if (rules.doctorIsBusy(doctorId, start, end)) continue;
      out.push(start.toISOString());
    }
  }
  return { doctorId, date, slots: out };
}

module.exports = { list, getById, slots };
