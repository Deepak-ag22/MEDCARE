const express = require("express");
const passport_google = require("../config/passport-google-oauth.js");
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

router.get(
    "/google",
    passport_google.authenticate("google", {
        scope: ["profile", "email"],
    })
);
router.get(
    "/google/callback",
    passport_google.authenticate("google", {
        failureRedirect: "/login",
    }),
    (req, res) => {
        res.redirect("http://localhost:3000");
    }
);

module.exports = router;
