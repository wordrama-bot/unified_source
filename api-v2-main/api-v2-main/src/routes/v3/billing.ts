import express from 'express';

import billingController from '../../controllers/billing';

export const router = express.Router();

router.post('/checkout', billingController.createCheckoutSession);
router.get('/session/:sessionId', billingController.getCheckoutSession);

export default router;
