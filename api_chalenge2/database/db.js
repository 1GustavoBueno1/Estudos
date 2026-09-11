const orders = [
  {
    id: 1,
    customerName: "Gustavo",
    items: [{ name: "Teclado" }, { name: "Mouse" }],
    address: { city: "Lebon Régis" },
    notified: false,
  },
  {
    id: 2,
    customerName: "Ana",
    items: [{ name: "Monitor" }],
    address: { city: "Curitibanos" },
    notified: false,
  },
  {
    id: 3,
    customerName: "Bruno",
    items: [{ name: "Headset" }],
    address: null, // pedido de retirada na loja, sem endereço de entrega
    notified: false,
  },
];

function getAll() {
  return orders;
}

function findById(id) {
  return orders.find((o) => o.id === id);
}

module.exports = { getAll, findById };
