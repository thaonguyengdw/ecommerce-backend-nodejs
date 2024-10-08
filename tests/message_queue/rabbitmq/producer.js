const amqp = require('amqplib')

const messages = 'new a product: xyz'

const runProducer = async () => {
    try {
        //1. create connection
        const connection = await amqp.connect('amqp://guest:12345@localhost')

        //2. create channel
        const channel = await connection.createChannel()
        
        //3. create Queue
        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true // nghĩa là khi restart thì Queue không mất message
        })

        //4.send message to Queue
        channel.sendToQueue( queueName, Buffer.from(messages)) /* Bufer vận chuyển dữ liệu bằng bytes => nhanh hơn obj message 
        bình thường, chúng ta có thể mã hóa thông điệp bằng bytes và dữ liệu được đẩy đi siêu nhanh trong không gian mạng */
        console.log(`message sent:`, messages)

        //5. close connection
        setTimeout( () => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error
    }
}

runProducer().catch(console.error)