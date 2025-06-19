import { Subjects, Publisher, PaymentCreatedEvent } from "@ratickets1/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}