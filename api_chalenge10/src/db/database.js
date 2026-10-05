const seed = require('./seed.json');

// Banco em memória. Os serviços devem sempre ler db.books, db.loans etc.
// (nunca guardar referência antiga), pois reset() troca os arrays.
const db = {
  members: [],
  books: [],
  loans: [],
  nextLoanId: 1,
};

function reset() {
  const copy = JSON.parse(JSON.stringify(seed));
  db.members = copy.members;
  db.books = copy.books;
  db.loans = [];
  db.nextLoanId = 1;
}

reset();

module.exports = { db, reset };
