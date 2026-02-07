import { Response } from 'express';
import { ApiRequest } from '../../../types';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../../../utils/responses';

import stateService from '../../../services/game/wordle/state';

async function getGameState(req: ApiRequest, res: Response) {
  const gameState = await stateService.getGameState(req.userId);
  if (!gameState) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    gameState,
    '[Wordle] Game State Found',
    1,
  );
}

async function updateGameState(req: ApiRequest, res: Response) {
  const gameState = await stateService.updateGameState(req.userId, req.body);
  if (!gameState) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    gameState,
    '[Wordle] Game State Updated',
    1,
  );
}

export default {
  getGameState,
  updateGameState,
};
