import { Response } from 'express';
import { ApiRequest } from '../../../types';
import {
  conflictResponse,
  notFoundResponse,
  successfulResponse,
  unauthorizedResponse,
} from '../../../utils/responses';

import stateService from '../../../services/game/wordle/state';

async function getGameState(req: ApiRequest, res: Response) {
  if (!req.userId) return unauthorizedResponse(req, res);

  const result = await stateService.getGameState(req.userId);
  if (!result) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    result.gameState,
    '[Wordle] Game State Found',
    1,
    { stateRevision: result.revision },
  );
}

async function updateGameState(req: ApiRequest, res: Response) {
  if (!req.userId) return unauthorizedResponse(req, res);

  const result = await stateService.updateGameState(
    req.userId,
    req.body,
  );

  if (result.status === 'invalid') {
    return res.status(400).json({
      data: {},
      message: 'Invalid Wordle saved-state request',
      status: 400,
    });
  }

  if (result.status === 'error') {
    return res.status(500).json({
      data: {},
      message: 'Unable to save Wordle game state',
      status: 500,
    });
  }

  if (result.status === 'conflict') {
    return conflictResponse(
      req,
      res,
      'Wordle game state revision conflict',
      {
        currentRevision: result.revision,
        currentGameState: result.gameState,
      },
    );
  }

  return successfulResponse(
    req,
    res,
    result.gameState,
    '[Wordle] Game State Updated',
    1,
    { stateRevision: result.revision },
  );
}

export default {
  getGameState,
  updateGameState,
};
