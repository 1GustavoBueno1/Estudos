// Servidor para testar pelo Postman. Rode: npm run dev
//   POST /__clock  {"now": "2026-11-09T10:00:00-03:00"}  -> fixa o "agora" da API (body {} volta ao relógio real)
//   POST /__reset                                         -> volta o banco ao estado inicial
// Estas rotas existem só aqui; src/ não é alterado.
const express = require('express');
const app = require('./src/app');
const { reset } = require('./src/db/database');

const dev = express();
dev.post('/__clock', express.json(), (req, res) => {
  const now = req.body && req.body.now;
  if (now) process.env.FAKE_NOW = now;
  else delete process.env.FAKE_NOW;
  res.json({ now: process.env.FAKE_NOW || 'relógio real' });
});
dev.post('/__reset', (req, res) => {
  reset();
  res.json({ ok: true });
});
dev.use(app);

const PORT = process.env.PORT || 3000;
dev.listen(PORT, () => console.log(`Dev server na porta ${PORT} (use /__clock e /__reset)`));
