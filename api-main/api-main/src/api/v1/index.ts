// Node Modules
import express from 'express';

import authController from './auth/auth.controller';
import economyController from './economy/economy.controller';
import gamesController from './games/games.controller';
import notificationController from './notifications/notifications.controller';

const router = express.Router();

router.use('/auth', authController);
router.use('/games', gamesController);
router.use('/economy', economyController);
router.use('/notifications', notificationController);

export default router;
