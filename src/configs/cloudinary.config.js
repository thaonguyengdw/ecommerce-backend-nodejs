'use strict'

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: 'shopdevgdw',
  api_key:'285575724371478',
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Log the configuration
// console.log(cloudinary.config());

module.exports = cloudinary;