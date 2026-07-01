import { Router } from 'express';
import { validateToken, validateUserRole } from '../../middleware/tokenValidation';
import { validatePlayerNotBanned } from '../../middleware/banEnforcement';

// Routes
import { router as wrappedRouter } from './wrapped';
import { router as playerRouter } from './player';
import { router as teamRouter } from './teams';
import { router as gameRouter } from './game';
import { router as billingRouter } from './billing';
import { router as adminRouter } from './admin';
import { router as uiRouter } from './ui';
import { router as leaderboardRouter } from './leaderboard';
import { router as streamerRouter } from './streamer';
import { router as storeRouter } from './store';
import { router as challengesRouter } from './challenges';
import { router as migrateRouter } from './migrate';
import { router as systemRouter } from './system';
import { router as noRoleRouter } from './noRole';

export const router = Router();

/* ---------------------------------- */
/* Role Middleware Groups             */
/* ---------------------------------- */

const authedPlayer = [
  validateToken,
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
  validatePlayerNotBanned,
] as const;

const authedStreamer = [
  validateToken,
  validateUserRole(['STREAMER', 'SERVICE_TOKEN']),
  validatePlayerNotBanned,
] as const;

const authedService = [
  validateToken,
  validateUserRole(['SERVICE_TOKEN']),
] as const;

/* ---------------------------------- */
/* Public Routes                      */
/* ---------------------------------- */

router.use('/leaderboard', leaderboardRouter);
router.use('/challenges', challengesRouter);

/* ---------------------------------- */
/* Protected Routes                   */
/* ---------------------------------- */

router.use('/wrapped', ...authedPlayer, wrappedRouter);

router.use('/player', ...authedPlayer, playerRouter);

router.use('/team', ...authedPlayer, teamRouter);

router.use('/game', ...authedPlayer, gameRouter);

router.use('/ui', ...authedPlayer, uiRouter);

router.use('/streamer', ...authedStreamer, streamerRouter);

router.use('/store', ...authedPlayer, storeRouter);

router.use('/billing', ...authedPlayer, billingRouter);

router.use('/admin', validateToken, adminRouter);

/* ---------------------------------- */
/* SERVICE TOKEN ONLY ROUTES          */
/* ---------------------------------- */

// 🔥 Migration endpoint (challenge backfill lives here)
router.use('/migrate', ...authedService, migrateRouter);

// Existing internal system routes
router.use('/_system', ...authedService, systemRouter);

/* ---------------------------------- */
/* Fallback (KEEP LAST)               */
/* ---------------------------------- */

router.use('/', noRoleRouter);

export default router;