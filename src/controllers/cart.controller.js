'use strict'

const CartService = require('../services/cart.service')
const {  SuccessResponse } = require('../core/success.response')

class CartController {
     /**
     * @desc add to cart for user
     * @param {int} userId
     * @param {*} res
     * @param {*} next
     * @method POST
     * @url /v1/api/cart/user
     * @return {
     * }
     */
    //new
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new cart successful',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    //update
    update = async(req, res, next) => {
        //new 
        new SuccessResponse({
            message: 'Create new cart successful',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    //delete
    delete = async(req, res, next) => {
        //new 
        new SuccessResponse({
            message: 'Delete new cart successful',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    //list
    listToCart = async(req, res, next) => {
        //new 
        new SuccessResponse({
            message: 'List cart success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }

}

module.exports = new CartController()