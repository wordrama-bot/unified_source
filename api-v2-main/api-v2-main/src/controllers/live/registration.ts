import { Response } from 'express';
import {
  joinLiveTournament,
  readyLivePlayer,
  type JoinLiveTournament,
} from '../../schema/live';
import {
  joinTournament,
  readyPlayer,
} from '../../services/live/registration.service.js';
import type { ApiRequest } from '../../types/auth.types';
import {
  handleLiveControllerError,
  sendLiveError,
  sendLiveSuccess,
} from './errors';

async function join(req: ApiRequest, res: Response) {
  try {
    if (!req.userId) {
      return sendLiveError(req, res, 401, 'Unauthorized');
    }

    const tournamentId = req.params.tournamentId;

    if (!tournamentId) {
      return sendLiveError(req, res, 400, 'tournamentId is required.');
    }

    const validated = joinLiveTournament.safeParse(req.body ?? {});

    if (!validated.success) {
      return sendLiveError(req, res, 400, validated.error.message);
    }

    const body: JoinLiveTournament = validated.data;
    const entrant = await joinTournament({
      tournamentId,
      playerId: req.userId,
      metadata: body.metadata,
    });

    return sendLiveSuccess(req, res, entrant, 'Joined Live tournament', 1);
  } catch (error) {
    return handleLiveControllerError(req, res, error);
  }
}

async function ready(req: ApiRequest, res: Response) {
  try {
    if (!req.userId) {
      return sendLiveError(req, res, 401, 'Unauthorized');
    }

    const tournamentId = req.params.tournamentId;

    if (!tournamentId) {
      return sendLiveError(req, res, 400, 'tournamentId is required.');
    }

    const validated = readyLivePlayer.safeParse(req.body ?? {});

    if (!validated.success) {
      return sendLiveError(req, res, 400, validated.error.message);
    }

    const entrant = await readyPlayer({
      tournamentId,
      playerId: req.userId,
    });

    return sendLiveSuccess(req, res, entrant, 'Live player ready', 1);
  } catch (error) {
    return handleLiveControllerError(req, res, error);
  }
}

export default {
  join,
  ready,
};
