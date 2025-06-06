import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();
    return ticket;
};

it('fetches the orders for a particular user', async () => {
    // Create three tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    // Create order as user 1
    const userOne = global.signin();
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201);

    // Create two orders as user 2
    const userTwo = global.signin();
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201);
    const { body: orderThree } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201);



    // Make sure to get orders for user 1
    const userOneResponse = await request(app)
        .get('/api/orders')
        .set('Cookie', userOne)
        .send()
        .expect(200);

    // Make sure we only got the orders for user 1
    expect(userOneResponse.body.length).toEqual(1);
    expect(userOneResponse.body[0].id).toEqual(orderOne.id);
    expect(userOneResponse.body[0].ticket.id).toEqual(ticketOne.id);

    // Make request to get orders for user 2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .send()
        .expect(200);

    // Make sure we only got the orders for user 2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderTwo.id);
    expect(response.body[1].id).toEqual(orderThree.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});