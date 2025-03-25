const express = require("express");
const passport = require("passport")
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const cors = require("cors")
app.use(
    cors({
        origin: process.env.frontendURL, 
        credentials: true, 
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization", 
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    require("express-session")({
        secret: "medcare-app-key",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("Hello world");
});

const indexRouter = require("./routes/index");
app.use("/api", indexRouter);

app.listen(port, (err) => {
    if (err) console.log("Error:", err);

    console.log("Server is running on port:", port);
});