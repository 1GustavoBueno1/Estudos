const db = require("../db/database");
const billingService = require("../services/billingService");
const subscriptionService = require("../services/subscriptionService");

// Data de referencia. Da pra sobrescrever com ?today=YYYY-MM-DD pra testar
// sempre com o mesmo resultado.
function referenceDate(req) {
  return req.query.today || new Date().toISOString().slice(0, 10);
}

function listPlans(req, res) {
  res.json(db.listPlans());
}

function listSubscriptions(req, res) {
  res.json(subscriptionService.listSubscriptions());
}

function getSubscription(req, res) {
  const id = Number(req.params.id);
  const sub = subscriptionService.getSubscription(id);

  if (!sub) {
    return res.status(404).json({ error: "assinatura nao encontrada" });
  }

  res.json(sub);
}

function getPrice(req, res) {
  const id = Number(req.params.id);
  const sub = subscriptionService.getSubscription(id);

  if (!sub) {
    return res.status(404).json({ error: "assinatura nao encontrada" });
  }

  const today = referenceDate(req);

  res.json({
    customer: sub.customer,
    planId: sub.planId,
    inTrial: billingService.isInTrial(sub, today),
    willBeBilled: billingService.shouldBill(sub),
    price: billingService.priceFor(sub),
  });
}

function getRevenue(req, res) {
  const today = referenceDate(req);
  res.json({ today, revenue: billingService.monthlyRevenue(today) });
}

async function renewAll(req, res) {
  const today = referenceDate(req);
  const invoices = await billingService.renewAll(today);
  res.json({ today, count: invoices.length, invoices });
}

function cancel(req, res) {
  const id = Number(req.params.id);
  const today = referenceDate(req);

  const sub = subscriptionService.cancelSubscription(id, today);

  if (!sub) {
    return res.status(404).json({ error: "assinatura nao encontrada" });
  }

  res.json(sub);
}

module.exports = {
  listPlans,
  listSubscriptions,
  getSubscription,
  getPrice,
  getRevenue,
  renewAll,
  cancel,
};
