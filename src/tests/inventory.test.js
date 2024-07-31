const redisPubSubService = require('../services/redisPubsub.service')

class InventoryService {
    constructor(){
        console.log(`đây là constructor`)
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            console.log(`Received message:`, message);
            // InventoryService.updateInventory({ productId: 'product:001', quantity: 10 })
        })

    }
    updateInventory({ productId, quantity }){

        //update the inventory logic
        console.log(`[0001]: Update inventory ${productId} with quantity ${quantity}`)
    }
}
//InventoryService.updateInventory({ productId: 'product:001', quantity: 10 })

module.exports =  InventoryService