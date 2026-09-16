const bookingService = require("../services/bookingService");
const { validateBooking } = require("../services/validation");
const db = require("../db/database");

function listRooms(req, res) {
  res.json(bookingService.getAllRooms());
}

function listAvailableRooms(req, res) {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: "informe start e end na query" });
  }

  res.json(bookingService.getAvailableRooms(start, end));
}

function listBookings(req, res) {
  res.json(bookingService.getBookings());
}

function getBooking(req, res) {
  const id = Number(req.params.id);
  const booking = bookingService.getBooking(id);

  if (!booking) {
    return res.status(404).json({ error: "reserva nao encontrada" });
  }

  res.json(booking);
}

function createBooking(req, res) {
  const data = req.body;
  const room = db.findRoomById(data.roomId);

  if (!validateBooking(data, room)) {
    return res.status(400).json({ error: "dados invalidos" });
  }

  const booking = bookingService.createBooking(data);

  res.status(201).json(booking);
}

function updatePeople(req, res) {
  const id = Number(req.params.id);
  const { people } = req.body;

  const booking = db.findBookingById(id);

  if (!booking) {
    return res.status(404).json({ error: "reserva nao encontrada" });
  }

  booking.people = people;

  res.json(booking);
}

module.exports = {
  listRooms,
  listAvailableRooms,
  listBookings,
  getBooking,
  createBooking,
  updatePeople,
};
