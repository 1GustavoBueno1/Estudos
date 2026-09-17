const rooms = [
  { id: 1, name: "Sala Azul", capacity: 10, pricePerHour: 50 },
  { id: 2, name: "Sala Verde", capacity: 4, pricePerHour: 30 },
  { id: 3, name: "Auditorio", capacity: 50, pricePerHour: 200 },
];

const bookings = [
  {
    id: 1,
    roomId: 1,
    customer: "Ana",
    start: "2026-10-01T09:00:00",
    end: "2026-10-01T11:00:00",
    people: 6,
    price: 110,
  },
];

let nextId = 2;

// Devolve uma copia da sala, pra quem chamar nao mexer no "banco" sem querer.
function findRoomById(id) {
  const room = rooms.find((r) => r.id === id);
  return room ? { ...room } : null;
}

// Devolve copias de todas as salas.
function listRooms() {
  return rooms.map((r) => ({ ...r }));
}

// Devolve uma copia da reserva.
function findBookingById(id) {
  const booking = bookings.find((b) => b.id === id);
  return booking ? { ...booking } : null;
}

// Devolve copias de todas as reservas.
function listBookings() {
  return bookings.map((b) => ({ ...b }));
}

// Devolve copias das reservas de uma sala.
function listBookingsByRoom(roomId) {
  return bookings.filter((b) => b.roomId === roomId).map((b) => ({ ...b }));
}

// Guarda a reserva no "banco" e devolve ela ja com o id preenchido.
function insertBooking(booking) {
  booking.id = nextId++;
  bookings.push(booking);
  return booking;
}

function updateBooking(id, changes) {
  const booking = bookings.find((b) => b.id === id)
  if (!booking) return null;
  Object.assign(booking, {people: changes})
  return { ...booking }
}

module.exports = {
  rooms,
  bookings,
  findRoomById,
  listRooms,
  findBookingById,
  listBookings,
  listBookingsByRoom,
  insertBooking,
  updateBooking,
};
