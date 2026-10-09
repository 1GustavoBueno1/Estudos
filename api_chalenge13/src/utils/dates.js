// Brasília é UTC-3 o ano todo (sem horário de verão).
const BRT_OFFSET_MS = -3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// Data (YYYY-MM-DD) de um instante, no calendário de Brasília.
function brtDate(date) {
  return new Date(date.getTime() + BRT_OFFSET_MS).toISOString().slice(0, 10);
}

// Partes de um instante no relógio de Brasília:
// date (YYYY-MM-DD), weekday (0 = domingo ... 6 = sábado) e minutes (minutos desde 00:00).
function brtParts(date) {
  const shifted = new Date(date.getTime() + BRT_OFFSET_MS);
  return {
    date: shifted.toISOString().slice(0, 10),
    weekday: shifted.getUTCDay(),
    minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  };
}

// Instante correspondente a (YYYY-MM-DD, minutos desde 00:00) no relógio de Brasília.
function atBrt(dateStr, minutes) {
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');
  return new Date(`${dateStr}T${hh}:${mm}:00-03:00`);
}

// Diferença em dias de calendário entre duas datas YYYY-MM-DD (b - a).
function diffDays(a, b) {
  const [ya, ma, da] = a.split('-').map(Number);
  const [yb, mb, db] = b.split('-').map(Number);
  return Math.round((Date.UTC(yb, mb - 1, db) - Date.UTC(ya, ma - 1, da)) / DAY_MS);
}

module.exports = { brtDate, brtParts, atBrt, diffDays };
