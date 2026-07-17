import express from 'express';
import rateLimit from 'express-rate-limit';
import playerController from '../../controllers/player';
import accountDeletionFeedbackController from '../../controllers/accountDeletionFeedback';
import { validateToken } from '../../middleware/tokenValidation';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export const router = express.Router();

/* Get routes */
router.get(
  '/migrate/me',
  validateToken,
  limiter,
  playerController.migratePlayer,
);

/* Post routes */
router.post(
  '/player/me',
  validateToken,
  limiter,
  playerController.addPlayer,
);
router.post(
  '/migrate/me',
  validateToken,
  limiter,
  playerController.migratePlayer,
);
router.post(
  '/account-deletion-feedback',
  limiter,
  accountDeletionFeedbackController.create,
);

/* Patch routes */

/* Delete routes */

// Export
export default router;
