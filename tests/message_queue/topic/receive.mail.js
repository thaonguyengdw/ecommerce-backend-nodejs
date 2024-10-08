const amqplib = require('amqplib')

const amqp_url_cloud = 'amqps://orzithmn:Cm59CysEonREAnrcbTbTtr4blD2nL0GI@octopus.rmq3.cloudamqp.com/orzithmn'

const receiveMail = async () => {
    try {
        //1. create connect
        const conn = await amqplib.connect(amqp_url_cloud)

        //2. create channel
        const channel = await conn.createChannel()

        //3. create exchange
        const nameExchange = 'send_mail'

        await channel.assertExchange(nameExchange, 'topic', {
            durable: false
        })

        //4.create queue
        const {queue} = await channel.assertQueue('', {
            exclusive: true
        })

        //5. binding
        const agrs = process.argv.slice(2)
        if(!agrs.length){
            process.exit(0)
        }

        /*
            * có nghĩa là phù hợp với bất kỳ từ nào
            # khớp với một hay nhiều từ bất kỳ
        */

        console.log(`waiting queue ${queue}::: topic::${agrs}`)

        agrs.forEach( async key => {
            await channel.bindQueue(queue, nameExchange, key)
        })

        await channel.consume(queue, msg => {
            console.log(`Routing key:${msg.fields.routingKey}::: msg:::${msg.content.toString()}`)
        })
    } catch (error) {
        console.error(error.message)
    }
}

receiveMail()