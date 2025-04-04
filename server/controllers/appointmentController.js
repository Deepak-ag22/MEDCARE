const db = require("../config/db");

// Get available slots for a doctor on a specific date
async function getAvailableSlots(req, res) {
  const { doctorId, date } = req.params;

  try {
    const slots = await db.any(
      `SELECT * FROM slots 
       WHERE doctor_id = $1
       ORDER BY slot_time`,
      [doctorId]
    );

    const unavailableSlots = await db.any(
      `SELECT a.slot_id 
       FROM appointments a
       WHERE a.doctor_id = $1 
       AND a.appointment_date = $2
       AND a.status IN ('pending', 'confirmed')`,
      [doctorId, date]
    );

    const unavailableSlotIds = new Set(unavailableSlots.map((slot) => slot.slot_id));

    const availableSlots = slots.map((slot) => ({
      ...slot,
      is_available: !unavailableSlotIds.has(slot.id),
    }));

    return res.json(availableSlots);
  } catch (error) {
    console.error("Error getting available slots:", error);
    return res.status(500).json({
      message: "Error getting available slots",
      error: error.message,
    });
  }
}

// Book an appointment
async function bookAppointment(req, res) {
  const { doctorId, slotId, appointmentType, appointmentDate } = req.body;
  const userId = req.user.user_id;

  try {
    const existingAppointment = await db.oneOrNone(
      `SELECT * FROM appointments 
       WHERE slot_id = $1 
       AND appointment_date = $2
       AND status IN ('pending', 'confirmed')`,
      [slotId, appointmentDate]
    );

    if (existingAppointment) {
      return res.status(400).json({ message: "Slot already booked for this date" });
    }

    const slot = await db.oneOrNone(
      `SELECT * FROM slots WHERE id = $1 AND doctor_id = $2`,
      [slotId, doctorId]
    );

    if (!slot) {
      return res.status(404).json({ message: "Slot not found or does not belong to this doctor" });
    }

    const appointment = await db.one(
      `INSERT INTO appointments 
       (user_id, doctor_id, slot_id, appointment_type, status, appointment_date) 
       VALUES ($1, $2, $3, $4, 'pending', $5) 
       RETURNING *`,
      [userId, doctorId, slotId, appointmentType, appointmentDate]
    );

    return res.json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);

    if (error.code === "23505") {
      return res.status(400).json({ message: "This slot is already booked for the selected date." });
    }

    return res.status(500).json({ message: "Error booking appointment. Please try again later." });
  }
}

// Get user's appointments
async function getUserAppointments(req, res) {
  const userId = req.user.user_id;

  try {
    const appointments = await db.any(
      `SELECT a.*, s.slot_time, s.slot_type 
       FROM appointments a
       JOIN slots s ON a.slot_id = s.id
       WHERE a.user_id = $1
       ORDER BY s.slot_time DESC`,
      [userId]
    );
    return res.json(appointments);
  } catch (error) {
    console.error("Error getting appointments:", error);
    return res.status(500).json({ message: "Error getting appointments" });
  }
}

module.exports = { getAvailableSlots, bookAppointment, getUserAppointments };