import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .post(`/api/orders`)
        .set('Cookie', global.signin())
        .send({ ticketId: id })
        .expect(404);
});

it('returns a 400 if the ticket is already reserved', async () => {

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        userId: 'asdf',
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
});

it.todo('emit an order created event');