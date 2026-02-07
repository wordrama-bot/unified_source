import express from 'express';

import challengeController from '../../controllers/challenge';

export const router = express.Router();

/* Get routes */

/* Post routes */
router.post(
  '/challenges/:challengeId/progress',
  challengeController.updateChallengeProgress,
);

/* Patch routes */

/* Delete routes */
