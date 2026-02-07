// Node Modules
import express, { Response } from 'express';
import {
  authWithSupabaseJWT,
  RequestWithUserId
} from '../../../../middleware/auth';

// Schema
import {
  incrementBodySchema,
  decrementBodySchema,
  transferBodySchema
} from './coins.schema';

// Types
import { 
  IncrementBodyRequest,
  DecrementBodyRequest,
  TransferBodyRequest
} from './coins.types';

// Services
import { 
  getCoinBalance,
  updateBalance,
  transferCoins
} from './coins.service';

const router = express.Router();

// GET - /api/v1/economy/coins/me
router.get('/me', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  const { 
    error,
    ...coinBalance 
  } = await getCoinBalance(req.userId);

  return res.status(coinBalance.status).json(coinBalance);
});

// POST - /api/v1/economy/coins/increment
router.post('/increment', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const validated: IncrementBodyRequest = await incrementBodySchema
      .validateAsync(req.body);

    const updatedCoinBalance = await updateBalance(
      validated.userId,
      validated.incrementBy,
      'increment'
    );

    return res.status(updatedCoinBalance.status)
      .json(updatedCoinBalance);
  } catch (err){
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// POST - /api/v1/economy/coins/decrement
router.post('/decrement', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const validated: DecrementBodyRequest = await decrementBodySchema
      .validateAsync(req.body);

    const updatedCoinBalance = await updateBalance(
      validated.userId,
      validated.decrementBy,
      'decrement'
    );

    return res.status(updatedCoinBalance.status)
      .json(updatedCoinBalance);
  } catch (err){
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// POST - /api/v1/economy/coins/transfer
router.post('/transfer', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const validated: TransferBodyRequest = await transferBodySchema
      .validateAsync(req.body);

    const transferredCoins = await transferCoins(
      validated.senderUserId,
      validated.receiverUserId,
      validated.coins
    );

    return res.status(transferredCoins.status)
      .json(transferredCoins);
  } catch (err){
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

export default router;
