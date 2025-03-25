const express = require("express");
const {
    getUsers,
    getMe,
    registerUser,
    loginUser,
    logoutUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.get("/me", getMe);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
