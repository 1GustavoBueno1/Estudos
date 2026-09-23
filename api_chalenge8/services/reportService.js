const db = require("../db/database");
const { round2 } = require("./money");

// Vendas do periodo (datas inclusivas): quantidade de pedidos e soma do total
// pago, sem contar pedidos cancelados.
function salesReport(fromISO, toISO) {
  const orders = db
    .listOrders()
    .filter((o) => o.createdAt >= fromISO && o.createdAt <= toISO)
    .filter((o) => o.status !== "canceled");

  const total = round2(orders.reduce((sum, o) => sum + o.total, 0));

  return { from: fromISO, to: toISO, orders: orders.length, total };
}

module.exports = { salesReport };
