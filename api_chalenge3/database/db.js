const accounts = [
  {
    id: 1,
    name: "Gustavo",
    balance: 500,
    transactions: [
      { date: "2026-01-05", amount: 100 },
      { date: "2026-01-01", amount: 50 },
      { date: "2026-01-10", amount: -20 },
      { date: "2026-01-03", amount: 30 },
    ],
  },
  {
    id: 2,
    name: "Ana",
    balance: 1000,
    transactions: [
      { date: "2026-02-01", amount: 10.1 },
      { date: "2026-02-02", amount: 20.2 },
      { date: "2026-02-03", amount: 5.05 },
      { date: "2026-02-04", amount: -3 },
    ],
  },
];

function findById(id) {
  return accounts.find((a) => a.id === id);
}

module.exports = { findById };
