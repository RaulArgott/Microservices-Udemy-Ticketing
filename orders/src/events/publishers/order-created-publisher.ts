import { Publisher, OrderCreatedEvent, Subjects } from "@ratickets1/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}