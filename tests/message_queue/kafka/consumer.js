const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
  logLevel: logLevel.NOTHING,
  retry: {
    retries: 10,
    initialRetryTime: 100,
  },
});

const runComsumer = async () => {
  const consumer = kafka.consumer({ groupId: "test-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
};

runComsumer().catch(console.error)
