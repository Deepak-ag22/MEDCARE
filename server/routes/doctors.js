const express = require("express");
const db = require("../config/db");
const {
    getAllDoctors,
    filterDoctors,
    searchDoctors,
    getDoctorById
} = require("../controllers/doctorController");
const router = express.Router();

router.post("/", getAllDoctors);
router.post("/filter", filterDoctors);
router.get("/search",  searchDoctors);
router.get('/:id', getDoctorById);

module.exports = router;