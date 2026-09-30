const orderService = require('../services/orderService');

function create(req, res) {
  const { customerId, items, couponCode } = req.body || {};
  const order = orderService.create({ customerId, items, couponCode });
  res.status(201).json(order);
}

function get(req, res) {
  res.json(orderService.getById(parseInt(req.params.id, 10)));
}

function changeStatus(req, res) {
  const { status } = req.body || {};
  res.json(orderService.changeStatus(parseInt(req.params.id, 10), status));
}

function cancel(req, res) {
  res.json(orderService.cancel(parseInt(req.params.id, 10)));
}

module.exports = { create, get, changeStatus, cancel };
