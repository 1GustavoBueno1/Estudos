const db = require("../db/database");
const stockService = require("./stockService");
const couponService = require("./couponService");
const { round2 } = require("./money");

const SHIPPING_FEE = 19.9;
const FREE_SHIPPING_FROM = 200;

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

// Frete: gratis quando o valor dos produtos, ja com desconto, chega em R$ 200.
function shippingFor(amountAfterDiscount) {
  return amountAfterDiscount >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
}

// Cria o pedido: confere estoque, aplica cupom, calcula frete e total.
function createOrder({ customer, items, coupon }, todayISO) {
  if (!customer || !Array.isArray(items) || items.length === 0) {
    throw badRequest("pedido precisa de cliente e de pelo menos um item");
  }
  const availability = stockService.checkAvailability(items);
  if (!availability.ok) {
    throw badRequest(availability.error);
  }

  stockService.reserve(items);

  const lines = items.map((item) => {
    const product = db.findProduct(item.productId);
    return {
      productId: product.id,
      name: product.name,
      qty: item.qty,
      unitPrice: product.price,
    };
  });

  const subtotal = round2(
    lines.reduce((sum, line) => sum + line.qty * line.unitPrice, 0)
  );

  let discount = 0;
  if (coupon) {
    const result = couponService.validateCoupon(coupon, subtotal, todayISO);
    if (!result.ok) {
      throw badRequest(result.error);
    }
    discount = result.discount;
  }

  const afterDiscount = round2(subtotal - discount);
  const shipping = shippingFor(afterDiscount);
  const total = round2(afterDiscount + shipping);

  return db.insertOrder({
    customer,
    items: lines,
    coupon: coupon || null,
    subtotal,
    discount,
    shipping,
    total,
    status: "confirmed",
    createdAt: todayISO,
  });
}

// Cancela o pedido e devolve os itens pro estoque.
function cancelOrder(id) {
  const order = db.findOrder(id);
  if (!order) return null;
  if (order.status === "cancelled") {
    throw badRequest("Pedido já cancelado")
  }
  stockService.release(order.items);
  order.status = "cancelled";

  return order;
}

function getOrder(id) {
  return db.findOrder(id);
}

function listOrders() {
  return db.listOrders();
}

module.exports = { createOrder, cancelOrder, getOrder, listOrders };
