const express = require("express");
const passport = require("passport");
const { getAvailableSlots, bookAppointment, getUserAppointments } = require("../controllers/appointmentController");

const router = express.Router();
router.get(
  "/available-slots/:doctorId/:date",
  passport.checkAuthentication,
  getAvailableSlots
);

// Book an appointment
router.post("/book", passport.checkAuthentication, bookAppointment);

// Get user's appointments
router.get(
  "/my-appointments",
  passport.checkAuthentication,
  getUserAppointments
);

module.exports = router;
