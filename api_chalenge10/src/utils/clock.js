// Relógio central. Em testes, defina FAKE_NOW (ex.: 2026-11-10T15:00:00-03:00).
function now() {
  return process.env.FAKE_NOW ? new Date(process.env.FAKE_NOW) : new Date();
}

module.exports = { now };
