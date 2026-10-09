const appointmentService = require('../services/appointmentService');

function create(req, res) {
  const { patientId, doctorId, startsAt } = req.body || {};
  res.status(201).json(appointmentService.create({ patientId, doctorId, startsAt }));
}

function list(req, res) {
  const { doctorId, status, date, page, pageSize } = req.query;
  res.json(appointmentService.list({ doctorId, status, date, page, pageSize }));
}

function get(req, res) {
  res.json(appointmentService.getById(parseInt(req.params.id, 10)));
}

function cancel(req, res) {
  res.json(appointmentService.cancel(parseInt(req.params.id, 10)));
}

function reschedule(req, res) {
  res.json(appointmentService.reschedule(parseInt(req.params.id, 10), req.body || {}));
}

module.exports = { create, list, get, cancel, reschedule };
