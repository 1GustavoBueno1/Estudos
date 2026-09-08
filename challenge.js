// Desafio 2: Arrays puros — 5 funções, cada uma com 1 bug.
// Nenhum Express, nenhum banco de verdade — só JS puro.
// Não mude a assinatura das funções, só o corpo.

function paginate(items, { page = 1, limit = 3 } = {}) {
  const start = (page - 1) * limit;
  const end = start + limit;
  return items.slice(start, end);
}

function removeById(items, id) {
  const find = findUserById(id)
  const index = items.indexOf(find);
  return items
}

function findUserById(users, id) {
  return users.find((u) => (u.id === id));
}

function chunkArray(items, { size = 2 } = {}) {
  const chunks = [];
  for (let i = 0; i <= items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function getConfig(options) {
  const { retries = 3, timeout = 1000 } = options;
  return { retries, timeout };
}

module.exports = {
  paginate,
  removeById,
  findUserById,
  chunkArray,
  getConfig,
};
