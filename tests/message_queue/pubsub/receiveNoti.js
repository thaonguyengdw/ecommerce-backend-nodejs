const amqplib = require('amqplib')

const amqp_url_cloud = 'amqps://orzithmn:Cm59CysEonREAnrcbTbTtr4blD2nL0GI@octopus.rmq3.cloudamqp.com/orzithmn'

const receiveNoti = async () => {
    try {
        //1. create connect
        const conn = await amqplib.connect(amqp_url_cloud)

        //2. create channel
        const channel = await conn.createChannel()

        //3. create exchange
        const nameExchange = 'video'

        await channel.assertExchange(nameExchange, 'fanout', '', {
            durable: false
        })

        //4. create queue
        const { queue } = await channel.assertQueue('', {
            exclusive: true
        })

        console.log(`nameQueue::, ${queue}`)

        //5.binding
        await channel.bindQueue(queue, nameExchange, '')

        await channel.consume( queue, msg => {
            console.log(`msg::`, msg.content.toString())
        },{
            noAck: true
        })

    } catch (error) {
        console.error(error.message)
    }
}

receiveNoti()