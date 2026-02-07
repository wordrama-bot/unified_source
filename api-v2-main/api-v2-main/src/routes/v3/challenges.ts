import express from 'express';

import challengeController from '../../controllers/challenge';

export const router = express.Router();

/* Get routes */
router.get('/me', challengeController.getAllMyChallenges);
router.get('/:playerId', challengeController.getAllMyChallenges);

/* Post routes */

/* Patch routes */

/* Delete routes */
