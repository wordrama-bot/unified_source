// Node Modules
import express, { Request, Response } from 'express';

import wordleConstants from '../constants'; 
const { validWordLengths } = wordleConstants;

// Middleware
import {
  authWithSupabaseJWT,
  RequestWithUserId
} from '../../../../../middleware/auth';

// Schema
import {
  upsetStatsBodySchema
} from './stats.schema';

// Types
import { SubmitWordleStatsBodyRequest } from './stats.types';

// Services
import { getStat, getTotalGamesPlayed, submitStat } from './stats.service';

const router = express.Router();

// GET - /api/v1/games/wordle/stats/me
router.get('/me', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  const { gamemode } = req.query;
  let gameModeId;
  if (gamemode === 'daily') {
    gameModeId = 0;
  } else if (gamemode === 'infinite') {
    gameModeId = 1;
  }

  if (
    (gameModeId !== 0) &&
    (gameModeId !== 1)
  ) return res.status(400).json({
    status: 400,
    statusText: 'Missing gamemode query param [daily or infinite]'
  });

  const { error, ...stats } = await getStat(req.userId, gameModeId);
  return res.status(stats.status).json(stats);
});

// GET - /api/v1/games/wordle/stats/player/:id
router.get('/player/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error, ...stats } = await getTotalGamesPlayed(id);
  return res.status(stats.status).json(stats);
});

// POST - /api/v1/games/wordle/stats/submit
router.post('/submit', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const { gamemode } = req.query;
    let gameModeId;
    if (gamemode === 'daily') {
      gameModeId = 0;
    } else if (gamemode === 'infinite') {
      gameModeId = 1;
    }

    if (
      (gameModeId !== 0) &&
      (gameModeId !== 1)
    ) return res.status(400).json({
      status: 400,
      statusText: 'Missing gamemode query param [daily or infinite]'
    });

    const stats: SubmitWordleStatsBodyRequest = await upsetStatsBodySchema
      .validateAsync(req.body);

    let updateStats = {};
    for (let i = 0; i < validWordLengths.length; i++){
      const wordLength = validWordLengths[i];
      const {
        gamesFailed,
        currentStreak,
        bestStreak,
        successRate,
        totalGames,
        winDistribution,
      } = stats[wordLength];
      updateStats[wordLength] = await submitStat(
        req.userId,
        gameModeId,
        gamesFailed,
        currentStreak,
        bestStreak,
        successRate,
        totalGames,
        winDistribution,
        wordLength
      );
    }

    return res.status(201)
      .json(updateStats);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

export default router;
