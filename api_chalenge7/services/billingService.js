const db = require("../db/database");

// A assinatura ainda esta dentro do periodo de teste gratuito?
// O periodo de teste vale ate o fim do dia de trialEndsAt.
function isInTrial(sub, todayISO) {
  if (!sub.trialEndsAt) return false;
  return new Date(todayISO) < new Date(sub.trialEndsAt);
}

// Essa assinatura deve ser cobrada no ciclo de hoje?
function shouldBill(sub) {
  return sub.status === "active";
}

// Preco mensal que essa assinatura paga, ja com o desconto dela aplicado.
function priceFor(sub) {
  const plan = db.findPlanById(sub.planId);
  if (!plan) return 0;

  if (sub.discountPercent > 0) {
    plan.monthlyPrice = Number(
      (plan.monthlyPrice * (1 - sub.discountPercent / 100)).toFixed(2)
    );
  }

  return plan.monthlyPrice;
}

// Receita recorrente do mes: soma do que cada assinatura cobravel paga.
// Quem esta em periodo de teste ainda nao paga, entao nao entra na conta.
function monthlyRevenue(todayISO) {
  const subs = db.listSubscriptions();

  const total = subs
    .filter((s) => shouldBill(s) && !isInTrial(s, todayISO))
    .reduce((sum, s) => sum + priceFor(s), 0);

  return Number(total.toFixed(2));
}

// Emite a fatura da assinatura. Simula a chamada do gateway de pagamento.
function createInvoice(sub, todayISO) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        subscriptionId: sub.id,
        customer: sub.customer,
        amount: priceFor(sub),
        issuedAt: todayISO,
      });
    }, 10);
  });
}

// Renovacao em lote: emite a fatura de todas as assinaturas cobraveis.
async function renewAll(todayISO) {
  const subs = db
    .listSubscriptions()
    .filter((s) => shouldBill(s) && !isInTrial(s, todayISO));

  const invoices = subs.map(async (sub) => {
    const invoice = await createInvoice(sub, todayISO);
    return invoice;
  });

  return invoices;
}

module.exports = {
  isInTrial,
  shouldBill,
  priceFor,
  monthlyRevenue,
  createInvoice,
  renewAll,
};
