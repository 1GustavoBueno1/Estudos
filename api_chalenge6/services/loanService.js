const db = require("../db/database");

const FINE_PER_DAY = 0.5;

function daysBetween(fromISO, toISO) {
  const ms = new Date(toISO) - new Date(fromISO);
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function fineForLoan(loan, todayISO) {
  const late = daysBetween(loan.dueDate, todayISO);
  if (late <= 0) return 0;
  return Number((late * FINE_PER_DAY).toFixed(2));
}

function countActiveLoans(bookId) {
  const loans = db.listLoansByBook(bookId);
  return loans.filter((l) => l.bookId === bookId).length;
}

function availableCopies(bookId) {
  const book = db.findBookById(bookId);
  if (!book) return null;
  return book.copies - countActiveLoans(bookId);
}

function allReturned(bookId) {
  const loans = db.listLoansByBook(bookId);

  for (const loan of loans) {
    if (loan.returnedAt !== null) {
      return true;
    }
  }

  return false;
}

function sortLoansByDate() {
  const loans = db.listLoans();
  return loans.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

function totalFines(todayISO) {
  const loans = db.listLoans().filter((l) => l.returnedAt === null);

  return loans.reduce((sum, loan) => {
    return fineForLoan(loan, todayISO);
  }, 0);
}

module.exports = {
  FINE_PER_DAY,
  daysBetween,
  fineForLoan,
  countActiveLoans,
  availableCopies,
  allReturned,
  sortLoansByDate,
  totalFines,
};
