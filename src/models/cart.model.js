'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME =  'Carts'

const cartSchema = new Schema({
    cart_state: {
        type: String, required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: { type: Array, required: true, default: []},
    // cart_products: [{ 
    //     productId: { type: String, required: true },
    //     shopId: { type: String, required: true },
    //     quantity: { type: Number, required: true },
    //     name: { type: String, required: true },
    //     price: { type: Number, required: true }
    // }],
    /*
        [
            {
                productId,
                shopId,
                quantity:
                name:
                price:
            }
        ]
     */
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true }
},{
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createOn',
        updatedAt: 'modifiedOn'
    }
})

module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema )
}