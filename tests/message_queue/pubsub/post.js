const amqplib = require('amqplib')

const amqp_url_cloud = 'amqps://orzithmn:Cm59CysEonREAnrcbTbTtr4blD2nL0GI@octopus.rmq3.cloudamqp.com/orzithmn'

const postVideo = async ({msg}) => {
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

        //4. publish video
        channel.publish(nameExchange, '', Buffer.from(msg))

        console.log(`[x] Send Ok:::${msg}`)

        setTimeout( function(){
            conn.close()
            process.exit(0)
        }, 2000)

    } catch (error) {
        console.error(error.message)
    }
}

const msg = process.argv.slice(2).join(' ') || 'Hello Exchange'
postVideo({msg})