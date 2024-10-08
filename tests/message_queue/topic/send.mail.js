const amqplib = require('amqplib')

const amqp_url_cloud = 'amqps://orzithmn:Cm59CysEonREAnrcbTbTtr4blD2nL0GI@octopus.rmq3.cloudamqp.com/orzithmn'

const sendMail = async () => {
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

        //cách lấy message trwucj tiếp từ terminal
        const agrs = process.argv.slice(2)
        const msg = agrs[1] || 'Fixed'
        const topic = agrs[0]

        console.log(`msg::${msg}::::topic::${topic}`)
        //4. publish email
        channel.publish(nameExchange, topic, Buffer.from(msg))

        console.log(`[x] Send Ok:::${msg}`)

        setTimeout( function(){
            conn.close()
            process.exit(0)
        }, 2000)

    } catch (error) {
        console.error(error.message)
    }
}

sendMail()