const { Kafka, logLevel  } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
    logLevel: logLevel.NOTHING,
    retry: {
        retries: 10,
        initialRetryTime: 100,
      },
})

const producer = kafka.producer({
    retry: {
      retries: 3 // Set a limit on retries
    }
  })

const runProducer = async () => {
    try {
        await producer.connect()
        await producer.send({
            topic: 'test-topic',
            messages: [
                { value: 'Hello KafkaJS user by thaonguyengdw!' },
            ],
        })
        await producer.disconnect()
    } catch (error) {
        console.error('Error in producer:', error)
    }
}

runProducer().catch(console.error)