import { Listener, ExpirationCompleteEvent, Subjects } from "@ratickets1/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderStatus } from "@ratickets1/common";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        if(order.status === OrderStatus.Complete) {
            return msg.ack();
        }
        order.populate('ticket');
        order.set({ status: OrderStatus.Cancelled });
        await order.save();
        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });
        msg.ack();
    }
}