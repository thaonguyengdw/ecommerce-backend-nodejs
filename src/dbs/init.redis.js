'use strict'

/*const redis = require('redis')

 //create a new client 

const client = redis.createClient({
    host,
    port,
    password,
    username
})

client.on('error', err => {
    console.log(`Redis error: ${err}`)
})

//export
module.exports = client */

const redis = require('redis')

let client = {}, statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}

const handleEventConnection = ({
    connectionRedis
}) => {
    //check if connection is null
    
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`connectionRedis - Connection status: connected`)
    })
    
    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connectionRedis - Connection status: disconnected`)
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionRedis - Connection status: reconnecting`)
    })

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionRedis - Connection status: error ${err}`)
    })
    connectionRedis.connect()
}

const initRedis = () => {
    const instanceRedis = redis.createClient()
    client.instanceRedis = instanceRedis
    handleEventConnection({
        connectionRedis: instanceRedis
    })
}

const getRedis = () => client

const closeRedis = () => {

}

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}