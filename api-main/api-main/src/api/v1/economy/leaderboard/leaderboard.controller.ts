// Node Modules
import express, { Request, Response } from 'express';

// Services
import { 
  getTop10Balances,
  //getTop10BalancesMe
} from './leaderboard.service';

const router = express.Router();

// GET - /api/v1/economy/leaderboard
router.get('/', async (req: Request, res: Response) => {
  const { 
    error,
    ...coinBalance 
  } = await getTop10Balances();

  return res.status(coinBalance.status).json(coinBalance);
});

// GET - /api/v1/economy/leaderboard/me
// router.get('/me', async (req: Request, res: Response) => {
//   const { 
//     error,
//     ...coinBalance 
//   } = await getTop10BalancesWithMe();

//   return res.status(coinBalance.status).json(coinBalance);
// });

export default router;
