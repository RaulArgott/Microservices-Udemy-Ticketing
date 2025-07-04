import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, BadRequestError } from '@ratickets1/common';
import { body } from 'express-validator';

import { Ticket } from '../models/ticket';
import { Order, OrderStatus } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post('/api/orders',
    requireAuth,
    [
        body('ticketId').not().isEmpty().withMessage('TicketId is required')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // Find the ticket the user is trying to order in the database
        const { ticketId } = req.body;
        const ticket = await Ticket.findById(ticketId);

        // If it doesn't exist, throw an error
        if (!ticket) {
            throw new NotFoundError();
        }

        // Make sure that this ticket is not already reserved
        const existingOrder = await ticket.isReserved();
        if (existingOrder) {
            throw new BadRequestError('Ticket is already reserved');
        }

        // Calculate an expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Build the order and save it to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket: ticket
        });
        await order.save();


        //  Publish an event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            version: order.version,
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        });

        // Send back the status of the order
        res.status(201).send(order);
    });

export { router as createOrderRouter };