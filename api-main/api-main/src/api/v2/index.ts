// Node Modules
import express from 'express';

import statsController from './stats/stats.controller';

const router = express.Router();

router.use('/stats', statsController);

export default router;
