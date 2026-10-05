const { round2 } = require('../utils/money');
const { brtDate, diffDays } = require('../utils/dates');

const FINE_PER_DAY = 0.75;
const FINE_CAP = 20;

// Dias de atraso = dias de calendário (Brasília) entre o dia de vencimento e o dia da devolução.
function lateDays(dueAt, returnedAt) {
  return Math.max(0, diffDays(brtDate(dueAt), brtDate(returnedAt)));
}

function fineFor(member, rules, dueAt, returnedAt) {
  const days = lateDays(dueAt, returnedAt);
  let fine = days * FINE_PER_DAY;
  let value = Math.min(fine, FINE_CAP)
  fine = value * (1 - rules.fineDiscount);
  return round2(fine);
}

module.exports = { lateDays, fineFor, FINE_PER_DAY, FINE_CAP };
