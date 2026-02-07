// Node Modules
import express from 'express';

import customsController from './customs/customs.controller';
import leaderboardController from './leaderboard/leaderboard.controller';
import settingsController from './settings/settings.controller';
import statsController from './stats/stats.controller';
import resultController from './result/result.controller';

const router = express.Router();

router.use('/customs', customsController);
router.use('/leaderboard', leaderboardController);
router.use('/settings', settingsController);
router.use('/stats', statsController);
router.use('/game-result', resultController);

export default router;
