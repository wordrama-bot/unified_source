notepad C:\wordrama\unified_source\api-v2-main\api-v2-main\src\routes\v3\index.tsimport express from 'express';
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

// Public routes (no token required)
router.use('/leaderboard', leaderboardRouter);
router.use('/', noRoleRouter);

// Protected routes (token + role required)
router.use(
  '/wrapped',
  validateToken,
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  wrappedRouter,
);
router.use(
  '/player',
  validateToken,
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  playerRouter,
);
router.use(
  '/team',
  validateToken,
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  teamRouter,
);
router.use(
  '/game',
  validateToken,
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  gameRouter,
);
router.use(
  '/streamer',
  validateToken,
  validateUserRole(['STREAMER', 'SERVICE_TOKEN']),
  streamerRouter,
);
router.use(
  '/store',
  validateToken,
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  storeRouter,
);
router.use(
  '/challenges',
  validateToken,
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  challengesRouter,
);
router.use(
  '/_system',
  validateToken,
  validateUserRole(['SERVICE_TOKEN']),
  systemRouter,
);

// Export
export default router;
