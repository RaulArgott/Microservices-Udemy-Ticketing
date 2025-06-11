import supertest from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

it("returns 404 if the ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await supertest(app)
        .get(`/api/orders/${id}`)
        .set("Cookie", global.signin())
        .send()
        .expect(404);
});

it("returns 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await supertest(app)
        .get(`/api/orders/${id}`)
        .send()
        .expect(401);
});

it("returns 401 if the user does not own the ticket", async () => {
  
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });
    await order.save();

    await supertest(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", global.signin())
        .send()
        .expect(401);
});