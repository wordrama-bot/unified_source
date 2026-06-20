import type { Response } from 'express';

import type { ApiRequest } from '../types';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../utils/responses';
import playerService from '../services/player';
import * as billingService from '../services/marketplaceV2/billing';

async function createCheckoutSession(req: ApiRequest, res: Response) {
  const player = await playerService.getPlayerByUserId(req.userId);
  if (!player || !player?.id) return notFoundResponse(req, res);

  const { subscriptionKey } = req.body;
  if (!subscriptionKey) return badRequest(req, res, 'No subscription key provided');

  const checkoutSession = await billingService.createCheckoutSession({
    playerId: player.id,
    subscriptionKey,
  });

  if ('error' in checkoutSession) {
    return badRequest(req, res, checkoutSession.error);
  }

  return successfulResponse(
    req,
    res,
    checkoutSession,
    'Checkout session created',
    1,
  );
}

async function getCheckoutSession(req: ApiRequest, res: Response) {
  return res.status(501).json({ error: 'Checkout session lookup not implemented' });
}

async function handleStripeWebhook(req: ApiRequest, res: Response) {
  return res.status(501).json({ error: 'Stripe webhook handling not implemented' });
}

export default {
  createCheckoutSession,
  getCheckoutSession,
  handleStripeWebhook,
};
