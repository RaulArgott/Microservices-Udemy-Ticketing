import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { OrderCancelledEvent, OrderStatus } from "@ratickets1/common";
import { Order } from "../../../models/orders";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    // create an instance of a listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: "asdf",
        status: OrderStatus.Created,
        version: 0,
        price: 20,
    });
    await order.save();
    // create a fake data event
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 0,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
        }
    }
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, data, msg }
}

it('updates the order status to cancelled', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);
    expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});