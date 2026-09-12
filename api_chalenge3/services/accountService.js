const db = require("../database/db");

const lock = new Map()


function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withdraw(accountId, amount) {
  const previousLock = lock.get(accountId) ?? Promise.resolve();

  let release;

  const currentLock = new Promise(resolve => {
    release = resolve;
  });

  const nextLock = previousLock.then(() => currentLock);

  lock.set(accountId, nextLock);

  await previousLock;

  try {
    const account = db.findById(accountId);

    if (!account) {
      throw new Error("Conta não encontrada");
    }

    if (account.balance < amount) {
      throw new Error("Saldo insuficiente");
    }

    await delay(50);

    account.balance -= amount;

    return account.balance;
  } finally {
    release();

    if (lock.get(accountId) === nextLock) {
      lock.delete(accountId);
    }
  }
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
  const transactions = [...account.transactions].sort((a, b) => {
    const mesA = a.date.slice(5, 7)
    const mesB = b.date.slice(5, 7)

    if (mesA !== mesB) {
      return mesA - mesB
    }

    const diaA = a.date.slice(8, 10)
    const diaB = b.date.slice(8, 10)

    return diaA - diaB
  })
  return transactions
}

function getTotalDeposits(accountId) {
  const account = db.findById(accountId);
  if (!account) throw new Error("Conta não encontrada");

  return Number(account.transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
    .toFixed(2));
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
