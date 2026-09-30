const { db } = require('../db/database');
const { AppError } = require('../utils/errors');

function list({ page, pageSize } = {}) {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  if (!(page >= 1)) page = 1;
  if (!(pageSize >= 1)) pageSize = 5;
  pageSize = Math.min(pageSize, 50);

  const total = db.products.length;
  const start = (page - 1) * pageSize;
  const items = db.products.slice(start, start + pageSize);

  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.floor(total / pageSize),
  };
}

function getById(id) {
  const product = db.products.find((p) => p.id === id);
  if (!product) throw new AppError(404, 'Produto não encontrado');
  return product;
}

function updatePrice(id, price) {
  const product = getById(id);
  if (typeof price !== 'number' || !(price > 0)) {
    throw new AppError(400, 'Preço inválido');
  }
  product.price = price;
  return product;
}
function returnProducts(produto) {
  const product = getById(produto.productId)
  product.stock += produto.quantity}

module.exports = { list, getById, updatePrice, returnProducts  };
