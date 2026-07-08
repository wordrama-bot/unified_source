import { Response } from 'express';
import {
  startLiveMatch,
  submitLiveGuess,
  type SubmitLiveGuess,
} from '../../schema/live';
import { submitGuess } from '../../services/live/engine.service.js';
import { startMatch } from '../../services/live/match.service.js';
import type {
  LiveGuessResult,
  LiveMatch,
} from '../../services/live/types.js';
import type { ApiRequest } from '../../types/auth.types';
import {
  handleLiveControllerError,
  sendLiveError,
  sendLiveSuccess,
} from './errors';

function sanitizeMatch(match: LiveMatch): LiveMatch {
  if (match.status === 'COMPLETED') return match;

  return {
    ...match,
    solution: '',
    solutionHash: null,
    solutionSaltId: null,
  };
}

function sanitizeGuessResult(result: LiveGuessResult): LiveGuessResult {
  return {
    ...result,
    match: sanitizeMatch(result.match),
  };
}

async function start(req: ApiRequest, res: Response) {
  try {
    if (!req.userId) {
      return sendLiveError(req, res, 401, 'Unauthorized');
    }

    const matchId = req.params.matchId;

    if (!matchId) {
      return sendLiveError(req, res, 400, 'matchId is required.');
    }

    const validated = startLiveMatch.safeParse(req.body ?? {});

    if (!validated.success) {
      return sendLiveError(req, res, 400, validated.error.message);
    }

    const match = await startMatch({
      matchId,
      requestedByPlayerId: req.userId,
    });

    return sendLiveSuccess(
      req,
      res,
      sanitizeMatch(match),
      'Live match started',
      1,
    );
  } catch (error) {
    return handleLiveControllerError(req, res, error);
  }
}

async function submitGuessForMatch(req: ApiRequest, res: Response) {
  try {
    if (!req.userId) {
      return sendLiveError(req, res, 401, 'Unauthorized');
    }

    const matchId = req.params.matchId;

    if (!matchId) {
      return sendLiveError(req, res, 400, 'matchId is required.');
    }

    const validated = submitLiveGuess.safeParse(req.body);

    if (!validated.success) {
      return sendLiveError(req, res, 400, validated.error.message);
    }

    const body: SubmitLiveGuess = validated.data;
    const result = await submitGuess({
      matchId,
      playerId: req.userId,
      guess: body.guess,
    });

    return sendLiveSuccess(
      req,
      res,
      sanitizeGuessResult(result),
      'Live guess submitted',
      1,
    );
  } catch (error) {
    return handleLiveControllerError(req, res, error);
  }
}

export default {
  start,
  submitGuess: submitGuessForMatch,
};
