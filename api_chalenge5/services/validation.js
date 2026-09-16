// Valida os dados de uma reserva.
//
// Retorna { ok: true } quando esta tudo certo.
// Retorna { ok: false, reason: "..." } quando tem algo errado.
function validateBooking(data, room) {
  if (!data.customer) {
    return { ok: false, reason: "customer e obrigatorio" };
  }

  if (!data.start || !data.end) {
    return { ok: false, reason: "start e end sao obrigatorios" };
  }

  if (!room) {
    return { ok: false, reason: "sala nao encontrada" };
  }

  if (data.people > room.capacity) {
    return { ok: false, reason: "numero de pessoas excede a capacidade da sala" };
  }

  if (new Date(data.end) <= new Date(data.start)) {
    return { ok: false, reason: "end precisa ser depois de start" };
  }

  return { ok: true };
}

module.exports = { validateBooking };
