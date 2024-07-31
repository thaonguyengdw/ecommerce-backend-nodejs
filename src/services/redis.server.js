'use strict'

const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')

const redisClient = redis.createClient()

/* redisClient.ping((err, result) => {
    if(err){
        console.log('Error connecting to Redis::', err)
    }else {
        console.log(`Connected to Redis`)
    }
})
// Function to reconnect or handle connection logic
// Promisify Redis commands
const getAsync = promisify(redisClient.get).bind(redisClient);
async function performRedisOperation() {
    try {
        // Check if the client is connected before performing operations
        if (!redisClient.connect) {
            await connectToRedis(); 
        }
        const result = await getAsync('someKey');
        console.log('Result from Redis:', result);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function connectToRedis() {
    return new Promise((resolve, reject) => {
        redisClient.on('connect', () => {
            console.log('Reconnected to Redis');
            resolve();
        });

        redisClient.on('error', (err) => {
            console.error('Error reconnecting to Redis:', err);
            reject(err);
        });

        redisClient.connect();
    });
}

// // Call the asynchronous function
// performRedisOperation();
//promisify: convert a func into a async await func */
/* redisClient.ping((err, result) => {
    if(err){
        console.log('Error connecting to Redis::', err)
    }else {
        console.log(`Connected to Redis`)
    }
}) */

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTimes = 10;
    const exprireTime = 3000; //3 seconds tam lock

    for(let i = 0; i < retryTimes.length; i++){
        // tao mot key, thang nao nam giu duoc vao thanh toan
        const result = await setnxAsync(key, exprireTime)
        // neu tra ve = 0 thì có r thì dc vao
        // neu tra ve = 1 thi tao moi
        console.log(`result:::`, result)
        if(result === 1){
            // thao tac voi inventory (kho)
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })
            if(isReservation.modifiedCount){
                await pexpire(key, exprireTime)
                return key
            }
            return null;
        }else{
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}   

module.exports = {
    acquireLock,
    releaseLock,
}