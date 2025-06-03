import {Publisher, Subjects, TicketCreatedEvent} from "@ratickets1/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}