const db = require("../db/database");

// Confere se existe estoque suficiente pra todos os itens do pedido.
function checkAvailability(items) {
  for (const item of items) {
    const product = db.findProduct(item.productId);

    if (!product) {
      return { ok: false, error: `produto ${item.productId} nao existe` };
    }

    if (!Number.isInteger(item.qty) || item.qty <= 0) {
      return { ok: false, error: "quantidade invalida" };
    }

    if (product.stock < item.qty) {
      return { ok: false, error: `estoque insuficiente para ${product.name}` };
    }
  }

  return { ok: true };
}

// Tira do estoque as quantidades do pedido.
function reserve(items) {
  for (const item of items) {
    const product = db.findProduct(item.productId);
    product.stock -= item.qty;
  }
}

// Devolve pro estoque as quantidades do pedido.
function release(items) {
  for (const item of items) {
    const product = db.findProduct(item.productId);
    product.stock += item.qty;
  }
}

module.exports = { checkAvailability, reserve, release };
