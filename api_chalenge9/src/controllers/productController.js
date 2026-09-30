const productService = require('../services/productService');

function list(req, res) {
  const { page, pageSize } = req.query;
  res.json(productService.list({ page, pageSize }));
}

function get(req, res) {
  res.json(productService.getById(parseInt(req.params.id, 10)));
}

function updatePrice(req, res) {
  const { price } = req.body || {};
  res.json(productService.updatePrice(parseInt(req.params.id, 10), price));
}

module.exports = { list, get, updatePrice };
