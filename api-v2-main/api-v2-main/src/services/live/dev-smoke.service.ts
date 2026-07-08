import { db } from '../../models/index.js';
import { LIVE_FEATURE_ENTITLEMENT_KEY } from './constants.js';
import { createMatch } from './match.service.js';
import type {
  CreateMatchInput,
  LiveJson,
  LivePlayerId,
  LiveTournament,
  LiveTournamentStatus,
} from './types.js';

export type LiveDevSmokeErrorCode =
  | 'LIVE_DEV_SMOKE_INVALID_INPUT'
  | 'LIVE_DEV_SMOKE_NOT_FOUND'
  | 'LIVE_DEV_SMOKE_FORBIDDEN'
  | 'LIVE_DEV_SMOKE_INVALID_TRANSITION'
  | 'LIVE_DEV_SMOKE_DATABASE_FAILURE';

export class LiveDevSmokeError extends Error {
  code: LiveDevSmokeErrorCode;

  constructor(code: LiveDevSmokeErrorCode, message: string) {
    super(message);
    this.name = 'LiveDevSmokeError';
    this.code = code;
  }
}

export interface GrantLiveEntitlementInput {
  playerId: LivePlayerId;
  grantedByPlayerId: LivePlayerId;
}

export interface TournamentSmokeStatusInput {
  tournamentId: string;
  requestedByPlayerId: LivePlayerId;
}

function assertRequiredId(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new LiveDevSmokeError(
      'LIVE_DEV_SMOKE_INVALID_INPUT',
      `${fieldName} is required.`,
    );
  }

  return value.trim();
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

function tournamentSelect() {
  return `
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
  `;
}

async function loadTournamentForOwner(
  tournamentId: string,
  requestedByPlayerId: string,
) {
  const { data, error } = await db
    .from('_live_tournaments')
    .select(tournamentSelect())
    .eq('id', tournamentId)
    .maybeSingle();

  if (error) {
    console.error('[live.dev-smoke] tournament lookup error', error);
    throw new LiveDevSmokeError(
      'LIVE_DEV_SMOKE_DATABASE_FAILURE',
      'Unable to load Live tournament.',
    );
  }

  if (!data) {
    throw new LiveDevSmokeError(
      'LIVE_DEV_SMOKE_NOT_FOUND',
      'Live tournament not found.',
    );
  }

  const row = data as any;

  if (row.created_by_player_id !== requestedByPlayerId) {
    throw new LiveDevSmokeError(
      'LIVE_DEV_SMOKE_FORBIDDEN',
      'Player cannot manage this Live tournament.',
    );
  }

  return mapTournamentRow(row);
}

async function updateTournamentStatus({
  tournamentId,
  requestedByPlayerId,
  nextStatus,
  allowedStatuses,
  patch,
}: {
  tournamentId: string;
  requestedByPlayerId: string;
  nextStatus: LiveTournamentStatus;
  allowedStatuses: LiveTournamentStatus[];
  patch?: Record<string, unknown>;
}) {
  const tournament = await loadTournamentForOwner(
    tournamentId,
    requestedByPlayerId,
  );

  if (!allowedStatuses.includes(tournament.status)) {
    throw new LiveDevSmokeError(
      'LIVE_DEV_SMOKE_INVALID_TRANSITION',
      'Live tournament cannot transition from its current state.',
    );
  }

  const { data, error } = await db
    .from('_live_tournaments')
    .update({
      ...(patch ?? {}),
      status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tournamentId)
    .eq('created_by_player_id', requestedByPlayerId)
    .in('status', allowedStatuses)
    .select(tournamentSelect())
    .maybeSingle();

  if (error) {
    console.error('[live.dev-smoke] tournament status update error', error);
    throw new LiveDevSmokeError(
      'LIVE_DEV_SMOKE_DATABASE_FAILURE',
      'Unable to update Live tournament.',
    );
  }

  if (!data) {
    throw new LiveDevSmokeError(
      'LIVE_DEV_SMOKE_INVALID_TRANSITION',
      'Live tournament cannot transition from its current state.',
    );
  }

  return mapTournamentRow(data);
}

export async function grantLiveEntitlement(
  input: GrantLiveEntitlementInput,
) {
  const playerId = assertRequiredId(input?.playerId, 'playerId');
  const grantedByPlayerId = assertRequiredId(
    input?.grantedByPlayerId,
    'grantedByPlayerId',
  );
  const now = new Date().toISOString();

  const { data: existing, error: lookupError } = await db
    .from('_player_entitlements')
    .select('*')
    .eq('player_id', playerId)
    .eq('entitlement_key', LIVE_FEATURE_ENTITLEMENT_KEY)
    .eq('status', 'ACTIVE')
    .is('revoked_at', null)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    console.error('[live.dev-smoke] entitlement lookup error', lookupError);
    throw new LiveDevSmokeError(
      'LIVE_DEV_SMOKE_DATABASE_FAILURE',
      'Unable to load Live entitlement.',
    );
  }

  if (existing) {
    return existing;
  }

  const { data, error } = await db
    .from('_player_entitlements')
    .insert({
      player_id: playerId,
      entitlement_key: LIVE_FEATURE_ENTITLEMENT_KEY,
      entitlement_type: 'FEATURE',
      source_type: 'ADMIN',
      status: 'ACTIVE',
      starts_at: now,
      expires_at: null,
      metadata: {
        source: 'wordrama_live_dev_smoke',
        grantedBy: grantedByPlayerId,
        devOnly: true,
      },
    })
    .select('*')
    .maybeSingle();

  if (error || !data) {
    console.error('[live.dev-smoke] entitlement insert error', error);
    throw new LiveDevSmokeError(
      'LIVE_DEV_SMOKE_DATABASE_FAILURE',
      'Unable to grant Live smoke entitlement.',
    );
  }

  return data;
}

export async function openRegistration(
  input: TournamentSmokeStatusInput,
): Promise<LiveTournament> {
  const tournamentId = assertRequiredId(input?.tournamentId, 'tournamentId');
  const requestedByPlayerId = assertRequiredId(
    input?.requestedByPlayerId,
    'requestedByPlayerId',
  );

  return updateTournamentStatus({
    tournamentId,
    requestedByPlayerId,
    nextStatus: 'REGISTRATION_OPEN',
    allowedStatuses: ['DRAFT', 'SCHEDULED', 'REGISTRATION_CLOSED'],
  });
}

export async function startTournament(
  input: TournamentSmokeStatusInput,
): Promise<LiveTournament> {
  const tournamentId = assertRequiredId(input?.tournamentId, 'tournamentId');
  const requestedByPlayerId = assertRequiredId(
    input?.requestedByPlayerId,
    'requestedByPlayerId',
  );

  return updateTournamentStatus({
    tournamentId,
    requestedByPlayerId,
    nextStatus: 'IN_PROGRESS',
    allowedStatuses: ['REGISTRATION_CLOSED', 'REGISTRATION_OPEN'],
    patch: {
      starts_at: new Date().toISOString(),
    },
  });
}

export async function createSmokeMatch(
  input: CreateMatchInput & { metadata?: LiveJson },
) {
  return createMatch(input);
}
