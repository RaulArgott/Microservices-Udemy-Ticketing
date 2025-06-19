import { OrderCreatedEvent, OrderStatus } from "@ratickets1/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
    // create an instance of a listener
    const listener = new OrderCreatedListener(natsWrapper.client);
    // create a fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'asdf',
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 20
        }
    }
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, data, msg }
}

it('replicates the order info', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});