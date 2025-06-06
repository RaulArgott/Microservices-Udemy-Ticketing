import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, NotAuthorizedError } from '@ratickets1/common';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // TODO: Emit an event to say this order was cancelled

    res.status(204).send(order);
});

export { router as deleteOrderRouter };