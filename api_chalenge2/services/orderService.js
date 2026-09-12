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

  for (let i = 0; i < orders.length; i++) {
      const message = await sendNotification(orders[i]);
      results.push(message);
    }
  return results;
}

function addItemToCart(order, newItem) {
  const alreadyInCart = order.items.find(((item_name) => item_name.name === newItem.name));
  if (alreadyInCart) {
    return { added: false, reason: "Item já está no carrinho", status: 403};
  }
  order.items.push(newItem);
    return { added: true, status: 201};
  }
function calculateTax(total) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(total * 0.1), 10);
  });
}

async function getOrderTotal(order) {
  const itemPrice = 50;
  const total = order.items.length * itemPrice;
  const tax = await calculateTax(total)
  const finalTotal = total + tax;
  return { total, tax: finalTotal - total, finaltotal: finalTotal };
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
