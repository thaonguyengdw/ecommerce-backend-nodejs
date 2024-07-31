const redisPubsubService = require('../services/redisPubsub.service')

class ProductServiceTest {
    purchaseProduct( productId, quantity){
        const order = {
            productId,
            quantity
        }
        console.log('productId', productId)
        redisPubsubService.publish('purchase_events', JSON.stringify(order))
        console.log("order", order)
    }
}

module.exports = new ProductServiceTest()