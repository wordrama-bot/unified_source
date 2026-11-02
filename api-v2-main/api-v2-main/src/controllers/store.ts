import { Response } from 'express';
import { ApiRequest } from '../types';

import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../utils/responses';

import storeService from '../services/store';
import { coinPurchase } from '../schema/store.js';

async function getStoreItems(req: ApiRequest, res: Response) {
  const storeItems = await storeService.getStoreItems(req.userId, req.query);
  if (!storeItems) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    storeItems,
    'Store Items found',
    storeItems.length,
  );
}

async function getPurchases(req: ApiRequest, res: Response) {
  const purchases = await storeService.getPurchases(req.userId);
  if (!purchases) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    purchases,
    'Purchases found',
    purchases.length,
  );
}

async function purchaseItemsWithCoins(req: ApiRequest, res: Response) {
  const valid = coinPurchase.safeParse(req.body);
  if (!valid.success) return res.status(400).json({ status: 400, message: 'Invalid items' });
  const purchases = await storeService.purchaseItemsWithCoins(req.userId, valid.data.items);
  if ('error' in purchases) {
    return res.status(400).json({ status: 400, message: purchases.error });
  }
  return successfulResponse(req, res, purchases.data, 'Items purchased', purchases.data.length);
}

export default {
  getStoreItems,
  getPurchases,
  purchaseItemsWithCoins,
};
