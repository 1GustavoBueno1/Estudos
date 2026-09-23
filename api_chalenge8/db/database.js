// Banco em memoria da loja.

const products = [
  { id: 1, name: "Camiseta", price: 59.9, stock: -1 },
  { id: 2, name: "Caneca", price: 35.0, stock: 20 },
  { id: 3, name: "Moletom", price: 149.9, stock: 8 },
  { id: 4, name: "Bone", price: 45.0, stock: 12 },
  { id: 5, name: "Pack de adesivos", price: 15.0, stock: 100 },
];

// type: "percent" (value = % de desconto) | "fixed" (value = reais)
// expiresAt: o cupom vale ate o fim desse dia
const coupons = [
  {
    code: "BEMVINDO10",
    type: "percent",
    value: 10,
    minSubtotal: 0,
    expiresAt: "2026-12-31",
    maxUses: 100,
    uses: 3,
  },
  {
    code: "PRIMAVERA",
    type: "fixed",
    value: 20,
    minSubtotal: 100,
    expiresAt: "2026-09-30",
    maxUses: 5,
    uses: 5,
  },
  {
    code: "INVERNO",
    type: "percent",
    value: 15,
    minSubtotal: 0,
    expiresAt: "2026-08-31",
    maxUses: 50,
    uses: 12,
  },
];

// status: "confirmed" | "canceled"
const orders = [
  {
    id: 1,
    customer: "Ana",
    items: [{ productId: 2, name: "Caneca", qty: 2, unitPrice: 35.0 }],
    coupon: null,
    subtotal: 70.0,
    discount: 0,
    shipping: 19.9,
    total: 89.9,
    status: "confirmed",
    createdAt: "2026-09-18",
  },
  {
    id: 2,
    customer: "Bruno",
    items: [{ productId: 3, name: "Moletom", qty: 1, unitPrice: 149.9 }],
    coupon: "PRIMAVERA",
    subtotal: 149.9,
    discount: 20,
    shipping: 19.9,
    total: 149.8,
    status: "confirmed",
    createdAt: "2026-09-19",
  },
  {
    id: 3,
    customer: "Carla",
    items: [
      { productId: 1, name: "Camiseta", qty: 3, unitPrice: 59.9 },
      { productId: 1, name: "Camiseta", qty: 3, unitPrice: 59.9 },
    ],
    coupon: null,
    subtotal: 359.4,
    discount: 0,
    shipping: 0,
    total: 359.4,
    status: "confirmed",
    createdAt: "2026-09-19",
  },
  {
    id: 4,
    customer: "Diego",
    items: [{ productId: 4, name: "Bone", qty: 2, unitPrice: 45.0 }],
    coupon: null,
    subtotal: 90.0,
    discount: 0,
    shipping: 19.9,
    total: 109.9,
    status: "cancelled",
    createdAt: "2026-09-20",
  },
  {
    id: 5,
    customer: "Rafael",
    items: [
      { productId: 3, name: "Moletom", qty: 1, unitPrice: 149.9 },
      { productId: 5, name: "Pack de adesivos", qty: 4, unitPrice: 15.0 },
    ],
    coupon: "BEMVINDO10",
    subtotal: 209.9,
    discount: 20.99,
    shipping: 19.9,
    total: 208.81,
    status: "confirmed",
    createdAt: "2026-09-21",
  },
  {
    id: 6,
    customer: "Elis",
    items: [{ productId: 3, name: "Moletom", qty: 1, unitPrice: 149.9 }],
    coupon: "PRIMAVERA",
    subtotal: 149.9,
    discount: 20,
    shipping: 19.9,
    total: 149.8,
    status: "confirmed",
    createdAt: "2026-09-21",
  },
];

let nextOrderId = 7;

// Copias, pra quem so vai ler.
function listProducts() {
  return products.map((p) => ({ ...p }));
}

// Referencia real: quem chama pode alterar o estoque.
function findProduct(id) {
  return products.find((p) => p.id === id) || null;
}

function listCoupons() {
  return coupons.map((c) => ({ ...c }));
}

// Referencia real: quem chama pode alterar o contador de usos.
function findCoupon(code) {
  return coupons.find((c) => c.code === code) || null;
}

function listOrders() {
  return orders.map((o) => ({ ...o }));
}

// Referencia real: quem chama pode alterar o status.
function findOrder(id) {
  return orders.find((o) => o.id === id) || null;
}

function insertOrder(data) {
  const order = { ...data, id: nextOrderId++ };
  orders.push(order);
  return order;
}

module.exports = {
  listProducts,
  findProduct,
  listCoupons,
  findCoupon,
  listOrders,
  findOrder,
  insertOrder,
};
