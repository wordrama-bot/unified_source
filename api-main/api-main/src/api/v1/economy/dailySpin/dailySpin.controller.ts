// Node Modules
import express, { Response } from 'express';

// Middleware
import {
  authWithSupabaseJWT,
  RequestWithUserId
} from '../../../../middleware/auth';

// Services
import { spin, claimSpin } from './dailySpin.service';

const router = express.Router();

// GET - /api/v1/economy/daily-spin
router.get('/', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  const coinBalance = await spin(req.userId);

  return res.status(coinBalance.status).json(coinBalance);
});

// POST - /api/v1/economy/daily-spin/claim
router.post('/claim', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  const coinBalance = await claimSpin(req.userId);

  return res.status(coinBalance.status).json(coinBalance);
});

export default router;
