import { Subjects, Publisher, ExpirationCompleteEvent } from "@ratickets1/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}