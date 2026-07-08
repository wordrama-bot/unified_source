import { Response } from 'express';
import { getMatchState } from '../../services/live/state.service.js';
import type { ApiRequest } from '../../types/auth.types';
import {
  handleLiveControllerError,
  sendLiveError,
  sendLiveSuccess,
} from './errors';

async function getMatch(req: ApiRequest, res: Response) {
  try {
    if (!req.userId) {
      return sendLiveError(req, res, 401, 'Unauthorized');
    }

    const matchId = req.params.matchId;

    if (!matchId) {
      return sendLiveError(req, res, 400, 'matchId is required.');
    }

    const state = await getMatchState({
      matchId,
      playerId: req.userId,
    });

    return sendLiveSuccess(req, res, state, 'Live match state loaded', 1);
  } catch (error) {
    return handleLiveControllerError(req, res, error);
  }
}

export default {
  getMatch,
};
