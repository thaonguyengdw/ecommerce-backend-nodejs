'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

//order-001: order successfully
//order-002: order fail
//promotion-001: new PROMOTION
// shop-001: new product by User following


const notificationSchema = new Schema({
    noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'] },
    noti_senderId: { type: Schema.Types.ObjectId, required: true,  ref: 'Shop' },
    noti_receivedId: { type: Number, required: true },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {}}
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    NOTI: model(DOCUMENT_NAME, notificationSchema)
}