import { Publisher, OrderCancelledEvent, Subjects } from "@ratickets1/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}