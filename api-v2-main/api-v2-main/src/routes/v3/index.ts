import { Router } from 'express';
import { validateToken, validateUserRole } from '../../middleware/tokenValidation';

// Routes
import { router as wrappedRouter } from './wrapped';
import { router as playerRouter } from './player';
import { router as teamRouter } from './teams';
import { router as gameRouter } from './game';
import { router as uiRouter } from './ui';
import { router as leaderboardRouter } from './leaderboard';
import { router as streamerRouter } from './streamer';
import { router as storeRouter } from './store';
import { router as challengesRouter } from './challenges';
import { router as systemRouter } from './system';
import { router as noRoleRouter } from './noRole';

export const router = Router();

const authedPlayer = [
  validateToken,
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
] as const;

const authedStreamer = [
  validateToken,
  validateUserRole(['STREAMER', 'SERVICE_TOKEN']),
] as const;

const authedService = [
  validateToken,
  validateUserRole(['SERVICE_TOKEN']),
] as const;

// Public routes (no token required)
router.use('/leaderboard', leaderboardRouter);
router.use('/challenges', challengesRouter);

// Protected routes (token + role required)
router.use('/wrapped', ...authedPlayer, wrappedRouter);

router.use('/player', ...authedPlayer, playerRouter);

router.use('/team', ...authedPlayer, teamRouter);

router.use('/game', ...authedPlayer, gameRouter);

// UI state routes
router.use('/ui', ...authedPlayer, uiRouter);

router.use('/streamer', ...authedStreamer, streamerRouter);

router.use('/store', ...authedPlayer, storeRouter);

router.use('/_system', ...authedService, systemRouter);

// Fallback / public misc routes (keep LAST so it doesn't swallow others)
router.use('/', noRoleRouter);

export default router;