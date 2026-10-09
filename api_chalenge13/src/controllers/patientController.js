const patientService = require('../services/patientService');

function get(req, res) {
  res.json(patientService.getById(parseInt(req.params.id, 10)));
}

function pay(req, res) {
  res.json(patientService.payDebt(parseInt(req.params.id, 10)));
}

module.exports = { get, pay };
