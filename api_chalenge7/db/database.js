// Banco em memoria de um sistema de assinaturas.

const plans = [
  { id: "basic", name: "Basico", monthlyPrice: 29.9 },
  { id: "pro", name: "Pro", monthlyPrice: 79.9 },
  { id: "enterprise", name: "Enterprise", monthlyPrice: 249.9 },
];

// status: "active" | "canceled"
// trialEndsAt: null quando a assinatura nao teve periodo de teste
// canceledAt: null quando a assinatura nunca foi cancelada
const subscriptions = [
  {
    id: 1,
    customer: "Ana",
    planId: "pro",
    status: "active",
    startedAt: "2026-01-10",
    trialEndsAt: null,
    canceledAt: null,
    discountPercent: 0,
  },
  {
    id: 2,
    customer: "Bruno",
    planId: "basic",
    status: "active",
    startedAt: "2026-09-01",
    trialEndsAt: "2026-09-15",
    canceledAt: null,
    discountPercent: 0,
  },
  {
    id: 3,
    customer: "Carla",
    planId: "enterprise",
    status: "active",
    startedAt: "2026-03-01",
    trialEndsAt: null,
    canceledAt: "2026-09-10",
    discountPercent: 0,
  },
  {
    id: 4,
    customer: "Diego",
    planId: "pro",
    status: "canceled",
    startedAt: "2026-02-01",
    trialEndsAt: null,
    canceledAt: "2026-08-20",
    discountPercent: 0,
  },
  {
    id: 5,
    customer: "Elis",
    planId: "basic",
    status: "active",
    startedAt: "2026-06-01",
    trialEndsAt: null,
    canceledAt: null,
    discountPercent: 20,
  },
  {
    id: 6,
    customer: "Fabio",
    planId: "pro",
    status: "active",
    startedAt: "2026-09-18",
    trialEndsAt: "2026-10-02",
    canceledAt: null,
    discountPercent: 0,
  },
];

function listPlans() {
  return plans;
}

function findPlanById(id) {
  const plan = plans.find((p) => p.id === id)
  return {...plan} || null;
}

function listSubscriptions() {
  return [...subscriptions];
}

function findSubscriptionById(id) {
  return subscriptions.find((s) => s.id === id) || null;
}

module.exports = {
  listPlans,
  findPlanById,
  listSubscriptions,
  findSubscriptionById,
};
