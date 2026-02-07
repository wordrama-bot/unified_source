import express from 'express';
import rateLimit from 'express-rate-limit';
import { slowDown } from 'express-slow-down';

import playerController from '../../controllers/player';
import leaderboardController from '../controllers/leaderboard';
import freePlayController from '../../controllers/freePlay';
import referralsController from '../../controllers/referrals';

const referralLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
// const limiter = slowDown({
//   windowMs: 60 * 1000,
//   delayAfter: 10,
//   delayMs: (hits) => hits * 100,
// });

export const router = express.Router();

/* Get routes */
// Public routes should be read-only
//router.get('/leaderboard', limiter, leaderboardController.getLeaderboard);
router.get('/free-play/word-pack/:wordPack', freePlayController.getWordPack);
router.get(
  '/free-play/word-pack/:wordPack/todays-word',
  freePlayController.getTodaysWord,
);
router.get(
  '/players/by-username',
  //limiter,
  playerController.getPublicPlayerProfileByUsername,
);
router.get(
  '/players/by-playerid/:playerId',
  //limiter,
  playerController.getPublicPlayerProfile,
);
router.get(
  '/referral/:referralCode/check-validity',
  referralLimiter,
  referralsController.checkValidity,
);

// Export
export default router;
