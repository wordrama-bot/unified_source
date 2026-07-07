import { randomInt } from 'crypto';
import { db } from '../../models/index.js';
import { hasPlayerEntitlement } from '../marketplaceV2/entitlements.js';
import {
  LIVE_DEFAULT_BEST_OF,
  LIVE_FEATURE_ENTITLEMENT_KEY,
  LIVE_TOURNAMENT_BEST_OF_VALUES,
  LIVE_TOURNAMENT_JOIN_CODE_ALPHABET,
  LIVE_TOURNAMENT_JOIN_CODE_LENGTH,
  LIVE_TOURNAMENT_JOIN_CODE_MAX_RETRIES,
  LIVE_TOURNAMENT_VISIBILITIES,
} from './constants.js';
import type {
  CreateTournamentInput,
  LiveJson,
  LiveTournament,
  LiveTournamentBestOf,
  LiveTournamentVisibility,
  TournamentStatusInput,
  UpdateTournamentInput,
} from './types.js';

export type LiveTournamentCreateErrorCode =
  | 'LIVE_TOURNAMENT_INVALID_INPUT'
  | 'LIVE_TOURNAMENT_MISSING_ENTITLEMENT'
  | 'LIVE_TOURNAMENT_JOIN_CODE_RETRY_FAILURE'
  | 'LIVE_TOURNAMENT_DATABASE_FAILURE';

export class LiveTournamentCreateError extends Error {
  code: LiveTournamentCreateErrorCode;

  constructor(code: LiveTournamentCreateErrorCode, message: string) {
    super(message);
    this.name = 'LiveTournamentCreateError';
    this.code = code;
  }
}

export interface TournamentService {
  createTournament(input: CreateTournamentInput): Promise<LiveTournament>;
  updateTournament(input: UpdateTournamentInput): Promise<LiveTournament>;
  openRegistration(input: TournamentStatusInput): Promise<LiveTournament>;
  closeRegistration(input: TournamentStatusInput): Promise<LiveTournament>;
  startTournament(input: TournamentStatusInput): Promise<LiveTournament>;
  endTournament(input: TournamentStatusInput): Promise<LiveTournament>;
  cancelTournament(input: TournamentStatusInput): Promise<LiveTournament>;
}

function assertLiveJson(value: LiveJson | undefined, fieldName: string) {
  if (value === undefined) return;

  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    throw new LiveTournamentCreateError(
      'LIVE_TOURNAMENT_INVALID_INPUT',
      `${fieldName} must be an object.`,
    );
  }
}

function normalizeTournamentName(name: string) {
  if (typeof name !== 'string') {
    throw new LiveTournamentCreateError(
      'LIVE_TOURNAMENT_INVALID_INPUT',
      'Tournament name is required.',
    );
  }

  const cleanName = name.trim();

  if (!cleanName) {
    throw new LiveTournamentCreateError(
      'LIVE_TOURNAMENT_INVALID_INPUT',
      'Tournament name is required.',
    );
  }

  return cleanName;
}

function normalizeVisibility(
  visibility: LiveTournamentVisibility | undefined,
) {
  const normalizedVisibility = visibility ?? 'PRIVATE';

  if (!LIVE_TOURNAMENT_VISIBILITIES.includes(normalizedVisibility)) {
    throw new LiveTournamentCreateError(
      'LIVE_TOURNAMENT_INVALID_INPUT',
      'Tournament visibility is invalid.',
    );
  }

  return normalizedVisibility;
}

function normalizeBestOf(bestOf: LiveTournamentBestOf | undefined) {
  const normalizedBestOf = bestOf ?? LIVE_DEFAULT_BEST_OF;

  if (!LIVE_TOURNAMENT_BEST_OF_VALUES.includes(normalizedBestOf)) {
    throw new LiveTournamentCreateError(
      'LIVE_TOURNAMENT_INVALID_INPUT',
      'Tournament best_of must be 1, 3, or 5.',
    );
  }

  return normalizedBestOf;
}

function validateCreateTournamentInput(input: CreateTournamentInput) {
  if (!input || typeof input !== 'object') {
    throw new LiveTournamentCreateError(
      'LIVE_TOURNAMENT_INVALID_INPUT',
      'Tournament input is required.',
    );
  }

  if (
    typeof input.createdByPlayerId !== 'string' ||
    !input.createdByPlayerId.trim()
  ) {
    throw new LiveTournamentCreateError(
      'LIVE_TOURNAMENT_INVALID_INPUT',
      'createdByPlayerId is required.',
    );
  }

  assertLiveJson(input.config, 'config');
  assertLiveJson(input.metadata, 'metadata');

  return {
    name: normalizeTournamentName(input.name),
    createdByPlayerId: input.createdByPlayerId,
    visibility: normalizeVisibility(input.visibility),
    bestOf: normalizeBestOf(input.bestOf),
    config: input.config ?? {},
    metadata: input.metadata ?? {},
  };
}

function mapTournamentRow(row: any): LiveTournament {
  return {
    id: row.id,
    name: row.name,
    joinCode: row.join_code,
    status: row.status,
    visibility: row.visibility,
    createdByPlayerId: row.created_by_player_id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    maxEntrants: row.max_entrants,
    bestOf: row.best_of,
    config: row.config ?? {},
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function isJoinCodeConflict(error: {
  code?: string;
  details?: string;
  message?: string;
}) {
  const errorText = `${error.message ?? ''} ${error.details ?? ''}`;

  return (
    error.code === '23505' &&
    errorText.includes('join_code')
  );
}

export function generateLiveTournamentJoinCode() {
  let joinCode = '';

  for (let index = 0; index < LIVE_TOURNAMENT_JOIN_CODE_LENGTH; index += 1) {
    joinCode += LIVE_TOURNAMENT_JOIN_CODE_ALPHABET[
      randomInt(LIVE_TOURNAMENT_JOIN_CODE_ALPHABET.length)
    ];
  }

  return joinCode;
}

export async function createTournament(
  input: CreateTournamentInput,
): Promise<LiveTournament> {
  const tournament = validateCreateTournamentInput(input);

  let hasLiveEntitlement = false;

  try {
    hasLiveEntitlement = await hasPlayerEntitlement(
      tournament.createdByPlayerId,
      LIVE_FEATURE_ENTITLEMENT_KEY,
    );
  } catch (error) {
    console.error('[live.tournament] entitlement check error', error);
    throw new LiveTournamentCreateError(
      'LIVE_TOURNAMENT_DATABASE_FAILURE',
      'Unable to verify Live tournament entitlement.',
    );
  }

  if (!hasLiveEntitlement) {
    throw new LiveTournamentCreateError(
      'LIVE_TOURNAMENT_MISSING_ENTITLEMENT',
      'Wordrama Live access is required to create a tournament.',
    );
  }

  for (
    let attempt = 0;
    attempt < LIVE_TOURNAMENT_JOIN_CODE_MAX_RETRIES;
    attempt += 1
  ) {
    const joinCode = generateLiveTournamentJoinCode();

    const { data, error } = await db
      .from('_live_tournaments')
      .insert({
        created_by_player_id: tournament.createdByPlayerId,
        name: tournament.name,
        join_code: joinCode,
        visibility: tournament.visibility,
        best_of: tournament.bestOf,
        status: 'DRAFT',
        config: tournament.config,
        metadata: tournament.metadata,
      })
      .select(`
        id,
        name,
        join_code,
        status,
        visibility,
        created_by_player_id,
        starts_at,
        ends_at,
        max_entrants,
        best_of,
        config,
        metadata,
        created_at,
        updated_at
      `)
      .maybeSingle();

    if (!error && data) {
      return mapTournamentRow(data);
    }

    if (error && isJoinCodeConflict(error)) {
      continue;
    }

    console.error('[live.tournament] createTournament error', error);
    throw new LiveTournamentCreateError(
      'LIVE_TOURNAMENT_DATABASE_FAILURE',
      'Unable to create Live tournament.',
    );
  }

  throw new LiveTournamentCreateError(
    'LIVE_TOURNAMENT_JOIN_CODE_RETRY_FAILURE',
    'Unable to generate a unique tournament join code.',
  );
}
