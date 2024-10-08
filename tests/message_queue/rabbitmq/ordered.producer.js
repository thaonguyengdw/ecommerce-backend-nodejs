'use strict'

const amqp = require('amqplib')

async function consumerOrderedMessage() {
    //1. create connection
    const connection = await amqp.connect('amqp://guest:12345@localhost')

    //2. create channel
    const channel = await connection.createChannel()
    
    //3. create Queue
    const queueName = 'ordered-queued-message'
    await channel.assertQueue(queueName, {
        durable: true // nghĩa là khi restart thì Queue không mất message
    })
    
    for (let i = 0; i < 10; i++) {
        const message = `ordered-queued-message::${i}`
        console.log(`message: ${message}`)
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true // nghĩa là message sẽ lưu trữ trong file log
        })
    }

    setTimeout(() => {
        connection.close()
    }, 1000)
}

consumerOrderedMessage().catch(err => console.error(err))
