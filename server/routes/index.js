const express = require("express");

const router = express.Router();

const usersRouter = require("./usersRouter");
router.use("/users", usersRouter);

const doctorsRouter = require('./doctors');
router.use('/doctors', doctorsRouter);

const appointmentsRouter = require("./appointmentRouter");
router.use("/appointments", appointmentsRouter);

const adminRouter = require("./adminRouter");
router.use("/admin",adminRouter);
module.exports = router;
