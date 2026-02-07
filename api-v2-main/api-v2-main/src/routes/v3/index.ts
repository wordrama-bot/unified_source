import express from 'express';
import {
  validateToken,
  validateUserRole,
} from '../../middleware/tokenValidation';

// Routes
import { router as wrappedRouter } from './wrapped';
import { router as playerRouter } from './player';
import { router as teamRouter } from './teams';
import { router as gameRouter } from './game';
import { router as leaderboardRouter } from './leaderboard';
import { router as streamerRouter } from './streamer';
import { router as storeRouter } from './store';
import { router as challengesRouter } from './challenges';
import { router as systemRouter } from './system';
import { router as noRoleRouter } from './noRole';

export const router = express.Router();

// Mount routers
router.use(validateToken);
router.use(
  '/wrapped',
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  wrappedRouter,
);
router.use(
  '/player',
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  playerRouter,
);
router.use(
  '/team',
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  teamRouter,
);
router.use(
  '/game',
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  gameRouter,
);
router.use(
  '/leaderboard',
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  leaderboardRouter,
);
router.use(
  '/streamer',
  validateUserRole(['STREAMER', 'SERVICE_TOKEN']),
  streamerRouter,
);
router.use(
  '/store',
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  storeRouter,
);
router.use(
  '/challenges',
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  challengesRouter,
);
router.use('/_system', validateUserRole(['SERVICE_TOKEN']), systemRouter);
router.use('/', noRoleRouter);

// Export
export default router;
