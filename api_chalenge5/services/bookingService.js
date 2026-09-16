const db = require("../db/database");

// Dois intervalos de tempo se sobrepoem?
function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && aEnd >= bStart;
}

// Quantas horas tem entre start e end.
function hoursBetween(start, end) {
  return (new Date(end) - new Date(start)) / (1000 * 60 * 60);
}

// Aplica a taxa de servico de 10% sobre o preco da reserva.
function applyServiceFee(booking) {
  booking.price = Number((booking.price * 1.1).toFixed(2));
  return booking;
}

// Todas as salas cadastradas, sem filtro nenhum.
function getAllRooms() {
  return db.listRooms();
}

// Apenas as salas que estao livres no intervalo informado.
function getAvailableRooms(start, end) {
  return db.listRooms().filter((room) => {
    const roomBookings = db.listBookingsByRoom(room.id);

    const temConflito = roomBookings.some((b) =>
      overlaps(
        new Date(start),
        new Date(end),
        new Date(b.start),
        new Date(b.end)
      )
    );

    return !temConflito;
  });
}

// Cria a reserva ja com o preco calculado e a taxa de servico aplicada,
// e guarda no banco.
function createBooking(data) {
  const room = db.findRoomById(data.roomId);
  const hours = hoursBetween(data.start, data.end);

  const booking = {
    roomId: data.roomId,
    customer: data.customer,
    start: data.start,
    end: data.end,
    people: data.people,
    price: room.pricePerHour * hours,
  };

  applyServiceFee(booking);

  return db.insertBooking(booking);
}

function getBooking(id) {
  return db.findBookingById(id);
}

function getBookings() {
  return db.listBookings();
}

module.exports = {
  overlaps,
  hoursBetween,
  applyServiceFee,
  getAllRooms,
  getAvailableRooms,
  createBooking,
  getBooking,
  getBookings,
};
