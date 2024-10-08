const amqp = require('amqplib')
const messages = 'new a product: xyz'

const log = console.log
console.log = function(){
    log.apply(console, [new Date()].concat(arguments))
}

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationEx' //notification direct
        const notiQueue = 'notificationQueueProcess' //assertQueue 
        const notificationExchangeDLX = 'notificationExDLX' //notification direct
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' //notification direct

        // direct: truyền tin nhắn dựa trên kết quả khớp chính xác nhất của khóa định tuyến - notificationRoutingKeyDLX 
        //mà chúng ta xuất bản bằng tin nhắn
        //1. create Exchange - Declare the dead-letter exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true,//loại trao đổi náy sẽ tồn tại ở producer khi máy chủ khởi động lại - restart docker rabbitmqq
        })

        //2. create Queue - Declare the queue with both DLX and routing key
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, /* exclusive = tính duy nhất, cho phép các kết nối khác truy cập cùng một hàng đợi hay không, nếu exclusive: true
            thì khi một consumer ngưng nhận tin thì queue của nó tự động xóa*/
            durable: true, 
            arguments: {
                'x-dead-letter-exchange': notificationExchangeDLX,  // DLX exchange
                'x-dead-letter-routing-key': notificationRoutingKeyDLX // DLX routing key
            },
            // deadlLetterExchange: notificationExchangeDLX,
            // deadLetterRoutingKey: notificationRoutingKeyDLX
            /* nếu một tin nhắn hết hạn hoặc bị lỗi thì nó sẽ gửi đến sàn ExchangeDXL với khóa định tuyến được chỉ định bởi  
            deadLetterRoutingKey: notificationRoutingKeyDLX để khớp một cách rõ ràng và chuẩn nhất*/
        })
        //3. bind Queue => điều hướng cho Exchange tiếp cận Queue nào
        await channel.bindQueue(queueResult.queue, notificationExchange, 'notificationRoutingKey') 
        /* liên kết giữa queueName và notificationExchange
        có nghĩa là các message đã xuất bản, đã publish của sàn notificationEXchange sẽ được định tuyến đến notificationQueueProcess
        nôm na: notificationExchange => định tuyến đến notificationQueueProcess
        notificationExchangeDLX => định tuyến đến notificationRoutingKeyDLX*/

        //4. send mesage
        const msg = 'a new product'
        console.log(`producer msg::`, msg)
        channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000' // TTL: time to line nghĩa là trong vòng 10s nếu ta ko xử lý message thì nó sẽ đóng
        }) //Buffer để tạo dữ liệu cho nhanh

        setTimeout( () => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error
    }
}

runProducer().catch(console.error)