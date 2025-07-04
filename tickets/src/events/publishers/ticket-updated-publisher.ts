import {Publisher, Subjects, TicketUpdatedEvent} from "@ratickets1/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}