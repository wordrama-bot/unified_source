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

async function getCurrentSubscription(req: ApiRequest, res: Response) {
  const player = await playerService.getPlayerByUserId(req.userId);

  if (!player || !player?.id) {
    return notFoundResponse(req, res);
  }

  const result = await billingService.getCurrentSubscription({
    playerId: player.id,
  });

  if ('error' in result) {
    return badRequest(req, res, result.error);
  }

  return successfulResponse(
    req,
    res,
    result,
    'Current subscription retrieved',
    1,
  );
}

async function createBillingPortalSession(req: ApiRequest, res: Response) {
  const player = await playerService.getPlayerByUserId(req.userId);

  if (!player || !player?.id) {
    return notFoundResponse(req, res);
  }

  const result = await billingService.createBillingPortalSession({
    playerId: player.id,
  });

  if ('error' in result) {
    return badRequest(req, res, result.error);
  }

  return successfulResponse(
    req,
    res,
    result,
    'Billing portal session created',
    1,
  );
}

async function handleStripeWebhook(req: ApiRequest, res: Response) {
  const result = await billingService.handleStripeWebhook({
    rawBody: req.body,
    signature: req.headers['stripe-signature'],
  });

  if ('error' in result) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(200).json({ received: true });
}

async function createItemCheckoutSession(req: ApiRequest, res: Response) {
  const player = await playerService.getPlayerByUserId(req.userId);
  if (!player || !player?.id) return notFoundResponse(req, res);

  const { itemId } = req.body;
  if (!itemId) return badRequest(req, res, 'No item id provided');

  const checkoutSession = await billingService.createItemCheckoutSession({
    playerId: player.id,
    itemId,
  });

  if ('error' in checkoutSession) {
    return badRequest(req, res, checkoutSession.error);
  }

  return successfulResponse(
    req,
    res,
    checkoutSession,
    'Item checkout session created',
    1,
  );
}

export default {
  createCheckoutSession,
  getCheckoutSession,
  getCurrentSubscription,
  createBillingPortalSession,
  handleStripeWebhook,
  createItemCheckoutSession,
};
