const memberService = require('../services/memberService');

function get(req, res) {
  res.json(memberService.present(memberService.getById(parseInt(req.params.id, 10))));
}

function payFines(req, res) {
  res.json(memberService.payFines(parseInt(req.params.id, 10)));
}

module.exports = { get, payFines };
