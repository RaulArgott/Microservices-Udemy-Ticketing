import {Publisher, Subjects, TicketUpdatedEvent} from "@ratickets1/common";

export class TicketCreatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}