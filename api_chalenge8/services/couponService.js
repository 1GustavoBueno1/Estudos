const db = require("../db/database");
const { round2 } = require("./money");

// Confere se o cupom pode ser usado nesse subtotal e calcula o desconto.
// O cupom vale ate o fim do dia de expiresAt.
function validateCoupon(code, subtotal, todayISO) {
  const coupon = db.findCoupon(code);

  if (!coupon) {
    return { ok: false, error: "cupom nao existe" };
  }

  if (todayISO > coupon.expiresAt) {
    return { ok: false, error: "cupom expirado" };
  }

  if (coupon.uses >= coupon.maxUses) {
    return { ok: false, error: "cupom esgotado" };
  }

  if (subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      error: `pedido minimo de R$ ${coupon.minSubtotal} pra esse cupom`,
    };
  }

  coupon.uses += 1;

  const discount =
    coupon.type === "percent"
      ? round2(subtotal * (coupon.value / 100))
      : Math.min(coupon.value, subtotal);

  return { ok: true, discount };
}

function listCoupons() {
  return db.listCoupons();
}

module.exports = { validateCoupon, listCoupons };
