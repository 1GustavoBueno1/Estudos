const db = require("../database/db");
const orderService = require("../services/orderService");

async function notifyAll(req, res) {
  const results = await orderService.notifyPendingOrders();
  res.json({ notifications: results });
}

function addItem(req, res) {
  const id = Number(req.params.id);
  const order = db.findById(id);

  if (!order) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  const name = req.body;
  const result = orderService.addItemToCart(order,  name);
  res.status(result.status).json(result);
}

async function getTotal(req, res) {
  const id = Number(req.params.id);
  const order = db.findById(id);

  if (!order) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  const total = await orderService.getOrderTotal(order);
  res.json(total);
}

function getCity(req, res) {
  const id = Number(req.params.id);
  const order = db.findById(id);

  if (!order) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  const city = orderService.getCustomerCity(order);
  res.status(city.status).json({ city });
}

async function checkout(req, res) {
  const id = Number(req.params.id);
  const result = await orderService.processOrder(id);
  res.json(result);
}

module.exports = { notifyAll, addItem, getTotal, getCity, checkout };
