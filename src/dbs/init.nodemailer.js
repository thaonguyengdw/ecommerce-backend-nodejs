'use strict';

const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com', // set the smtp server to send through
    port: 587, // TCP port to connect
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.USER_MAIL, // sender gmail address
        pass: process.env.USER_PASSWORD // app password from gmail account
    },
    tls: {
        rejectUnauthorized: false // false to disable SSL certificate verification
    }
});

module.exports = transport