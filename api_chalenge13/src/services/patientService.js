const { db } = require('../db/database');
const { AppError } = require('../utils/errors');

function getById(id) {
  const patient = db.patients.find((p) => p.id === id);
  if (!patient) throw new AppError(404, 'Paciente não encontrado');
  return patient;
}

// Quita todo o débito de uma vez (R7).
function payDebt(id) {
  const patient = getById(id);
  const paid = patient.owed;
  patient.owed = 0;
  return { id: patient.id, paid, owed: patient.owed };
}

module.exports = { getById, payDebt };
