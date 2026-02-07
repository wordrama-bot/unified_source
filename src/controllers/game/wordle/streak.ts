import { Response } from 'express';
import { ApiRequest } from '../../../types';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../../../utils/responses';

import streakService from '../../../services/game/wordle/streak';

async function getStreak(req: ApiRequest, res: Response) {
  const userId = req.params.userId ? req.params.userId : req.userId;
  const streak = await streakService.getStreak(
    userId,
    req.params.wordPack,
    req.params.gameMode,
  );
  if (!streak) return notFoundResponse(req, res);

  return successfulResponse(req, res, streak, 'Streak Returned', 1);
}

export default {
  getStreak,
};
