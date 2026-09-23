const db = require("../db/database");
const orderService = require("../services/orderService");
const couponService = require("../services/couponService");
const reportService = require("../services/reportService");

// Data de referencia. Da pra fixar com ?today=YYYY-MM-DD.
function referenceDate(req) {
  return req.query.today || new Date().toISOString().slice(0, 10);
}

function listProducts(req, res) {
  res.json(db.listProducts());
}

function getProduct(req, res) {
  const product = db.findProduct(Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: "produto nao encontrado" });
  }
  res.json(product);
}

function listOrders(req, res) {
  res.json(orderService.listOrders());
}

function getOrder(req, res) {
  const order = orderService.getOrder(Number(req.params.id));
  if (!order) {
    return res.status(404).json({ error: "pedido nao encontrado" });
  }
  res.json(order);
}

function createOrder(req, res) {
  const order = orderService.createOrder(req.body, referenceDate(req));
  res.status(201).json(order);
}

function cancelOrder(req, res) {
  const order = orderService.cancelOrder(Number(req.params.id));
  if (!order) {
    return res.status(404).json({ error: "pedido nao encontrado" });
  }
  res.json(order);
}

function listCoupons(req, res) {
  res.json(couponService.listCoupons());
}

// Usado pelo site quando o cliente digita o cupom no carrinho.
function validateCoupon(req, res) {
  const subtotal = Number(req.query.subtotal);
  if (Number.isNaN(subtotal)) {
    return res.status(400).json({ error: "informe ?subtotal=" });
  }

  const result = couponService.validateCoupon(
    req.params.code,
    subtotal,
    referenceDate(req)
  );

  if (!result.ok) {
    return res.status(400).json({ valid: false, error: result.error });
  }

  res.json({ valid: true, discount: result.discount });
}

function salesReport(req, res) {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: "informe ?from= e ?to=" });
  }
  res.json(reportService.salesReport(from, to));
}

module.exports = {
  listProducts,
  getProduct,
  listOrders,
  getOrder,
  createOrder,
  cancelOrder,
  listCoupons,
  validateCoupon,
  salesReport,
};
