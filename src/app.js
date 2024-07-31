require('dotenv').config()  
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//test pub.sub redis



// init db
require('./dbs/init.mongodb')
const {initRedis} = require('./dbs/init.redis')
initRedis()

require('./tests/inventory.test')

const productTest = require('./tests/product.test')
productTest.purchaseProduct('product:001', 10)

// const { checkOverLoad } = require('./helpers/check.connect')
// checkOverLoad()
// init routes

// const InventoryService= require('./tests/inventory.test')
// const inventoryInstance = new InventoryService()
// inventoryInstance.updateInventory({ productId: 'product:001', quantity: 10 })

app.use('/', require('./routes'))
// handling error
app.use((req, res, next)=>{
    const error = new Error('Not found')
    error.status=404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status:'error',
        code:statusCode,
        stack: error.stack,
        message: error.message || 'Internal server error'
    })
})
module.exports = app