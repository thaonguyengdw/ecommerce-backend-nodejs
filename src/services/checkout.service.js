'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response")

const { findCartById } = require("../models/repositories/cart.repo")

const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.server")
const { order } = require('../models/order.model')

class CheckoutService {
    // login and without 
    /*
        {
            cartId,
            userd,
            shop_order_ids: [
                {
                    shopId,
                    shop_discount: [],
                    item_products: {
                        price,
                        quantity,
                        productId,
                    }
                },
                                {
                    shopId,
                    shop_discount: [
                        {
                            "shopId",
                            "discountId",
                            "codeId"
                        }
                    ],
                    item_products: {
                        price,
                        quantity,
                        productId,
                    }
                }
            ]
        }
    */

    static async checkoutReview({
        cartId, userId, shop_order_ids = []
    }){
        //check cartId ton tai khong?
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new    BadRequestError('Cart doesn not exists')

        const checkout_order = {
            totalPrice: 0, //tong tien hang
            freeShip: 0, // phi van chuyen
            totalDiscount: 0, // tong tien discount giam gia
            totalCheckout:0,  // tong thanh toan
        }, shop_order_ids_new = []
        // var item_products = []
        //tinh tong tien bill
        // 200000
        for (let i = 0; i < shop_order_ids.length; i++){
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            // item_products=shop_order_ids[i].item_product
            //check product available
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`checkProductByServer::`, checkProductServer)
            if(!checkProductServer[0]) throw new BadRequestError(`order wrong`)

            //check tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            //tong tien truoc khi xu ly
            checkout_order.totalPrice =+ checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, //tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice, // tien sau discount
                item_products: checkProductServer
            }

            //neu shop_discounts ton tai > 0, check xem co hop le khong
            if(shop_discounts.length > 0){
                // gia su chi co 1 discount
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                //tong cong disocunt giam gia
                checkout_order.totalDiscount += discount

                // neu tien giam gia lon hon 0
                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }

                //tong thanh toan cuoi cung
                checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
                shop_order_ids_new.push(itemCheckout)
            }

        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    //order
    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address ={},
        user_payment = {}
    }){
        const { shop_order_ids_new, checkout_order } =  await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })
    
        // check lai mot lan nua xem vuot ton kho hay khong
        //get new Array Products
        const products = shop_order_ids_new.flatMap( order => order.item_products)
        console.log(`[1:]`, products)
        const acquireProduct = []
        for( let i = 0; i < array.length; i++){
            const element = array[i]
            const { productId, quantity } = products[i];
            //khoa lac quan
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push( keyLock ? true : false)
            if(keyLock){
                await releaseLock(keyLock) 
            }
        }

        //check neu co mot san pham het hang trong kho
        if(acquireProduct.includes(false)){
            throw new BadRequestError('Mot so san pham da duoc cap nhap, vui long quay lai gio hang...')
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        // truong hop: neu insert thanh cong, thi remove product co trong cart
        if(newOrder){
            // remove product in my cart

        }

        return newOrder
    }

    /*
        1> Query Orders [User]
    */
   static async getOrdersByUser(){

   }
    /*
    1> Query Order Using Id [User]
    */
    static async getOneOrdersByUser(){

    }
    
    /*
     1> Cancel Order [User]
    */
   static async cancelOrderByUser(){

   }

    /*
    1> Update Order Status [Shop/Admin]
    */
    static async updateOrderStatusByShop(){

    }

        /*
    1> Query Orders [User]
    */
    static async getOrdersByUser(){

    }
   
}

module.exports = CheckoutService