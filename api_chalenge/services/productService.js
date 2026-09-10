const db = require("../database/db");

function listProductsSortedByPrice() {
  const products = db.getAll();
  return products.sort((produtoA, produtoB) => produtoA.price - produtoB.price);
}

function getDiscountedPrice(product, percent) {
  const desconto = product.price * (percent / 100)
  const valor_final = product.price - desconto
  return {
    ...product,
    price: valor_final
  }
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
