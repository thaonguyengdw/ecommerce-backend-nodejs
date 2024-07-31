'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response")

const discount = require("../models/discount.model")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils")
const { findAllDiscountCodesUnSelect, findAllDiscountCodesSelect, checkDiscountExists} = require('../models/repositories/discount.repo')
 
/**
 * Discount services
 * 1 - Generator Discount Code [Shop | Admin]
 * 2 - Get discount amount [User]
 * 3 - Get all discount code [user]
 * 4 - Verify discount code [user]
 * 5 - Delete discount Code [Admin | Shop]
 * 6 - Canccel discount code [user]
 */

class DiscountService {

    static async createDiscountCode(payload){
        const {
            code, start_date, end_date, is_active, users_used,
            shopId, min_order_value, product_ids, applies_to, name, description, 
            type, value, max_value, max_uses, uses_count, max_uses_per_user
        } = payload

        //kiem tra
        // if(new Date() < new Date(start_date) || new Date() > new Date(end_date)){
        //     throw new BadRequestError('Discount code has expired!')
        // }


        if(new Date(start_date) > new Date(end_date)) {
            throw new BadRequestError('Start date must before end date')
        }

        //create index for disccount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active){
            throw new BadRequestError('Discount exists!')
        }

        const newDiscount = discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value,
            discount_max_value: max_value,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })
        
        return newDiscount
    } 

    static async updateDiscountCode(){
        /**
         * Get all discount codes available with products
         */
    }

    //get all product belong to a discount code
    static async getAllDiscountCodesWithProducts({
        code, shopId, userId, limit, page
    }){
        // create index for discount_code 
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if(!foundDiscount || !foundDiscount.discount_is_active){
            throw new NotFoundError('discount not exists!')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if(discount_applies_to === 'all'){
            //get all products
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if(discount_applies_to === 'specific'){
            // get the products ids
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }

    /**
     * Get all discount code of Shop
     */

    static async getAllDiscountCodesByShop({ limit, page, shopId }){
        const discounts = await findAllDiscountCodesSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            select: ['discount_shopId', 'discount_name'],
            model: discount
        })

        return discounts
    }

    /**
      Apply discount code
      products = [
        {
            productId,
            shopId,
            quantity,
            name,
            price
        },
        {
            productId,
            shopId,
            quantity,
            name,
            price
        }
      ]
     */

    static async getDiscountAmount({ codeId, userId, shopId, products}){

        const foundDiscount = await checkDiscountExists({
            model: discount, 
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }      
        })

        if(!foundDiscount) throw new NotFoundError(`discount doesn't exists`)
        const { discount_is_active, 
                discount_max_uses, 
                discount_users_used,
                discount_min_order_value,
                discount_max_uses_per_user,
                discount_type,
                discount_value,
                 } = foundDiscount

        if(!discount_is_active) throw new Error(`discount is expired`)
        if(!discount_max_uses) throw new Error(`discount is out`)
        
        // if(new Date() < new Date(start_date) || new Date() > new Date(end_date)){
        //     throw new NotFoundError(`discount code has expired`)
        // }

        //Check xem co set gia tri toi thieu hay khong
        let totalOrder = 0
        if(discount_min_order_value > 0){
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if(totalOrder < discount_min_order_value) {
                throw new NotFoundError(`discount required a minimum order value of ${discount_min_order_value}`)
            }

            if(discount_max_uses_per_user){
                const userUserDiscount = discount_users_used.find(user => user.userId === userId)
                if(userUserDiscount > 0){
                    //...
                }
            }

            // check xem discount nay la fixed_amount or percentage
            const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value/100)
            
            return {
                totalOrder,
                discount: amount,
                totalPrice: totalOrder - amount
            }
        } 
    }

    static async deleteDiscountCode({ shopId, codeId}){
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        return deleted
    }
    /*
        Cancel discount code
    */
    static async cancelDiscountCode({ codeId, shopId, userId}){
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if(!foundDiscount) throw new NotFoundError(`discount doesn't exists`)
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId // đưa người dùng này ra ngoài
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result
    }
}

module.exports = DiscountService
