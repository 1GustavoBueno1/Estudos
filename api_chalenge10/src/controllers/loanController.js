const loanService = require('../services/loanService');

function create(req, res) {
  const { memberId, bookId } = req.body || {};
  res.status(201).json(loanService.create({ memberId, bookId }));
}

function get(req, res) {
  res.json(loanService.getById(parseInt(req.params.id, 10)));
}

function giveBack(req, res) {
  res.json(loanService.giveBack(parseInt(req.params.id, 10)));
}

function renew(req, res) {
  res.json(loanService.renew(parseInt(req.params.id, 10)));
}

module.exports = { create, get, giveBack, renew };
