import express from 'express';

import billingController from '../../controllers/billing';

export const router = express.Router();

router.post('/', billingController.handleStripeWebhook);

export default router;
