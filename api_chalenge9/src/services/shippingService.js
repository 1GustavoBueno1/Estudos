const SHIPPING_FEE = 25;
const FREE_SHIPPING_MIN = 200;

// Frete é calculado sobre o subtotal ANTES de qualquer desconto.
function shippingFor(subtotal) {
  return subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
}

module.exports = { shippingFor, SHIPPING_FEE, FREE_SHIPPING_MIN };
