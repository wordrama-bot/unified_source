import express from 'express';

import storeController from '../../controllers/store';

export const router = express.Router();

/* Get routes */
router.get('/items', storeController.getStoreItems);
router.get('/purchases', storeController.getPurchases);

/* Post routes */
router.post('/purchase/with-coins', storeController.purchaseItemsWithCoins);

/* Patch routes */

/* Delete routes */
