const db = require('../config/db');

exports.addDoctor = async (req, res) => {
    try {
        const {
            name,
            specialty,
            experience,
            location,
            rating,
            gender,
            image,
        } = req.body;
        let imageurl = req.file ? req.file.path : image;
        const ratings = rating || 0; 
        const doctor = await db.one(
            `INSERT INTO doctors 
                (name, specialty, experience, location, rating, gender, image)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                name,
                specialty,
                experience,
                location,
                ratings,
                gender,
                imageurl,
            ]
        );
        res.status(201).json({
            message: "Doctor added successfully",
            doctor,
        });
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ 
            message: "Error adding doctor", 
            error: error.message 
        });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const  id  = parseInt(req.params.id);
        await db.none('DELETE FROM doctors WHERE id = $1', [id]);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting doctor', error: error.message });
    }
};

exports.getAllDoctorsAdmin = async (req, res) => {
    try {
        const doctors = await db.any(
            `SELECT 
                id,
                name,
                specialty,
                experience,
                rating,
                location,
                gender,
                image
            FROM doctors 
            ORDER BY name`
        );
        
        // Send response
        res.json({
            ok: true,
            data: {
                rows: doctors
            }
        });
        
    } catch (error) {
        console.error("Error in getAllDoctorsAdmin:", error);
        res.status(500).json({
            ok: false,
            message: "Failed to fetch doctors",
            error: error.message
        });
    }
}; 



// Get all pending appointments
exports.getPendingAppointments = async (req, res) => {
    try {
        const query = `
            SELECT 
                a.id,
                a.appointment_date,
                a.slot_id,
                a.status,
                d.id as doctor_id,
                d.name as doctor_name,
                d.specialty as doctor_specialty,
                u.user_id as user_id,
                u.user_name as username,
                u.user_emailid as user_emailid
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users u ON a.user_id = u.user_id
            WHERE a.status = 'pending'  -- Only fetch pending appointments
            ORDER BY a.appointment_date DESC, a.slot_id ASC
        `;
        
        const result = await db.any(query);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching appointments:', error.message);
        res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
    }
};

// Accept appointment
exports.acceptAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await db.one(
            `UPDATE appointments 
             SET status = 'confirmed'
             WHERE id = $1
             RETURNING *`,
            [id]
        );
        res.json(appointment);
    } catch (error) {
        console.error("Error accepting appointment:", error.message);
        res.status(500).json({ message: 'Error accepting appointment', error: error.message });
    }
};

// Reject appointment
exports.rejectAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await db.one(
            `UPDATE appointments 
             SET status = 'rejected'
             WHERE id = $1
             RETURNING *`,
            [id]
        );
        res.json(appointment);
    } catch (error) {
        console.error("Error rejecting appointment:", error.message);
        res.status(500).json({ message: 'Error rejecting appointment', error: error.message });
    }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        await db.none('DELETE FROM appointments WHERE id = $1', [id]);
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error("Error deleting appointment:", error.message);
        res.status(500).json({ message: 'Error deleting appointment', error: error.message });
    }
};