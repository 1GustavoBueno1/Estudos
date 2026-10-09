const doctorService = require('../services/doctorService');

function list(req, res) {
  res.json(doctorService.list());
}

function get(req, res) {
  res.json(doctorService.getById(parseInt(req.params.id, 10)));
}

function slots(req, res) {
  res.json(doctorService.slots(parseInt(req.params.id, 10), req.query.date));
}

module.exports = { list, get, slots };
