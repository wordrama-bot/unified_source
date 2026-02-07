import express from 'express';

import wordleLeaderboardController from '../../controllers/leaderboard';
import wordleStatsController from '../../controllers/game/wordle/stats';
import wordleStreakController from '../../controllers/game/wordle/streak';

export const router = express.Router();
/* Get routes */
router.get(
  '/wordle/streak/:gameMode/:wordPack/:userId',
  wordleStreakController.getStreak,
);
router.get(
  '/wordle/streak/:gameMode/:wordPack',
  wordleStreakController.getStreak,
);
router.get('/wordle/stats/all-time', wordleStatsController.getAllTimeStats);
router.get(
  '/wordle/stats/all-time/:type',
  wordleStatsController.getAllTimeStatsByType,
);
router.get('/wordle/stats/yearly', wordleStatsController.getYearlyStats);
router.get('/wordle/stats/monthly', wordleStatsController.getMonthlyStats);
router.get('/wordle/stats/weekly', wordleStatsController.getWeeklyStats);
router.get('/wordle/stats/today', wordleStatsController.getDailyStats);
router.get(
  '/wordle/all-time',
  wordleLeaderboardController.getLeaderboardAllTime,
);
router.get(
  '/wordle/yearly',
  wordleLeaderboardController.getLeaderboardForTheYear,
);
router.get(
  '/wordle/monthly',
  wordleLeaderboardController.getLeaderboardForTheMonth,
);
router.get(
  '/wordle/weekly',
  wordleLeaderboardController.getLeaderboardForThisWeek,
);
router.get('/wordle/daily', wordleLeaderboardController.getLeaderboardForToday);
router.get(
  '/wordle/position/all-time/me',
  wordleLeaderboardController.getLeaderboardPositionAllTime,
);
router.get(
  '/wordle/position/yearly/me',
  wordleLeaderboardController.getLeaderboardPositionThisYear,
);
router.get(
  '/wordle/position/monthly/me',
  wordleLeaderboardController.getLeaderboardPositionThisMonth,
);
router.get(
  '/wordle/position/weekly/me',
  wordleLeaderboardController.getLeaderboardPositionThisWeek,
);
router.get(
  '/wordle/position/daily/me',
  wordleLeaderboardController.getLeaderboardPositionToday,
);
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
// /* Post routes */

// /* Patch routes */

// /* Delete routes */
