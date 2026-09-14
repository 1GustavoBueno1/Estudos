const cartService = require("../services/cartService");

function getCart(req, res) {
  res.json(cartService.getCart());
}

function addItem(req, res) {
  const { id, name, price } = req.body;
  cartService.addItem({ id, name, price });
  res.status(201).json(cartService.getCart());
}

function bulkAdd(req, res) {
  const { items } = req.body;
  cartService.bulkAdd(items);
  res.status(201).json(cartService.getCart());
}

function removeItemsById(req, res) {
  const id = Number(req.params.id);
  cartService.removeItemsById(id);
  res.json(cartService.getCart());
}

function duplicateCart(req, res) {
  const duplicated = cartService.duplicateCart();
  res.json(duplicated);
}

function getCachedTotal(req, res) {
  res.json({ total: cartService.getCachedTotal() });
}

module.exports = {
  getCart,
  addItem,
  bulkAdd,
  removeItemsById,
  duplicateCart,
  getCachedTotal,
};
