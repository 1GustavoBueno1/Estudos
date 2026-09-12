const db = require("../database/db");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withdraw(accountId, amount) {
  const account = db.findById(accountId);
  if (!account) throw new Error("Conta não encontrada");

  if (account.balance < amount) {
    throw new Error("Saldo insuficiente");
  }

  // Simula uma chamada externa (ex: validação antifraude) antes de efetivar o saque.
  await delay(50);

  account.balance -= amount;
  return account.balance;
}

function deposit(accountId, amount) {
  const account = db.findById(accountId);
  if (!account) throw new Error("Conta não encontrada");

  account.balance += amount;
  return account.balance;
}

function getSortedStatement(accountId) {
  const account = db.findById(accountId);
  if (!account) throw new Error("Conta não encontrada");

  return [...account.transactions].sort((a, b) => a.date - b.date);
}

function getTotalDeposits(accountId) {
  const account = db.findById(accountId);
  if (!account) throw new Error("Conta não encontrada");

  return account.transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
}

function tryTransfer(fromId, toId, amount) {
  const from = db.findById(fromId);
  const to = db.findById(toId);

  if (!from || !to) return { success: false, reason: "Conta não encontrada" };
  if (from.balance < amount) return { success: false, reason: "Saldo insuficiente" };

  from.balance -= amount;
  to.balance += amount;
  return { success: true };
}

function transferWithRetry(fromId, toId, amount, attempts) {
  const result = tryTransfer(fromId, toId, amount);

  if (!result.success) {
    return transferWithRetry(fromId, toId, amount, attempts);
  }

  return result;
}

module.exports = {
  withdraw,
  deposit,
  getSortedStatement,
  getTotalDeposits,
  transferWithRetry,
};
