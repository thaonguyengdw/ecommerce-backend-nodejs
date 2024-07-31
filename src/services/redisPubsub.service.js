const Redis = require('redis')

const {getRedis} = require('../dbs/init.redis');

const {
    instanceConnect:redisClient
} = getRedis()

class RedisPubSubService {

    constructor(){
        this.subscriber = Redis.createClient()
        this.publisher = Redis.createClient()
    }

    publish( channel, message ){
        // await this.publisher.connect();
        // await this.publisher.publish(channel, message)

        this.publisher.connect();
        return new Promise((resolve, reject) => {
            // this.publisher.connect();
            this.publisher.publish(channel, message, (err, reply) => {
                if(err){
                    reject(err)
                }else {
                    resolve(reply)
                }
            })
        })
    }

    subscribe(channel, callback){
        this.subscriber.connect()
        this.subscriber.subscribe(channel)
        this.subscriber.on('message', (subscriberChannel, message) => {
            if(channel === subscriberChannel) {
                callback(channel, message)
            }
        })

    }
}

module.exports = new RedisPubSubService()