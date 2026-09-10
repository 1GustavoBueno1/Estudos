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

  products.forEach((product) => {
    if (product.stock < threshold) {
      lowStock.push(product);
    }
  });

  return lowStock;

}

module.exports = {
  listProductsSortedByPrice,
  getDiscountedPrice,
  checkLowStock,
};
