require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_secret: process.env.CLOUDINARY_APISECRET,
    api_key: process.env.CLOUDINARY_APIKEY,
});

module.exports = cloudinary;