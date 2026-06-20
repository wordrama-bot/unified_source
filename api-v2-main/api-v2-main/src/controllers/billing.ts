import type { Request, Response } from 'express';

async function createCheckoutSession(req: Request, res: Response) {
  return res.status(501).json({ error: 'Checkout session creation not implemented' });
}

async function getCheckoutSession(req: Request, res: Response) {
  return res.status(501).json({ error: 'Checkout session lookup not implemented' });
}

async function handleStripeWebhook(req: Request, res: Response) {
  return res.status(501).json({ error: 'Stripe webhook handling not implemented' });
}

export default {
  createCheckoutSession,
  getCheckoutSession,
  handleStripeWebhook,
};
