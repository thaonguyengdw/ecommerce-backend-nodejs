'use strict';

const { ErrorResponse } = require('../core/error.response')
const { sendEmailToken } = require('./email.service')

const USER = require('../models/user.model');

const newUserService = async ({
    email = null,
    captcha = null,
}) => {
    //1. check email exists in the dbs
    const user = await USER.findOne({ email });

    //2. if exists
    if(user) {
        return ErrorResponse({
            message: 'Email already exists.'
        })
    }

    //3. send token via email user
    const result = await sendEmailToken({
        email
    });

    return {
        message: 'verify email user',
        metadata: {
            token: result
        }
    }
}

module.exports = { 
    newUserService
}