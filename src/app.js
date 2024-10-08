require('dotenv').config()  
const express = require('express')

const compression = require('compression')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()
const { v4: uuidv4} = require('uuid')
const myLogger = require('./loggers/myLogger.log.js');

// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use((req, res, next) => {
    const requestId = req.headers['x-request-id']
    req.requestId = requestId ? requestId : uuidv4()
    myLogger.log(`Input params :: ${req.method}::`, [
        req.path,
        { requestId: req.requestId},
        req.method === 'POST' ? req.body : req.quey
    ])

    next()
})
//test pub.sub redis



// init db
require('./dbs/init.mongodb')
const {initRedis} = require('./dbs/init.redis')
initRedis()



app.use('/', require('./routes'))
// handling error
app.use((req, res, next)=>{
    const error = new Error('Not found')
    error.status=404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    const resMessage = `${error.status} - ${Date.now() - error.now}ms - response: ${JSON.stringify(error)}`
    myLogger.error(resMessage, [
        req.path,
        { requestId: req.requestId },
        {
            message: error.message
        }
    ])

    return res.status(statusCode).json({
        status:'error',
        code:statusCode,
        stack: error.stack,
        message: error.message || 'Internal server error'
    })
})
module.exports = app