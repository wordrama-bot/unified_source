import express, { NextFunction, Response } from 'express';
import rateLimit from 'express-rate-limit';
import playerController from '../../controllers/player';
import accountDeletionFeedbackController from '../../controllers/accountDeletionFeedback';
import { validateToken } from '../../middleware/tokenValidation';
import { ApiRequest } from '../../types';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

function requireUserAuthentication(
  req: ApiRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.role === 'SERVICE_TOKEN') {
    return res.status(403).json({
      data: {},
      count: 0,
      status: 403,
      message: 'This endpoint requires user authentication',
    });
  }

  return next();
}

export const router = express.Router();

/* Get routes */
router.get(
  '/migrate/me',
  validateToken,
  requireUserAuthentication,
  limiter,
  playerController.migratePlayer,
);

/* Post routes */
router.post(
  '/player/me',
  validateToken,
  requireUserAuthentication,
  limiter,
  playerController.addPlayer,
);
router.post(
  '/migrate/me',
  validateToken,
  requireUserAuthentication,
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
