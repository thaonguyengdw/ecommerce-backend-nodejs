const amqp = require('amqplib')

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()
        
        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        //Receive message
        channel.consume( queueName, (messages) => {
            console.log(`Received ${messages.content.toString()}`)
        },{
            noAck: true //đã nhận msg, không nhận nhiều lần những lần gửi msg ở prodcuer
        })
    } catch (error) {
        console.error('error publish rabbitMQ::', error)
        throw error
    }
}

runConsumer().catch(console.error)