const { getRedis } = require('../dbs/init.redis');

class RedisPubSubService {
    constructor() {
        const { instanceConnectPub, instanceConnectSub } = getRedis();
        if (!instanceConnectPub || typeof instanceConnectPub.publish !== 'function') {
            throw new Error('Redis publish client is not properly initialized');
        }
        if (!instanceConnectSub || typeof instanceConnectSub.subscribe !== 'function') {
            throw new Error('Redis subscribe client is not properly initialized');
        }
        this.redisClientPub = instanceConnectPub;
        this.redisClientSub = instanceConnectSub;
    }

    publish(channel, message) {
        return new Promise((resolve, reject) => {
            this.redisClientPub.publish(channel, message, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }

    subscribe(channel, callback) {
        this.redisClientSub.subscribe(channel);
        console.log('channel', channel);
        this.redisClientSub.on('message', (subscriberChannel, message) => {
            if (channel === subscriberChannel) {
                callback(channel, message);
            }
        });
    }
}

module.exports = new RedisPubSubService();
