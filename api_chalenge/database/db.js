let products = [
  { id: 1, name: "Teclado mecânico", price: 250, stock: 12 },
  { id: 2, name: "Mouse gamer", price: 90, stock: 3 },
  { id: 3, name: "Monitor 24pol", price: 900, stock: 5 },
  { id: 4, name: "Headset", price: 150, stock: 0 },
  { id: 5, name: "Webcam HD", price: 180, stock: 8 },
  { id: 6, name: "Cadeira gamer", price: 1200, stock: 2 },
  { id: 7, name: "Mousepad", price: 40, stock: 20 },
  { id: 8, name: "Suporte monitor", price: 95, stock: 1 },
  { id: 9, name: "Hub USB", price: 60, stock: 15 },
  { id: 10, name: "SSD 1TB", price: 450, stock: 7 },
  { id: 11, name: "Fone bluetooth", price: 220, stock: 4 },
];

function getAll() {
  return products;
}

function findById(id) {
  return products.find((p) => p.id === id);
}

module.exports = { getAll, findById };
