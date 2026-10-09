const { round2 } = require('../utils/money');
const { db } = require('../db/database');
const { HOUR_MS } = require('./scheduleRules');

// R10: taxa de cancelamento sobre o preço gravado na consulta.
//   faltando 24h ou mais       -> sem taxa
//   faltando de 2h até < 24h   -> 50%
//   faltando menos de 2h       -> 100%
function cancellationFee(appointment, start, now) {
  const remaining = start.getTime() - now.getTime();
  const base = db.doctors.find((d) => d.id === appointment.doctorId).price;
  let fee;
  if (remaining >= 24 * HOUR_MS) {
    fee = 0;
  } else if (remaining >= 2 * HOUR_MS) {
    fee = base * 0.5;
  } else {
    fee = base;
  }
  return round2(fee);
}

module.exports = { cancellationFee };
