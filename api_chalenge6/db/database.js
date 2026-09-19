// Banco em memoria de uma biblioteca.

const books = [
  { id: 1, title: "Clean Code", copies: 3 },
  { id: 2, title: "O Hobbit", copies: 2 },
  { id: 3, title: "Duna", copies: 1 },
];

// returnedAt: null = o livro ainda esta com a pessoa.
const loans = [
  { id: 1, bookId: 1, member: "Ana", dueDate: "2026-09-01", returnedAt: null },
  { id: 2, bookId: 1, member: "Bruno", dueDate: "2026-09-21", returnedAt: null },
  { id: 3, bookId: 1, member: "Carla", dueDate: "2026-08-01", returnedAt: "2026-08-05" },
  { id: 4, bookId: 2, member: "Diego", dueDate: "2026-07-01", returnedAt: "2026-07-02" },
  { id: 5, bookId: 2, member: "Elis", dueDate: "2026-07-15", returnedAt: "2026-07-20" },
  { id: 6, bookId: 2, member: "Fabio", dueDate: "2026-08-01", returnedAt: "2026-08-01" },
  { id: 7, bookId: 3, member: "Gustavo", dueDate: "2026-09-26", returnedAt: null },
];

function listBooks() {
  return books;
}

function findBookById(id) {
  return books.find((b) => b.id === id) || null;
}

function listLoans() {
  return [...loans]
}

function findLoanById(id) {
  return loans.find((l) => l.id === id) || null;
}

function listLoansByBook(bookId) {
  return loans.filter((l) => l.bookId === bookId);
}

module.exports = {
  listBooks,
  findBookById,
  listLoans,
  findLoanById,
  listLoansByBook,
};
