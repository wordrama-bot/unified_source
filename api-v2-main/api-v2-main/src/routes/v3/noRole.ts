import express from 'express';
import rateLimit from 'express-rate-limit';

import playerController from '../../controllers/player';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export const router = express.Router();

/* Get routes */
router.get('/migrate/me', playerController.migratePlayer);

/* Post routes */
router.post('/player/me', limiter, playerController.addPlayer);
router.post('/migrate/me', playerController.migratePlayer);

/* Patch routes */

/* Delete routes */

// Export
export default router;
