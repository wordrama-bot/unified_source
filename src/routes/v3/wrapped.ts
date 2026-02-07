import express from 'express';

import wrappedController from '../../controllers/wrapped';

export const router = express.Router();

/* Get routes */
router.get('/me', wrappedController.getWordleWrappedById);

/* Post routes */

/* Patch routes */

/* Delete routes */
