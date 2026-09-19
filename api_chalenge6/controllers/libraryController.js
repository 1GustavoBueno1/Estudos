const db = require("../db/database");
const loanService = require("../services/loanService");
const notificationService = require("../services/notificationService");

// Data de referencia para as multas. Da pra sobrescrever com ?today=YYYY-MM-DD
// pra testar sempre com o mesmo resultado.
function referenceDate(req) {
  return req.query.today || new Date().toISOString().slice(0, 10);
}

function listBooks(req, res) {
  res.json(db.listBooks());
}

function getAvailability(req, res) {
  const id = Number(req.params.id);
  const book = db.findBookById(id);

  if (!book) {
    return res.status(404).json({ error: "livro nao encontrado" });
  }

  res.json({
    book: book.title,
    copies: book.copies,
    available: loanService.availableCopies(id),
    allReturned: loanService.allReturned(id),
  });
}

function listLoans(req, res) {
  res.json(db.listLoans());
}

function listLoansSorted(req, res) {
  res.json(loanService.sortLoansByDate());
}

function getFines(req, res) {
  const today = referenceDate(req);
  res.json({ today, total: loanService.totalFines(today) });
}

async function getNotice(req, res) {
  const id = Number(req.params.id);
  const loan = db.findLoanById(id);

  if (!loan) {
    return res.status(404).json({ error: "emprestimo nao encontrado" });
  }

  const book = db.findBookById(loan.bookId);
  const today = referenceDate(req);
  const fine = loanService.fineForLoan(loan, today);

  const notice = await notificationService.noticeFor(loan, book, fine);

  res.json(notice);
}

module.exports = {
  listBooks,
  getAvailability,
  listLoans,
  listLoansSorted,
  getFines,
  getNotice,
};
