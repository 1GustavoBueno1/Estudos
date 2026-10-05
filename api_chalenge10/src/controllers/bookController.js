const bookService = require('../services/bookService');

function list(req, res) {
  const { page, pageSize, q, available } = req.query;
  res.json(bookService.list({ page, pageSize, q, available }));
}

function get(req, res) {
  res.json(bookService.getById(parseInt(req.params.id, 10)));
}

module.exports = { list, get };
