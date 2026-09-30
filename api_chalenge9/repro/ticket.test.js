// Reprodução dos itens do TICKET.md.
// Passar aqui NÃO significa que o desafio está fechado: há bugs que o ticket não cita.
const test = require('node:test');
const assert = require('node:assert/strict');
const { start, stop, reset, call } = require('./helpers');

test.before(start);
test.after(stop);
test.beforeEach(reset);

test('ticket 1: cupom BEMVINDO10 em pedido de R$ 100 dá R$ 10,00 de desconto', async () => {
  const res = await call('POST', '/orders', {
    customerId: 1,
    items: [{ productId: 9, quantity: 50 }], // 50 adesivos x R$ 2,00
    couponCode: 'BEMVINDO10',
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.subtotal, 100);
  assert.equal(res.body.discount, 10);
  assert.equal(res.body.shipping, 25);
  assert.equal(res.body.total, 115);
});

test('ticket 2: cancelar pedido devolve o estoque', async () => {
  const created = await call('POST', '/orders', {
    customerId: 1,
    items: [{ productId: 4, quantity: 2 }], // garrafa: estoque 3
  });
  assert.equal(created.status, 201);
  assert.equal((await call('GET', '/products/4')).body.stock, 1);

  const cancelled = await call('POST', `/orders/${created.body.id}/cancel`);
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.body.status, 'cancelled');
  assert.equal((await call('GET', '/products/4')).body.stock, 3);
});

test('ticket 3: paginando a lista aparecem os 12 produtos, sem repetir', async () => {
  const seen = [];
  for (let page = 1; page <= 3; page++) {
    const res = await call('GET', `/products?page=${page}`);
    assert.equal(res.status, 200);
    seen.push(...res.body.items.map((p) => p.id));
  }
  assert.deepEqual(seen, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});

test('ticket 4 (regra R10): pedido de R$ 190 paga frete; de R$ 200 é grátis', async () => {
  const a = await call('POST', '/orders', {
    customerId: 1,
    items: [{ productId: 9, quantity: 95 }], // 95 x 2,00 = 190
  });
  assert.equal(a.body.subtotal, 190);
  assert.equal(a.body.shipping, 25);

  const b = await call('POST', '/orders', {
    customerId: 1,
    items: [{ productId: 9, quantity: 100 }], // 100 x 2,00 = 200
  });
  assert.equal(b.body.subtotal, 200);
  assert.equal(b.body.shipping, 0);
});

test('ticket 6 (regra R16): pedido enviado não pode ser cancelado', async () => {
  const created = await call('POST', '/orders', {
    customerId: 1,
    items: [{ productId: 1, quantity: 1 }],
  });
  const id = created.body.id;
  assert.equal((await call('PATCH', `/orders/${id}/status`, { status: 'paid' })).status, 200);
  assert.equal((await call('PATCH', `/orders/${id}/status`, { status: 'shipped' })).status, 200);

  const res = await call('POST', `/orders/${id}/cancel`);
  assert.equal(res.status, 409);
  assert.equal((await call('GET', `/orders/${id}`)).body.status, 'shipped');
});
