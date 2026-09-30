const { db } = require('../db/database');
const { AppError } = require('../utils/errors');
const { round2 } = require('../utils/money');
const clock = require('../utils/clock');

function findByCode(code) {
  return db.coupons.find((c) => c.code === String(code).toUpperCase());
}

// Valida o cupom para um pedido com o subtotal informado.
// Lança 422 se o cupom não puder ser usado.
function validate(code, subtotal) {
  const coupon = findByCode(code);
  if (!coupon) throw new AppError(422, 'Cupom inválido');

  if (new Date(coupon.expiresAt) < clock.now()) {
    throw new AppError(422, 'Cupom expirado');
  }
  if (coupon.uses > coupon.maxUses) {
    throw new AppError(422, 'Cupom esgotado');
  }
  if (subtotal < coupon.minSubtotal) {
    throw new AppError(422, `Pedido mínimo de R$ ${coupon.minSubtotal} para este cupom`);
  }
  return coupon;
}

function discountFor(coupon, subtotal, shipping) {
  let discount;
  if (coupon.type === 'percent') {
    discount = ((subtotal + shipping) * coupon.value) / 100;
  } else {
    discount = coupon.value;
  }
  // o desconto nunca pode ser maior que o subtotal
  return round2(Math.min(discount, subtotal));
}

function registerUse(coupon) {
  coupon.uses += 1;
}

module.exports = { validate, discountFor, registerUse };
