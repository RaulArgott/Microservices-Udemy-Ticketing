import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@ratickets1/common';
import { body } from 'express-validator';

const router = express.Router();

router.post('/api/orders',
    requireAuth,
    [
        body('ticketId').not().isEmpty().withMessage('TicketId is required')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        

    });

export { router as createOrderRouter };