const express = require("express");
const multer=require("multer")

const { getAllDoctorsAdmin, addDoctor, deleteDoctor,getPendingAppointments,acceptAppointment,deleteAppointment,rejectAppointment } = require("../controllers/adminController");
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});
const router = express.Router();

router.get('/all-docs', getAllDoctorsAdmin);
router.post('/create-doc', upload.single('image'), addDoctor);
router.delete('/:id', deleteDoctor);
router.get('/appointments',getPendingAppointments);
router.put('/appointments/:id/accept',acceptAppointment)
router.put('/appointments/:id/reject',rejectAppointment)
router.delete('/appointments/:id',deleteAppointment);
module.exports = router; 