import supertest from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import mongoose from "mongoose";

it("deletes the order", async () => {
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
    });
    await ticket.save();
    
    const user = global.signin();

    const order = await supertest(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);

    await supertest(app)
        .delete(`/api/orders/${order.body.id}`)
        .set("Cookie", user)
        .send()
        .expect(204);
});