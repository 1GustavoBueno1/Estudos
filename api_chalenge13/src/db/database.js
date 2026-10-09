const seed = require('./seed.json');

// Banco em memória. Os serviços devem sempre ler db.doctors, db.appointments etc.
// (nunca guardar referência antiga), pois reset() troca os arrays.
const db = {
  doctors: [],
  patients: [],
  appointments: [],
  nextAppointmentId: 1,
};

function reset() {
  const copy = JSON.parse(JSON.stringify(seed));
  db.doctors = copy.doctors;
  db.patients = copy.patients;
  db.appointments = [];
  db.nextAppointmentId = 1;
}

reset();

module.exports = { db, reset };
