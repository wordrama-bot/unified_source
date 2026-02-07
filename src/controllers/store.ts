import { Response } from 'express';
import { ApiRequest } from '../types';

import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../utils/responses';

import storeService from '../services/store';

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
  if (!req.body?.items) return badRequest(req, res, 'No items provided');

  const purchases = await storeService.purchaseItemsWithCoins(
    req.userId,
    req.body.items,
  );
  if (!purchases) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    purchases,
    'Items purchased',
    purchases.length,
  );
}

export default {
  getStoreItems,
  getPurchases,
  purchaseItemsWithCoins,
};
