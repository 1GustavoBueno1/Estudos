const { db } = require('../db/database');
const { AppError } = require('../utils/errors');
const { round2 } = require('../utils/money');
const clock = require('../utils/clock');
const { brtDate, addDays, endOfDay } = require('../utils/dates');
const memberService = require('./memberService');
const bookService = require('./bookService');
const { fineFor } = require('./fineService');

// Monta a resposta. "overdue" é derivado: nunca é gravado no banco.
function present(loan) {
  let status = loan.status;
  if (status === 'active' && clock.now() > new Date(loan.dueAt)) status = 'overdue';
  return {
    id: loan.id,
    memberId: loan.memberId,
    bookId: loan.bookId,
    loanedAt: loan.loanedAt,
    dueAt: loan.dueAt,
    renewals: loan.renewals,
    returnedAt: loan.returnedAt,
    fine: loan.fine,
    status,
  };
}

function findLoan(id) {
  const loan = db.loans.find((l) => l.id === id);
  if (!loan) throw new AppError(404, 'Empréstimo não encontrado');
  return loan;
}

function create({ memberId, bookId }) {
  const member = memberService.getById(memberId);
  const book = bookService.getById(bookId);
  const rules = memberService.rulesFor(member);

  if (book.isReference) {
    throw new AppError(422, 'Livros de referência não podem ser emprestados');
  }
  if (book.available <= 0) {
    throw new AppError(409, 'Nenhuma cópia disponível');
  }
  if (db.loans.some((l) => l.memberId === member.id && l.bookId === book.id && l.status === 'active')) {
    throw new AppError(409, 'O membro já está com este livro');
  }
  if (member.unpaidFines > 0) {
    throw new AppError(422, 'Membro com multa pendente');
  }
  if (memberService.activeLoans(member).length >= rules.maxActive) {
    throw new AppError(422, 'Limite de empréstimos ativos atingido');
  }

  // Só baixa o estoque depois de todas as validações (R8).
  book.available -= 1;
  const now = clock.now();
  const loan = {
    id: db.nextLoanId++,
    memberId: member.id,
    bookId: book.id,
    loanedAt: now.toISOString(),
    dueAt: endOfDay(addDays(brtDate(now), rules.termDays)).toISOString(),
    renewals: 0,
    returnedAt: null,
    fine: 0,
    status: 'active',
  };
  db.loans.push(loan);
  return present(loan);
}

function getById(id) {
  return present(findLoan(id));
}

function giveBack(id) {
  const loan = findLoan(id);
  if (loan.status === 'returned') {
    throw new AppError(409, 'Empréstimo já devolvido');
  }
  const member = memberService.getById(loan.memberId);
  const book = bookService.getById(loan.bookId);
  const rules = memberService.rulesFor(member);
  const now = clock.now();

  const fine = fineFor(member, rules, new Date(loan.dueAt), now);
  member.unpaidFines = round2(member.unpaidFines + fine);
  book.available += 1;
  loan.returnedAt = now.toISOString();
  loan.fine = fine;
  loan.status = 'returned';
  return present(loan);
}

function renew(id) {
  const loan = findLoan(id);
  if (loan.status === 'returned') {
    throw new AppError(409, 'Empréstimo já devolvido');
  }
  if (clock.now() > new Date(loan.dueAt)) {
    throw new AppError(409, 'Empréstimo atrasado não pode ser renovado');
  }
  if (loan.renewals >= 1) {
    throw new AppError(409, 'Limite de renovações atingido');
  }
  const member = memberService.getById(loan.memberId);
  const rules = memberService.rulesFor(member);

  // renova pelo prazo do tipo de membro, a partir do vencimento atual
  const base = brtDate(new Date(loan.dueAt));
  loan.dueAt = endOfDay(addDays(base, rules.termDays)).toISOString();
  loan.renewals += 1;
  return present(loan);
}

module.exports = { create, getById, giveBack, renew };
