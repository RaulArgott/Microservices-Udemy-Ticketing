import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-pubilsher";
import { natsWrapper } from "../nats-wrapper";

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

    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId,
    });
});

export { expirationQueue };