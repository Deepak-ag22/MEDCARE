require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");

const { CLOUDINARY_CLOUDNAME, CLOUDINARY_APISECRET, CLOUDINARY_APIKEY } = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUDNAME,
    api_secret: CLOUDINARY_APISECRET,
    api_key: CLOUDINARY_APIKEY,
});

module.exports = cloudinary;