'use strict'

const CheckoutService = require('../services/checkout.service')
const {  SuccessResponse } = require('../core/success.response')

class CheckoutController {
    //new
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Checkout cart successful',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }

}

module.exports = new CheckoutController()