// Arredonda pra centavos.
function round2(value) {
  return Math.round(value * 100) / 100;
}

module.exports = { round2 };
