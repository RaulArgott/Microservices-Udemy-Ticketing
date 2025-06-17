import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteEvent, OrderStatus } from "@ratickets1/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // create an instance of a listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: "concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();
    const order = Order.build({
        userId: "asdf",
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket,
    });
    await order.save();

    // create a fake data event
    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id,
    };
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };
    return { listener, data, msg };
};

it("updates the order status to cancelled", async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // write assertions to make sure ack function is called
    const order = await Order.findById(data.orderId);
    expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // write assertions to make sure ack function is called
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});