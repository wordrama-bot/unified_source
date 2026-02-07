// Node Modules
import express from 'express';

// Routes
import coins from './coins/coins.controller';
import leaderboard from './leaderboard/leaderboard.controller';
import dailySpin from './dailySpin/dailySpin.controller';

const router = express.Router();

// - /api/v1/economy/coins
router.use('/coins', coins);
// - /api/v1/economy/leaderboard
router.use('/leaderboard', leaderboard);
// - /api/v1/economy/daily-spin
router.use('/daily-spin', dailySpin);

export default router;
