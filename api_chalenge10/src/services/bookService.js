const { db } = require('../db/database');
const { AppError } = require('../utils/errors');

function list({ page, pageSize, q, available } = {}) {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  if (!(page >= 1)) page = 1;
  if (!(pageSize >= 1)) pageSize = 4;
  pageSize = Math.min(pageSize, 20);

  let books = db.books;
  if (available === 'true') {
    books = books.filter((b) => b.available >= 1);
  }
  if (q) {
    const term = String(q).toLowerCase();
    books = books.filter((b) => b.title.toLowerCase().includes(term));
  }

  const total = books.length;
  const start = (page - 1) * pageSize;
  const items = books.slice(start, start + pageSize);
  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

function getById(id) {
  const book = db.books.find((b) => b.id === id);
  if (!book) throw new AppError(404, 'Livro não encontrado');
  return book;
}

module.exports = { list, getById };
