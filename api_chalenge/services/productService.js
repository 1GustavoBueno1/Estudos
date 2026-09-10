const db = require("../database/db");

function listProductsSortedByPrice() {
  const products = db.getAll();
  return products.sort((produtoA, produtoB) => produtoA.price - produtoB.price);
}

function getDiscountedPrice(product, percent) {
  product.price = product.price - product.price * (percent / 100);
  return product;
}

async function checkLowStock(threshold = 5) {
  const products = db.getAll();
  const lowStock = [];

  products.forEach(async (product) => {
    const isLow = await simulateStockCheck(product);
    if (isLow && product.stock < threshold) {
      lowStock.push(product);
    }
  });

  return lowStock;
}

function simulateStockCheck(product) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 10);
  });
}

module.exports = {
  listProductsSortedByPrice,
  getDiscountedPrice,
  checkLowStock,
};
