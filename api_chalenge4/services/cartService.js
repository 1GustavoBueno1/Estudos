const Cart = require("./Cart");

const cart = new Cart();
const totalCache = {};

function getCart() {
  return cart
}

function addItem(item) {
  cart.addItem(item);
}

// Adiciona vários itens de uma vez, reaproveitando o método da classe.
function bulkAdd(items) {
  items.forEach(cart.addItem.bind(cart));
}

function removeItemsById(id) {
  cart.removeItemsById(id);
}

function duplicateCart() {
  return cart.duplicate();
}

function getCachedTotal() {
  const key = cart.items.map(i => i.price).join(",") 

if (totalCache[key] !== undefined) {
  return totalCache[key];
}

const total = cart.items.reduce((sum, item) => sum + item.price, 0);
totalCache[key] = total;
return total;
}

module.exports = {
  getCart,
  addItem,
  bulkAdd,
  removeItemsById,
  duplicateCart,
  getCachedTotal,
};
