const { db } = require('../db/database');
const { AppError } = require('../utils/errors');
const clock = require('../utils/clock');
const couponService = require('./couponService');
const { shippingFor } = require('./shippingService');
const {returnProducts} = require('./productService')

const TRANSITIONS = {
  pending: ['paid'],
  paid: ['shipped'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

// Monta a resposta enviada ao cliente.
function present(order) {
  const items = order.items.map((i) => {
    const product = db.products.find((p) => p.id === i.productId);
    return { productId: i.productId, quantity: i.quantity, unitPrice: product.price };
  });
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  return {
    id: order.id,
    customerId: order.customerId,
    items,
    couponCode: order.couponCode,
    subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: subtotal - order.discount + order.shipping,
    status: order.status,
    createdAt: order.createdAt,
  };
}

function findOrder(id) {
  const order = db.orders.find((o) => o.id === id);
  if (!order) throw new AppError(404, 'Pedido não encontrado');
  return order;
}

function create({ customerId, items, couponCode }) {
  if (!db.customers.some((c) => c.id === customerId)) {
    throw new AppError(404, 'Cliente não encontrado');
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError(400, 'O pedido precisa ter ao menos um item');
  }

  // 1) valida cada item
  const lines = items.map((item) => {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product) throw new AppError(404, `Produto ${item.productId} não encontrado`);
    if (!item.quantity) throw new AppError(400, 'Quantidade inválida');
    if (item.quantity > product.stock) {
      throw new AppError(409, `Estoque insuficiente para ${product.name}`);
    }
    return { product, quantity: item.quantity };
  });

  // 2) totais
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const shipping = shippingFor(subtotal);

  // 3) baixa o estoque
  lines.forEach((l) => {
    l.product.stock -= l.quantity;
  });

  // 4) cupom
  let coupon = null;
  let discount = 0;
  if (couponCode) {
    coupon = couponService.validate(couponCode, subtotal);
    discount = couponService.discountFor(coupon, subtotal, shipping);
  }

  // 5) grava o pedido
  const order = {
    id: db.nextOrderId++,
    customerId,
    items: lines.map((l) => ({
      productId: l.product.id,
      quantity: l.quantity,
      unitPrice: l.product.price,
    })),
    couponCode: coupon ? coupon.code : null,
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    status: 'pending',
    createdAt: clock.now().toISOString(),
  };
  db.orders.push(order);
  if (coupon) couponService.registerUse(coupon);

  return present(order);
}

function getById(id) {
  return present(findOrder(id));
}

function changeStatus(id, status) {
  const order = findOrder(id);
  const allowed = TRANSITIONS[order.status] || [];
  if (!allowed.includes(status)) {
    throw new AppError(409, `Não é possível ir de ${order.status} para ${status}`);
  }
  order.status = status;
  return present(order);
}

function cancel(id) {
  const order = findOrder(id);
  if (!['pending', 'paid'].includes(order.status)) {
    throw new AppError(409, 'Pedido não pode ser mais cancelado')
  }
  order.items.forEach(produto => {returnProducts(produto)})
  order.status = 'cancelled';
  return present(order);
}


module.exports = { create, getById, changeStatus, cancel };
