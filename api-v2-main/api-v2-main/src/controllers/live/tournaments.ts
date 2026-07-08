import { Response } from 'express';
import {
  createLiveTournament,
} from '../../schema/live';
import { createTournament } from '../../services/live/tournament.service.js';
import type { ApiRequest } from '../../types/auth.types';
import {
  handleLiveControllerError,
  sendLiveError,
  sendLiveSuccess,
} from './errors';

async function create(req: ApiRequest, res: Response) {
  try {
    if (!req.userId) {
      return sendLiveError(req, res, 401, 'Unauthorized');
    }

    const validated = createLiveTournament.safeParse(req.body);

    if (!validated.success) {
      return sendLiveError(req, res, 400, validated.error.message);
    }

    const body = validated.data;
    const tournament = await createTournament({
      name: body.name,
      visibility: body.visibility,
      bestOf: body.bestOf,
      config: body.config,
      metadata: body.metadata,
      createdByPlayerId: req.userId,
    });

    return sendLiveSuccess(
      req,
      res,
      tournament,
      'Live tournament created',
      1,
      { status: 201 },
    );
  } catch (error) {
    return handleLiveControllerError(req, res, error);
  }
}

export default {
  create,
};
