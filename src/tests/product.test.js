const redisPubsubService = require('../services/redisPubsub.service')

class ProductServiceTest {
    purchaseProduct(productId, quantity) {
        const order = {
            productId,
            quantity
        }
        console.log('productId', productId)
        redisPubsubService.publish('purchase_events', JSON.stringify(order))
            .then(response => console.log(`Published message: ${response}`))
            .catch(err => console.error(`Publish error: ${err}`));
        console.log("order", order)
    }
}

module.exports = new ProductServiceTest()
