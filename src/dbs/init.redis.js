'use strict';

const redis = require('redis');

//create a new client redis

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

client.on('error', err => {
    console.error(`Redis error: ${err}`);
})

module.exports = client