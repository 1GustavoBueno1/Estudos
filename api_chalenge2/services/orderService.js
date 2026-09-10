const db = require("../database/db");

// Simula o envio de uma notificação (ex: email/SMS), demorando um pouco.
function sendNotification(order) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Notificação enviada para ${order.customerName} (pedido #${order.id})`);
    }, 20);
  });
}

async function notifyPendingOrders() {
  const orders = db.getAll();
  const results = [];

  for (var i = 0; i < orders.length; i++) {
    setTimeout(async () => {
      const message = await sendNotification(orders[i]);
      results.push(message);
    }, 10);
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  return results;
}

function addItemToCart(order, newItem) {
  const alreadyInCart = order.items.includes(newItem);

  if (alreadyInCart) {
    return { added: false, reason: "Item já está no carrinho" };
  }

  order.items.push(newItem);
  return { added: true };
}

function calculateTax(total) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(total * 0.1), 10);
  });
}

function getOrderTotal(order) {
  const itemPrice = 50;
  const total = order.items.length * itemPrice;

  return calculateTax(total).then((tax) => {
    const finalTotal = total + tax;
  }).then((finalTotal) => {
    return { total, tax: finalTotal - total, finalTotal };
  });
}

function getCustomerCity(order) {
  const {
    address: { city },
  } = order;
  return city;
}

function chargeCustomer(order) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (order.items.length === 0) {
        reject(new Error("Pedido sem itens, não é possível cobrar"));
      } else {
        resolve(`Cobrança de ${order.items.length * 50} realizada`);
      }
    }, 10);
  });
}

async function processOrder(orderId) {
  const order = db.findById(orderId);
  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  try {
    const chargeResult = chargeCustomer(order);
    return { success: true, chargeResult };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  notifyPendingOrders,
  addItemToCart,
  getOrderTotal,
  getCustomerCity,
  processOrder,
};
