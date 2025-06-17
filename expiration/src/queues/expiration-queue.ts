import Queue from "bull";

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>("expiration-queue", {
    redis: {
        host: process.env.REDIS_HOST,
    },
});

expirationQueue.process(async (job) => {
    console.log("Processing job", job.data.orderId);
});

export { expirationQueue };