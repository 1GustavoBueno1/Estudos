// Brasília é UTC-3 o ano todo (sem horário de verão).
const BRT_OFFSET_MS = -3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// Data (YYYY-MM-DD) de um instante, no calendário de Brasília.
function brtDate(date) {
  return new Date(date.getTime() + BRT_OFFSET_MS).toISOString().slice(0, 10);
}

// Soma n dias a uma data YYYY-MM-DD.
function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

// Instante 23:59:59.999 (Brasília) de uma data YYYY-MM-DD.
function endOfDay(dateStr) {
  return new Date(`${dateStr}T23:59:59.999-03:00`);
}

// Diferença em dias de calendário entre duas datas YYYY-MM-DD (b - a).
function diffDays(a, b) {
  const [ya, ma, da] = a.split('-').map(Number);
  const [yb, mb, db] = b.split('-').map(Number);
  return Math.round((Date.UTC(yb, mb - 1, db) - Date.UTC(ya, ma - 1, da)) / DAY_MS);
}

module.exports = { brtDate, addDays, endOfDay, diffDays };
