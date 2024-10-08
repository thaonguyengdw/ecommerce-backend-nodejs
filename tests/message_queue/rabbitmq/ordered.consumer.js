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
    
    // Set prefetched messages to 1 to ensure only one ack at a time
    /*mỗi tác vụ (message) sẽ được xử lý cùng 1 lúc mà thôi
    không được xử lý cùng 1 consumer mà 2 tác vụ (message), tức là 1 consumer xử lý theo tuần tự như nhau 
    nôm na là 1 consumer 1 lúc chỉ được nhận 1 tin nhắn mà thôi => nên message sẽ được nhận tuần tự*/

    channel.prefetch(1)

    channel.consume( queueName, msg => {
        const message = msg.content.toString()

        setTimeout(() => {
            console.log('processed', message)
            channel.ack(msg) // acknowledge the message and send it
        }, Math.random() * 1000)
    })
}

consumerOrderedMessage().catch(err => console.error(err))
