'use strict';

const crypto = require('crypto');

//model OTP
const OTP = require('../models/otp.model');

const generatorTokenRandom = () => {
    const token = crypto.randomInt(0, Math.pow(2, 32))
    return token
    // const token = crypto.randomBytes(32); // Generate 32 random bytes
    // return token.toString('hex'); // Convert to hex string for easier handling
}

const newOtp = async ({
    email
}) => {
    try {
        const token = generatorTokenRandom();
        const newToken = await OTP.create({
            otp_token: token,
            otp_email: email,
        });
        return newToken;
    } catch (error) {
        console.error('Error creating OTP:', error);
        throw error; // Rethrow or handle error as needed
    }
}

module.exports = {
    newOtp
}