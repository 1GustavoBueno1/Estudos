const app = require('../src/app');
const { reset } = require('../src/db/database');

let server;
let base;

async function start() {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
}

async function stop() {
  await new Promise((resolve) => server.close(resolve));
}

async function call(method, path, body) {
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    /* sem corpo */
  }
  return { status: res.status, body: json };
}

module.exports = { start, stop, reset, call };
