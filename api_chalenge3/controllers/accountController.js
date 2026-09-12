const db = require("../database/db");
const accountService = require("../services/accountService");

function getAccount(req, res) {
  const id = Number(req.params.id);
  const account = db.findById(id);

  if (!account) {
    return res.status(404).json({ error: "Conta não encontrada" });
  }

  res.json(account);
}

async function withdraw(req, res) {
  const id = Number(req.params.id);
  const { amount } = req.body;

  try {
    const balance = await accountService.withdraw(id, amount);
    res.json({ balance });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function deposit(req, res) {
  const id = Number(req.params.id);
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Valor de depósito inválido" });
  }

  const balance = accountService.deposit(id, amount);
  res.json({ balance });
}

function getStatement(req, res) {
  const id = Number(req.params.id);
  const statement = accountService.getSortedStatement(id);
  res.json(statement);
}

function getTotalDeposits(req, res) {
  const id = Number(req.params.id);
  const total = accountService.getTotalDeposits(id);
  res.json({ total });
}

function transfer(req, res) {
  const fromId = Number(req.params.id);
  const { toId, amount } = req.body;

  const result = accountService.transferWithRetry(fromId, toId, amount, 3);
  res.json(result);
}

module.exports = {
  getAccount,
  withdraw,
  deposit,
  getStatement,
  getTotalDeposits,
  transfer,
};
