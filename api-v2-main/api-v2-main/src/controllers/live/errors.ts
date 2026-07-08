import { Response } from 'express';
import { LiveEngineError } from '../../services/live/engine.service.js';
import { LiveMatchError } from '../../services/live/match.service.js';
import { LiveRegistrationError } from '../../services/live/registration.service.js';
import { LiveStateError } from '../../services/live/state.service.js';
import { LiveTournamentCreateError } from '../../services/live/tournament.service.js';
import type { ApiRequest } from '../../types/auth.types';

type LiveResponseOptions = {
  status?: number;
  metadata?: unknown;
};

function responseEnvelope({
  data,
  message,
  count,
  status,
  metadata,
}: {
  data: unknown;
  message: string;
  count: number;
  status: number;
  metadata?: unknown;
}) {
  return {
    data,
    metadata: metadata ?? {},
    count,
    message,
    status,
  };
}

export function sendLiveSuccess(
  _req: ApiRequest,
  res: Response,
  data: unknown,
  message: string,
  count: number = 1,
  options: LiveResponseOptions = {},
) {
  const status = options.status ?? 200;

  return res
    .status(status)
    .json(responseEnvelope({
      data,
      message,
      count,
      status,
      metadata: options.metadata,
    }))
    .end();
}

export function sendLiveError(
  _req: ApiRequest,
  res: Response,
  status: number,
  message: string,
) {
  return res
    .status(status)
    .json(responseEnvelope({
      data: {},
      message,
      count: 0,
      status,
    }))
    .end();
}

function statusForLiveError(error: Error & { code?: string }) {
  switch (error.code) {
    case 'LIVE_TOURNAMENT_MISSING_ENTITLEMENT':
    case 'LIVE_MATCH_FORBIDDEN':
    case 'LIVE_STATE_FORBIDDEN':
      return 403;
    case 'LIVE_MATCH_TOURNAMENT_NOT_FOUND':
    case 'LIVE_MATCH_ENTRANT_NOT_FOUND':
    case 'LIVE_MATCH_NOT_FOUND':
    case 'LIVE_MATCH_PLAYER_NOT_FOUND':
    case 'LIVE_REGISTRATION_TOURNAMENT_NOT_FOUND':
    case 'LIVE_REGISTRATION_PLAYER_NOT_FOUND':
    case 'LIVE_REGISTRATION_ENTRANT_NOT_FOUND':
    case 'LIVE_ENGINE_MATCH_NOT_FOUND':
    case 'LIVE_ENGINE_PLAYER_NOT_FOUND':
    case 'LIVE_STATE_MATCH_NOT_FOUND':
      return 404;
    case 'LIVE_MATCH_TOURNAMENT_NOT_IN_PROGRESS':
    case 'LIVE_MATCH_DUPLICATE_PLAYER':
    case 'LIVE_MATCH_DUPLICATE_SLOT':
    case 'LIVE_MATCH_INVALID_TRANSITION':
    case 'LIVE_REGISTRATION_NOT_OPEN':
    case 'LIVE_REGISTRATION_DUPLICATE_ENTRANT':
    case 'LIVE_REGISTRATION_TOURNAMENT_FULL':
    case 'LIVE_ENGINE_INVALID_MATCH_STATE':
    case 'LIVE_ENGINE_INVALID_PLAYER_STATE':
    case 'LIVE_ENGINE_NO_ATTEMPTS_REMAINING':
    case 'LIVE_ENGINE_STALE_GUESS_RESULT':
      return 409;
    case 'LIVE_TOURNAMENT_INVALID_INPUT':
    case 'LIVE_MATCH_INVALID_INPUT':
    case 'LIVE_REGISTRATION_INVALID_INPUT':
    case 'LIVE_ENGINE_INVALID_INPUT':
    case 'LIVE_ENGINE_WORD_PACK_NOT_FOUND':
    case 'LIVE_ENGINE_INVALID_GUESS_LENGTH':
    case 'LIVE_ENGINE_WORD_NOT_ALLOWED':
    case 'LIVE_STATE_INVALID_INPUT':
      return 400;
    default:
      return 500;
  }
}

function isLiveDomainError(error: unknown): error is Error & { code: string } {
  return error instanceof LiveTournamentCreateError ||
    error instanceof LiveRegistrationError ||
    error instanceof LiveMatchError ||
    error instanceof LiveEngineError ||
    error instanceof LiveStateError;
}

export function handleLiveControllerError(
  req: ApiRequest,
  res: Response,
  error: unknown,
) {
  if (isLiveDomainError(error)) {
    const status = statusForLiveError(error);
    const message = status >= 500
      ? 'Unable to process Live request.'
      : error.message;

    if (status >= 500) {
      console.error('[live.api] domain error', error);
    }

    return sendLiveError(req, res, status, message);
  }

  console.error('[live.api] unexpected error', error);
  return sendLiveError(req, res, 500, 'Unable to process Live request.');
}
