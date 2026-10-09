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
const hhmm = (iso) => new Date(new Date(iso).getTime() - 3 * 3600 * 1000).toISOString().slice(11, 16);

(async () => {
  show(1, 'horários colados (Dra. Helena, 09:00 e depois 09:30)');
  at('2026-11-09T10:00:00-03:00');
  let a = await call('POST', '/appointments', { patientId: 1, doctorId: 1, startsAt: '2026-11-10T09:00:00-03:00' });
  console.log('09:00 (Ana):', a.status);
  let b = await call('POST', '/appointments', { patientId: 4, doctorId: 1, startsAt: '2026-11-10T09:30:00-03:00' });
  console.log('09:30 (Diego):', b.status, JSON.stringify(b.body.error || ''));

  show(2, 'taxa de cancelamento do convênio (Bruno cancela 5h antes)');
  at('2026-11-09T10:00:00-03:00');
  a = await call('POST', '/appointments', { patientId: 2, doctorId: 1, startsAt: '2026-11-10T14:00:00-03:00' });
  at('2026-11-10T09:00:00-03:00');
  let r = await call('POST', `/appointments/${a.body.id}/cancel`);
  console.log('cancelamento:', r.status, 'taxa =', r.body.fee);
  r = await call('GET', '/patients/2');
  console.log('débito do Bruno:', r.body.owed);

  show(3, 'horários livres da Dra. Helena em 2026-11-12 (quinta)');
  at('2026-11-09T10:00:00-03:00');
  r = await call('GET', '/doctors/1/slots?date=2026-11-12');
  console.log(r.status, r.body.slots.length, 'horários:', r.body.slots.map(hhmm).join(' '));
  for (const t of ['12:00', '18:00']) {
    const x = await call('POST', '/appointments', { patientId: 1, doctorId: 1, startsAt: `2026-11-12T${t}:00-03:00` });
    console.log(`marcar ${t}:`, x.status, JSON.stringify(x.body.error || ''));
  }

  show(4, 'marcar em cima da hora (agora 08:30, consulta às 10:00)');
  at('2026-11-10T08:30:00-03:00');
  r = await call('POST', '/appointments', { patientId: 1, doctorId: 1, startsAt: '2026-11-10T10:00:00-03:00' });
  console.log('marcar:', r.status, JSON.stringify(r.body.error || ''));

  show(5, 'taxa de cancelamento (Ana cancela 1h antes de uma consulta de R$ 180)');
  at('2026-11-09T10:00:00-03:00');
  a = await call('POST', '/appointments', { patientId: 1, doctorId: 1, startsAt: '2026-11-10T15:00:00-03:00' });
  at('2026-11-10T14:00:00-03:00');
  r = await call('POST', `/appointments/${a.body.id}/cancel`);
  console.log('cancelamento:', r.status, 'taxa =', r.body.fee);

  show(6, 'remarcação no mesmo dia (consulta às 15:00, agora 10:00, novo horário 16:30)');
  at('2026-11-09T10:00:00-03:00');
  a = await call('POST', '/appointments', { patientId: 1, doctorId: 1, startsAt: '2026-11-10T15:00:00-03:00' });
  at('2026-11-10T10:00:00-03:00');
  r = await call('POST', `/appointments/${a.body.id}/reschedule`, { startsAt: '2026-11-10T16:30:00-03:00' });
  console.log('remarcar:', r.status, JSON.stringify(r.body.error || ''));

  server.close();
})();
