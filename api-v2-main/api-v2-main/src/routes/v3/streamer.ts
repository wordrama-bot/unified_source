import express from 'express';

import streamerController from '../../controllers/streamer';

export const router = express.Router();

/* Get routes */

/* Post routes */

/* Patch routes */
router.patch('/settings', streamerController.updateSettings);

/* Delete routes */
