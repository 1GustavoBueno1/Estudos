const seed = require('./seed.json');

// Banco em memória. Os serviços devem sempre ler db.products, db.orders etc.
// (nunca guardar referência antiga), pois reset() troca os arrays.
const db = {
  customers: [],
  products: [],
  coupons: [],
  orders: [],
  nextOrderId: 1,
};

function reset() {
  const copy = JSON.parse(JSON.stringify(seed));
  db.customers = copy.customers;
  db.products = copy.products;
  db.coupons = copy.coupons;
  db.orders = [];
  db.nextOrderId = 1;
}

reset();

module.exports = { db, reset };
