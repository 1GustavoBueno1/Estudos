// Reproduz os itens do TICKET.md. Rode com: npm run repro
const { reset } = require('./src/db/database');
const app = require('./src/app');

const server = app.listen(0);
const base = `http://127.0.0.1:${server.address().port}`;

async function call(method, url, body) {
  const res = await fetch(base + url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json() };
}
const at = (iso) => { process.env.FAKE_NOW = iso; };
const show = (n, title) => { reset(); delete process.env.FAKE_NOW; console.log(`\n=== Item ${n}: ${title}`); };

(async () => {
  show(1, 'multa do estudante (Bruno, "O Cortiço")');
  at('2026-10-01T10:00:00-03:00');
  let l = await call('POST', '/loans', { memberId: 2, bookId: 3 });
  console.log('empréstimo:', l.status, 'vence', l.body.dueAt);
  at('2026-12-01T10:00:00-03:00');
  let r = await call('POST', `/loans/${l.body.id}/return`);
  console.log('devolução:', r.status, 'multa =', r.body.fine);

  show(2, 'GET /books?available=true (Capitães da Areia, id 2, tem 1 cópia)');
  r = await call('GET', '/books?available=true&pageSize=20');
  console.log('ids listados:', r.body.items.map((b) => b.id).join(','), '| total', r.body.total);

  show(3, 'renovação (Ana, "Dom Casmurro", emprestado 01/10, renovado 03/10)');
  at('2026-10-01T10:00:00-03:00');
  l = await call('POST', '/loans', { memberId: 1, bookId: 1 });
  console.log('vencimento original:', l.body.dueAt);
  at('2026-10-03T10:00:00-03:00');
  r = await call('POST', `/loans/${l.body.id}/renew`);
  console.log('após renovar:', r.status, 'vence', r.body.dueAt);

  show(4, 'multa por poucas horas (Ana devolve 08h do dia seguinte ao vencimento)');
  at('2026-10-01T10:00:00-03:00');
  l = await call('POST', '/loans', { memberId: 1, bookId: 4 });
  console.log('vence', l.body.dueAt);
  at('2026-10-16T08:00:00-03:00');
  r = await call('POST', `/loans/${l.body.id}/return`);
  console.log('devolução:', r.status, 'multa =', r.body.fine);

  show(5, 'renovar empréstimo atrasado (Ana)');
  at('2026-10-01T10:00:00-03:00');
  l = await call('POST', '/loans', { memberId: 1, bookId: 5 });
  at('2026-10-16T08:00:00-03:00');
  r = await call('POST', `/loans/${l.body.id}/renew`);
  console.log('renovar:', r.status, JSON.stringify(r.body));

  show(6, 'emprestar o "Atlas Geográfico" (id 10)');
  r = await call('POST', '/loans', { memberId: 1, bookId: 10 });
  console.log('empréstimo:', r.status, JSON.stringify(r.body));

  server.close();
})();
