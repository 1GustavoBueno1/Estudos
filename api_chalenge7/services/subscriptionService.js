const db = require("../db/database");

// Cancela a assinatura. O acesso do cliente acaba na hora e ele nao deve
// mais ser cobrado nos proximos ciclos.
function cancelSubscription(id, todayISO) {
  const sub = db.findSubscriptionById(id);
  if (!sub) return null;

  sub.canceledAt = todayISO;
  sub.status = "canceled"

  return sub;
}

// Reativa uma assinatura cancelada.
function reactivateSubscription(id) {
  const sub = db.findSubscriptionById(id);
  if (!sub) return null;

  sub.status = "active";
  sub.canceledAt = null;

  return sub;
}

function getSubscription(id) {
  return db.findSubscriptionById(id);
}

function listSubscriptions() {
  return db.listSubscriptions();
}

module.exports = {
  cancelSubscription,
  reactivateSubscription,
  getSubscription,
  listSubscriptions,
};
