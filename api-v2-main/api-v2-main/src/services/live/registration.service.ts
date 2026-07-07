import { db } from '../../models/index.js';
import type {
  CheckEligibilityInput,
  EligibilityResult,
  JoinTournamentInput,
  LeaveTournamentInput,
  LiveJson,
  LiveTournamentEntrant,
  ReadyPlayerInput,
} from './types.js';

export type LiveRegistrationErrorCode =
  | 'LIVE_REGISTRATION_INVALID_INPUT'
  | 'LIVE_REGISTRATION_TOURNAMENT_NOT_FOUND'
  | 'LIVE_REGISTRATION_NOT_OPEN'
  | 'LIVE_REGISTRATION_PLAYER_NOT_FOUND'
  | 'LIVE_REGISTRATION_DUPLICATE_ENTRANT'
  | 'LIVE_REGISTRATION_TOURNAMENT_FULL'
  | 'LIVE_REGISTRATION_ENTRANT_NOT_FOUND'
  | 'LIVE_REGISTRATION_DATABASE_FAILURE';

export class LiveRegistrationError extends Error {
  code: LiveRegistrationErrorCode;

  constructor(code: LiveRegistrationErrorCode, message: string) {
    super(message);
    this.name = 'LiveRegistrationError';
    this.code = code;
  }
}

export interface RegistrationService {
  joinTournament(input: JoinTournamentInput): Promise<LiveTournamentEntrant>;
  leaveTournament(input: LeaveTournamentInput): Promise<LiveTournamentEntrant>;
  readyPlayer(input: ReadyPlayerInput): Promise<LiveTournamentEntrant>;
  checkEligibility(input: CheckEligibilityInput): Promise<EligibilityResult>;
}

type LiveTournamentRegistrationRow = {
  id: string;
  status: string;
  max_entrants: number | null;
};

function assertLiveJson(value: LiveJson | undefined, fieldName: string) {
  if (value === undefined) return;

  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_INVALID_INPUT',
      `${fieldName} must be an object.`,
    );
  }
}

function assertRequiredId(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_INVALID_INPUT',
      `${fieldName} is required.`,
    );
  }

  return value.trim();
}

function mapEntrantRow(row: any): LiveTournamentEntrant {
  return {
    id: row.id,
    tournamentId: row.tournament_id,
    playerId: row.player_id,
    displayNameSnapshot: row.display_name_snapshot,
    status: row.status,
    seed: row.seed,
    score: row.score,
    metadata: row.metadata ?? {},
    joinedAt: row.joined_at,
    checkedInAt: row.checked_in_at,
    eliminatedAt: row.eliminated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function throwRegistrationRpcError(error: { message?: string }): never {
  const message = error.message ?? '';

  if (message.includes('LIVE_REGISTRATION_INVALID_INPUT')) {
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_INVALID_INPUT',
      'Tournament registration request is invalid.',
    );
  }

  if (message.includes('LIVE_REGISTRATION_TOURNAMENT_NOT_FOUND')) {
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_TOURNAMENT_NOT_FOUND',
      'Live tournament not found.',
    );
  }

  if (message.includes('LIVE_REGISTRATION_NOT_OPEN')) {
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_NOT_OPEN',
      'Tournament registration is not open.',
    );
  }

  if (message.includes('LIVE_REGISTRATION_PLAYER_NOT_FOUND')) {
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_PLAYER_NOT_FOUND',
      'Player not found.',
    );
  }

  if (message.includes('LIVE_REGISTRATION_DUPLICATE_ENTRANT')) {
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_DUPLICATE_ENTRANT',
      'Player is already registered for this tournament.',
    );
  }

  if (message.includes('LIVE_REGISTRATION_TOURNAMENT_FULL')) {
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_TOURNAMENT_FULL',
      'Tournament registration is full.',
    );
  }

  console.error('[live.registration] joinTournament RPC error', error);
  throw new LiveRegistrationError(
    'LIVE_REGISTRATION_DATABASE_FAILURE',
    'Unable to join Live tournament.',
  );
}

async function getTournamentForRegistration(
  tournamentId: string,
): Promise<LiveTournamentRegistrationRow> {
  const { data, error } = await db
    .from('_live_tournaments')
    .select('id, status, max_entrants')
    .eq('id', tournamentId)
    .maybeSingle();

  if (error) {
    console.error('[live.registration] tournament lookup error', error);
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_DATABASE_FAILURE',
      'Unable to load Live tournament.',
    );
  }

  if (!data) {
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_TOURNAMENT_NOT_FOUND',
      'Live tournament not found.',
    );
  }

  return data;
}

function assertRegistrationOpen(tournament: LiveTournamentRegistrationRow) {
  if (tournament.status !== 'REGISTRATION_OPEN') {
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_NOT_OPEN',
      'Tournament registration is not open.',
    );
  }
}

async function getEntrant(tournamentId: string, playerId: string) {
  const { data, error } = await db
    .from('_live_tournament_entrants')
    .select(`
      id,
      tournament_id,
      player_id,
      display_name_snapshot,
      status,
      seed,
      score,
      metadata,
      joined_at,
      checked_in_at,
      eliminated_at,
      created_at,
      updated_at
    `)
    .eq('tournament_id', tournamentId)
    .eq('player_id', playerId)
    .maybeSingle();

  if (error) {
    console.error('[live.registration] entrant lookup error', error);
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_DATABASE_FAILURE',
      'Unable to load tournament entrant.',
    );
  }

  return data ? mapEntrantRow(data) : null;
}

async function playerExists(playerId: string) {
  const { data, error } = await db
    .from('_players')
    .select('id')
    .eq('id', playerId)
    .maybeSingle();

  if (error) {
    console.error('[live.registration] player exists lookup error', error);
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_DATABASE_FAILURE',
      'Unable to load player.',
    );
  }

  return !!data;
}

async function getActiveEntrantCount(tournamentId: string) {
  const { count, error } = await db
    .from('_live_tournament_entrants')
    .select('id', { count: 'exact', head: true })
    .eq('tournament_id', tournamentId)
    .in('status', ['REGISTERED', 'CHECKED_IN', 'ACTIVE']);

  if (error) {
    console.error('[live.registration] entrant count error', error);
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_DATABASE_FAILURE',
      'Unable to count tournament entrants.',
    );
  }

  return count ?? 0;
}

export async function checkEligibility(
  input: CheckEligibilityInput,
): Promise<EligibilityResult> {
  const tournamentId = assertRequiredId(input?.tournamentId, 'tournamentId');
  const playerId = assertRequiredId(input?.playerId, 'playerId');
  const reasons: string[] = [];

  const tournament = await getTournamentForRegistration(tournamentId);

  if (tournament.status !== 'REGISTRATION_OPEN') {
    reasons.push('Tournament registration is not open.');
  }

  if (!(await playerExists(playerId))) {
    reasons.push('Player not found.');
  }

  const entrant = await getEntrant(tournamentId, playerId);

  if (entrant) {
    reasons.push('Player is already registered for this tournament.');
  }

  if (tournament.max_entrants) {
    const entrantCount = await getActiveEntrantCount(tournamentId);

    if (entrantCount >= tournament.max_entrants) {
      reasons.push('Tournament registration is full.');
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

export async function joinTournament(
  input: JoinTournamentInput,
): Promise<LiveTournamentEntrant> {
  const tournamentId = assertRequiredId(input?.tournamentId, 'tournamentId');
  const playerId = assertRequiredId(input?.playerId, 'playerId');

  assertLiveJson(input?.metadata, 'metadata');

  const { data, error } = await db
    .rpc('wordrama_live_join_tournament', {
      p_tournament_id: tournamentId,
      p_player_id: playerId,
      p_metadata: input.metadata ?? {},
    });

  if (error) {
    throwRegistrationRpcError(error);
  }

  const row = Array.isArray(data) ? data[0] : data;

  if (!row) {
    console.error('[live.registration] joinTournament RPC returned no row');
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_DATABASE_FAILURE',
      'Unable to join Live tournament.',
    );
  }

  return mapEntrantRow(row);
}

export async function leaveTournament(
  input: LeaveTournamentInput,
): Promise<LiveTournamentEntrant> {
  const tournamentId = assertRequiredId(input?.tournamentId, 'tournamentId');
  const playerId = assertRequiredId(input?.playerId, 'playerId');
  const tournament = await getTournamentForRegistration(tournamentId);

  assertRegistrationOpen(tournament);

  const { data, error } = await db
    .from('_live_tournament_entrants')
    .update({
      status: 'WITHDRAWN',
      updated_at: new Date().toISOString(),
    })
    .eq('tournament_id', tournamentId)
    .eq('player_id', playerId)
    .in('status', ['REGISTERED', 'CHECKED_IN'])
    .select(`
      id,
      tournament_id,
      player_id,
      display_name_snapshot,
      status,
      seed,
      score,
      metadata,
      joined_at,
      checked_in_at,
      eliminated_at,
      created_at,
      updated_at
    `)
    .maybeSingle();

  if (error) {
    console.error('[live.registration] leaveTournament error', error);
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_DATABASE_FAILURE',
      'Unable to leave Live tournament.',
    );
  }

  if (!data) {
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_ENTRANT_NOT_FOUND',
      'Tournament entrant not found.',
    );
  }

  return mapEntrantRow(data);
}

export async function readyPlayer(
  input: ReadyPlayerInput,
): Promise<LiveTournamentEntrant> {
  const tournamentId = assertRequiredId(input?.tournamentId, 'tournamentId');
  const playerId = assertRequiredId(input?.playerId, 'playerId');
  const tournament = await getTournamentForRegistration(tournamentId);
  const now = new Date().toISOString();

  assertRegistrationOpen(tournament);

  const { data, error } = await db
    .from('_live_tournament_entrants')
    .update({
      status: 'CHECKED_IN',
      checked_in_at: now,
      updated_at: now,
    })
    .eq('tournament_id', tournamentId)
    .eq('player_id', playerId)
    .in('status', ['REGISTERED', 'CHECKED_IN'])
    .select(`
      id,
      tournament_id,
      player_id,
      display_name_snapshot,
      status,
      seed,
      score,
      metadata,
      joined_at,
      checked_in_at,
      eliminated_at,
      created_at,
      updated_at
    `)
    .maybeSingle();

  if (error) {
    console.error('[live.registration] readyPlayer error', error);
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_DATABASE_FAILURE',
      'Unable to ready Live tournament entrant.',
    );
  }

  if (!data) {
    throw new LiveRegistrationError(
      'LIVE_REGISTRATION_ENTRANT_NOT_FOUND',
      'Tournament entrant not found.',
    );
  }

  return mapEntrantRow(data);
}
