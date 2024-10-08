'use strict';
const { createClient } = require('redis');
const { RedisErrorResponse } = require('../core/error.response');
require('dotenv').config();

let client = {}, statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}, connectTimeout;

const REDIS_CONNECT_TIMEOUT = 10000;
const REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: ` Không thể kết nối đến Redis trong ${REDIS_CONNECT_TIMEOUT} ms`,
        en: `Cannot connect to Redis in ${REDIS_CONNECT_TIMEOUT} ms`
    }
}

const handleTimeoutError = () => {
    connectTimeout = setTimeout(() => {
        throw new RedisErrorResponse({
            message: REDIS_CONNECT_MESSAGE.message.vn,
            statusCode: REDIS_CONNECT_MESSAGE.code
        })
    }, REDIS_CONNECT_TIMEOUT);
}

const handleEventConnect = ({ connectionRedis }) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`connectionRedis - Connection status: connected`)
        clearTimeout(connectTimeout);
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connectionRedis - Connection status: disconnected`)
        // handleTimeoutError();
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionRedis - Connection status: reconnecting`)
        clearTimeout(connectTimeout);
    })

    connectionRedis.on(statusConnectRedis.ERROR, (error) => {
        console.log(`connectionRedis - Connection status: ERROR ${error}`)
        // handleTimeoutError();
    })

    connectionRedis.connect();
}

const initRedis = () => {
    try {
        const instanceRedisPub = createClient(); // Client cho PUBLISH
        const instanceRedisSub = createClient(); // Client cho SUBSCRIBE
        const instanceRedisOther = createClient(); // Client cho SET, HASH, v.v.

        client.instanceConnectPub = instanceRedisPub;
        client.instanceConnectSub = instanceRedisSub;
        client.instanceConnectOther = instanceRedisOther;

        handleEventConnect({ connectionRedis: instanceRedisPub });
        handleEventConnect({ connectionRedis: instanceRedisSub });
        handleEventConnect({ connectionRedis: instanceRedisOther });
    } catch (error) {
        console.log('Error in Redis initRedis', error);
    }
};

const getRedis = () => client;

const closeRedis = () => {
    client.instanceConnectPub.disconnect();
    client.instanceConnectSub.disconnect();
    client.instanceConnectOther.disconnect();
};

module.exports = {
    initRedis,
    getRedis,
    closeRedis,
};
