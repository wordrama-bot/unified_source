// Node Modules
import express, { Response } from 'express';

// Middleware
import {
  authWithSupabaseJWT,
  RequestWithUserId
} from '../../../../../middleware/auth';

// Types
import {
  GameProcessorBodyRequest,
  GameResultBodyRequest
} from './result.types';

// Schema
import {
  gameProcessorBodySchema,
  gameResultBodySchema
} from './result.schema';

// Services
import {
  submitGameForProcessing,
  submitGameResult
} from './result.service';

const router = express.Router();

// POST - /api/v1/games/wordle/game-result
router.post('/', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const {
      isHardMode,
      guesses,
      solution
    }: GameResultBodyRequest = await gameResultBodySchema
      .validateAsync(req.body);
    
    const coinBalance = await submitGameResult(
      req.userId,
      isHardMode, 
      guesses,
      solution
    );

    return res.status(coinBalance.status).json(coinBalance);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// POST - /api/v1/games/wordle/processor
router.post('/processor', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const {
      isDaily,
      isCustomGame,
      isHardMode,
      isDarkMode,
      isHighContrastMode,
      swapEnterAndDelete,
      isSpeedRunEnabled,
      isConfettiEnabled,
      wordLength,
      gameId,
      isGameLost,
      isGameWon,
      solution,
      guesses
    }: GameProcessorBodyRequest = await gameProcessorBodySchema
      .validateAsync(req.body);
    
    const queued = await submitGameForProcessing(
      req.userId,
      isDaily,
      isCustomGame,
      isHardMode,
      isDarkMode,
      isHighContrastMode,
      swapEnterAndDelete,
      isSpeedRunEnabled,
      isConfettiEnabled,
      wordLength,
      gameId,
      isGameLost,
      isGameWon,
      solution,
      guesses
    );

    return res.status(queued.status).json(queued);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

export default router;
