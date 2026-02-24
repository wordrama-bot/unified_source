import express from 'express';
import { validateToken, validateUserRole } from '../../middleware/tokenValidation';
import challengeController from '../../controllers/challenge';

export const router = express.Router();

const authedPlayer = [
  validateToken,
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
] as const;

router.get('/me', challengeController.getAllMyChallenges);
router.get('/:playerId', challengeController.getAllMyChallenges);