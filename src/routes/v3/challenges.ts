import express from 'express';
import { validateToken, validateUserRole } from '../../middleware/tokenValidation';
import challengeController from '../../controllers/challenge';

export const router = express.Router();

const authedPlayer = [
  validateToken,
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
] as const;

// ✅ Authenticated "me" FIRST so it doesn't get swallowed by "/:playerId"
router.get('/me', ...authedPlayer, challengeController.getAllMyChallenges);

// ✅ Public by playerId
router.get('/:playerId', challengeController.getAllMyChallenges);