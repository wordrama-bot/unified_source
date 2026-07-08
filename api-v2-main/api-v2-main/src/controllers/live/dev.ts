import { Response } from 'express';
import {
  createLiveDevMatch,
  grantLiveDevEntitlement,
  openLiveDevRegistration,
  startLiveDevTournament,
  type CreateLiveDevMatch,
} from '../../schema/live';
import {
  createSmokeMatch,
  grantLiveEntitlement,
  LiveDevSmokeError,
  openRegistration,
  startTournament,
} from '../../services/live/dev-smoke.service.js';
import type { ApiRequest } from '../../types/auth.types';
import {
  handleLiveControllerError,
  sendLiveError,
  sendLiveSuccess,
} from './errors';

function handleDevSmokeError(
  req: ApiRequest,
  res: Response,
  error: unknown,
) {
  if (!(error instanceof LiveDevSmokeError)) {
    return handleLiveControllerError(req, res, error);
  }

  switch (error.code) {
    case 'LIVE_DEV_SMOKE_INVALID_INPUT':
      return sendLiveError(req, res, 400, error.message);
    case 'LIVE_DEV_SMOKE_FORBIDDEN':
      return sendLiveError(req, res, 403, error.message);
    case 'LIVE_DEV_SMOKE_NOT_FOUND':
      return sendLiveError(req, res, 404, error.message);
    case 'LIVE_DEV_SMOKE_INVALID_TRANSITION':
      return sendLiveError(req, res, 409, error.message);
    default:
      console.error('[live.dev-smoke.api] domain error', error);
      return sendLiveError(req, res, 500, 'Unable to process Live smoke request.');
  }
}

async function grantEntitlement(req: ApiRequest, res: Response) {
  try {
    if (!req.userId) {
      return sendLiveError(req, res, 401, 'Unauthorized');
    }

    const validated = grantLiveDevEntitlement.safeParse(req.body ?? {});

    if (!validated.success) {
      return sendLiveError(req, res, 400, validated.error.message);
    }

    const entitlement = await grantLiveEntitlement({
      playerId: validated.data.playerId ?? req.userId,
      grantedByPlayerId: req.userId,
    });

    return sendLiveSuccess(
      req,
      res,
      entitlement,
      'Live dev smoke entitlement granted',
      1,
    );
  } catch (error) {
    return handleDevSmokeError(req, res, error);
  }
}

async function openRegistrationForTournament(req: ApiRequest, res: Response) {
  try {
    if (!req.userId) {
      return sendLiveError(req, res, 401, 'Unauthorized');
    }

    const tournamentId = req.params.tournamentId;

    if (!tournamentId) {
      return sendLiveError(req, res, 400, 'tournamentId is required.');
    }

    const validated = openLiveDevRegistration.safeParse(req.body ?? {});

    if (!validated.success) {
      return sendLiveError(req, res, 400, validated.error.message);
    }

    const tournament = await openRegistration({
      tournamentId,
      requestedByPlayerId: req.userId,
    });

    return sendLiveSuccess(
      req,
      res,
      tournament,
      'Live dev smoke registration opened',
      1,
    );
  } catch (error) {
    return handleDevSmokeError(req, res, error);
  }
}

async function startTournamentForSmoke(req: ApiRequest, res: Response) {
  try {
    if (!req.userId) {
      return sendLiveError(req, res, 401, 'Unauthorized');
    }

    const tournamentId = req.params.tournamentId;

    if (!tournamentId) {
      return sendLiveError(req, res, 400, 'tournamentId is required.');
    }

    const validated = startLiveDevTournament.safeParse(req.body ?? {});

    if (!validated.success) {
      return sendLiveError(req, res, 400, validated.error.message);
    }

    const tournament = await startTournament({
      tournamentId,
      requestedByPlayerId: req.userId,
    });

    return sendLiveSuccess(
      req,
      res,
      tournament,
      'Live dev smoke tournament started',
      1,
    );
  } catch (error) {
    return handleDevSmokeError(req, res, error);
  }
}

async function createMatchForSmoke(req: ApiRequest, res: Response) {
  try {
    if (!req.userId) {
      return sendLiveError(req, res, 401, 'Unauthorized');
    }

    const validated = createLiveDevMatch.safeParse(req.body);

    if (!validated.success) {
      return sendLiveError(req, res, 400, validated.error.message);
    }

    const body: CreateLiveDevMatch = validated.data;
    const match = await createSmokeMatch({
      tournamentId: body.tournamentId,
      requestedByPlayerId: req.userId,
      playerIds: body.playerIds,
      roundNumber: body.roundNumber,
      matchNumber: body.matchNumber,
      solution: body.solution,
      wordPack: body.wordPack ?? 'FIVE_LETTER',
      wordLength: body.wordLength,
      maxAttempts: body.maxAttempts,
      solutionHash: body.solutionHash,
      solutionSaltId: body.solutionSaltId,
      scheduledAt: body.scheduledAt,
      config: body.config,
      metadata: {
        ...(body.metadata ?? {}),
        devSmoke: true,
      },
    });

    return sendLiveSuccess(
      req,
      res,
      match,
      'Live dev smoke match created',
      1,
      { status: 201 },
    );
  } catch (error) {
    return handleDevSmokeError(req, res, error);
  }
}

export default {
  grantEntitlement,
  openRegistration: openRegistrationForTournament,
  startTournament: startTournamentForSmoke,
  createMatch: createMatchForSmoke,
};
