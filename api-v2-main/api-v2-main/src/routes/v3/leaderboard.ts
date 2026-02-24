import express from 'express';

import { validateToken, validateUserRole } from '../../middleware/tokenValidation';

import wordleLeaderboardController from '../../controllers/leaderboard';
import wordleStatsController from '../../controllers/game/wordle/stats';
import wordleStreakController from '../../controllers/game/wordle/streak';

export const router = express.Router();

const authedPlayer = [
  validateToken,
  validateUserRole(['PLAYER', 'STREAMER', 'SERVICE_TOKEN']),
] as const;

/* Get routes */

// ✅ Public streak lookup by explicit userId (public leaderboard use-case)
router.get(
  '/wordle/streak/:gameMode/:wordPack/:userId',
  wordleStreakController.getStreak,
);

// ✅ Authenticated "my streak" (relies on req.userId inside controller/service)
router.get(
  '/wordle/streak/:gameMode/:wordPack',
  ...authedPlayer,
  wordleStreakController.getStreak,
);

// ✅ Authenticated stats (relies on req.userId)
router.get('/wordle/stats/all-time', ...authedPlayer, wordleStatsController.getAllTimeStats);
router.get(
  '/wordle/stats/all-time/:type',
  ...authedPlayer,
  wordleStatsController.getAllTimeStatsByType,
);
router.get('/wordle/stats/yearly', ...authedPlayer, wordleStatsController.getYearlyStats);
router.get('/wordle/stats/monthly', ...authedPlayer, wordleStatsController.getMonthlyStats);
router.get('/wordle/stats/weekly', ...authedPlayer, wordleStatsController.getWeeklyStats);
router.get('/wordle/stats/today', ...authedPlayer, wordleStatsController.getDailyStats);

// ✅ Public leaderboards
router.get('/wordle/all-time', wordleLeaderboardController.getLeaderboardAllTime);
router.get('/wordle/yearly', wordleLeaderboardController.getLeaderboardForTheYear);
router.get('/wordle/monthly', wordleLeaderboardController.getLeaderboardForTheMonth);
router.get('/wordle/weekly', wordleLeaderboardController.getLeaderboardForThisWeek);
router.get('/wordle/daily', wordleLeaderboardController.getLeaderboardForToday);

// ✅ Authenticated "my position" endpoints (these typically use req.userId)
router.get(
  '/wordle/position/all-time/me',
  ...authedPlayer,
  wordleLeaderboardController.getLeaderboardPositionAllTime,
);
router.get(
  '/wordle/position/yearly/me',
  ...authedPlayer,
  wordleLeaderboardController.getLeaderboardPositionThisYear,
);
router.get(
  '/wordle/position/monthly/me',
  ...authedPlayer,
  wordleLeaderboardController.getLeaderboardPositionThisMonth,
);
router.get(
  '/wordle/position/weekly/me',
  ...authedPlayer,
  wordleLeaderboardController.getLeaderboardPositionThisWeek,
);
router.get(
  '/wordle/position/daily/me',
  ...authedPlayer,
  wordleLeaderboardController.getLeaderboardPositionToday,
);

// ✅ Public lookup of someone else's position (explicit userId)
router.get(
  '/wordle/position/all-time/:userId',
  wordleLeaderboardController.getLeaderboardPositionAllTime,
);
router.get(
  '/wordle/position/yearly/:userId',
  wordleLeaderboardController.getLeaderboardPositionThisYear,
);
router.get(
  '/wordle/position/monthly/:userId',
  wordleLeaderboardController.getLeaderboardPositionThisMonth,
);
router.get(
  '/wordle/position/weekly/:userId',
  wordleLeaderboardController.getLeaderboardPositionThisWeek,
);
router.get(
  '/wordle/position/daily/:userId',
  wordleLeaderboardController.getLeaderboardPositionToday,
);