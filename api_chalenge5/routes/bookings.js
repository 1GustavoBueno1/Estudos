const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.get("/rooms", bookingController.listRooms);
router.get("/rooms/available", bookingController.listAvailableRooms);

router.get("/bookings", bookingController.listBookings);
router.get("/bookings/:id", bookingController.getBooking);
router.post("/bookings", bookingController.createBooking);
router.patch("/bookings/:id/people", bookingController.updatePeople);

module.exports = router;
