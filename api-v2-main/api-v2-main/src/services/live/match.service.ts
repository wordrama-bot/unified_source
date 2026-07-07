import { db } from '../../models/index.js';
import type {
  CancelMatchInput,
  CreateMatchInput,
  DetermineWinnerInput,
  FinishMatchInput,
  ForfeitPlayerInput,
  LiveJson,
  LiveMatch,
  LivePlayerId,
  LiveWinnerReason,
  MatchResultDecision,
  StartMatchInput,
} from './types.js';

export type LiveMatchErrorCode =
  | 'LIVE_MATCH_INVALID_INPUT'
  | 'LIVE_MATCH_FORBIDDEN'
  | 'LIVE_MATCH_TOURNAMENT_NOT_FOUND'
  | 'LIVE_MATCH_TOURNAMENT_NOT_IN_PROGRESS'
  | 'LIVE_MATCH_ENTRANT_NOT_FOUND'
  | 'LIVE_MATCH_DUPLICATE_PLAYER'
  | 'LIVE_MATCH_DUPLICATE_SLOT'
  | 'LIVE_MATCH_NOT_FOUND'
  | 'LIVE_MATCH_INVALID_TRANSITION'
  | 'LIVE_MATCH_PLAYER_NOT_FOUND'
  | 'LIVE_MATCH_DATABASE_FAILURE'
  | 'LIVE_MATCH_NOT_IMPLEMENTED';

export class LiveMatchError extends Error {
  code: LiveMatchErrorCode;

  constructor(code: LiveMatchErrorCode, message: string) {
    super(message);
    this.name = 'LiveMatchError';
    this.code = code;
  }
}

export interface MatchService {
  createMatch(input: CreateMatchInput): Promise<LiveMatch>;
  startMatch(input: StartMatchInput): Promise<LiveMatch>;
  cancelMatch(input: CancelMatchInput): Promise<LiveMatch>;
  finishMatch(input: FinishMatchInput): Promise<LiveMatch>;
  determineWinner(input: DetermineWinnerInput): Promise<MatchResultDecision>;
  forfeitPlayer(input: ForfeitPlayerInput): Promise<LiveMatch>;
}

type MatchStatus = 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

function assertRequiredId(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new LiveMatchError(
      'LIVE_MATCH_INVALID_INPUT',
      `${fieldName} is required.`,
    );
  }

  return value.trim();
}

function assertPositiveInteger(value: unknown, fieldName: string) {
  if (!Number.isInteger(value) || Number(value) <= 0) {
    throw new LiveMatchError(
      'LIVE_MATCH_INVALID_INPUT',
      `${fieldName} must be a positive integer.`,
    );
  }

  return Number(value);
}

function assertLiveJson(value: LiveJson | undefined, fieldName: string) {
  if (value === undefined) return;

  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    throw new LiveMatchError(
      'LIVE_MATCH_INVALID_INPUT',
      `${fieldName} must be an object.`,
    );
  }
}

function normalizeSolution(solution: unknown) {
  if (typeof solution !== 'string') {
    throw new LiveMatchError(
      'LIVE_MATCH_INVALID_INPUT',
      'solution is required.',
    );
  }

  const normalizedSolution = solution.trim().toUpperCase();

  if (!normalizedSolution) {
    throw new LiveMatchError(
      'LIVE_MATCH_INVALID_INPUT',
      'solution is required.',
    );
  }

  return normalizedSolution;
}

function mapMatchRow(row: any): LiveMatch {
  return {
    id: row.id,
    tournamentId: row.tournament_id,
    status: row.status,
    matchType: row.match_type,
    wordPack: row.word_pack,
    wordLength: row.word_length,
    maxAttempts: row.max_attempts,
    winnerPlayerId: row.winner_player_id,
    winnerReason: row.winner_reason,
    roundNumber: row.round_number,
    matchNumber: row.match_number,
    scheduledAt: row.scheduled_at,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    solution: row.solution,
    solutionHash: row.solution_hash,
    solutionSaltId: row.solution_salt_id,
    config: row.config ?? {},
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function matchSelect() {
  return `
    id,
    tournament_id,
    status,
    match_type,
    word_pack,
    word_length,
    max_attempts,
    winner_player_id,
    winner_reason,
    round_number,
    match_number,
    scheduled_at,
    started_at,
    ended_at,
    solution,
    solution_hash,
    solution_salt_id,
    config,
    metadata,
    created_at,
    updated_at
  `;
}

function throwCreateMatchRpcError(error: { message?: string }): never {
  const message = error.message ?? '';

  if (message.includes('LIVE_MATCH_INVALID_INPUT')) {
    throw new LiveMatchError(
      'LIVE_MATCH_INVALID_INPUT',
      'Match request is invalid.',
    );
  }

  if (message.includes('LIVE_MATCH_FORBIDDEN')) {
    throw new LiveMatchError(
      'LIVE_MATCH_FORBIDDEN',
      'Player cannot manage this tournament.',
    );
  }

  if (message.includes('LIVE_MATCH_TOURNAMENT_NOT_FOUND')) {
    throw new LiveMatchError(
      'LIVE_MATCH_TOURNAMENT_NOT_FOUND',
      'Live tournament not found.',
    );
  }

  if (message.includes('LIVE_MATCH_TOURNAMENT_NOT_IN_PROGRESS')) {
    throw new LiveMatchError(
      'LIVE_MATCH_TOURNAMENT_NOT_IN_PROGRESS',
      'Tournament is not in progress.',
    );
  }

  if (message.includes('LIVE_MATCH_ENTRANT_NOT_FOUND')) {
    throw new LiveMatchError(
      'LIVE_MATCH_ENTRANT_NOT_FOUND',
      'Tournament entrant not found.',
    );
  }

  if (message.includes('LIVE_MATCH_DUPLICATE_PLAYER')) {
    throw new LiveMatchError(
      'LIVE_MATCH_DUPLICATE_PLAYER',
      'Match players must be different.',
    );
  }

  if (message.includes('LIVE_MATCH_DUPLICATE_SLOT')) {
    throw new LiveMatchError(
      'LIVE_MATCH_DUPLICATE_SLOT',
      'Tournament match already exists for this round and match number.',
    );
  }

  console.error('[live.match] createMatch RPC error', error);
  throw new LiveMatchError(
    'LIVE_MATCH_DATABASE_FAILURE',
    'Unable to create Live match.',
  );
}

async function assertMatchOwner(matchId: string, requestedByPlayerId: string) {
  const { data: match, error: matchError } = await db
    .from('_live_matches')
    .select('id, tournament_id')
    .eq('id', matchId)
    .maybeSingle();

  if (matchError) {
    console.error('[live.match] ownership lookup error', matchError);
    throw new LiveMatchError(
      'LIVE_MATCH_DATABASE_FAILURE',
      'Unable to load Live match.',
    );
  }

  if (!match) {
    throw new LiveMatchError(
      'LIVE_MATCH_NOT_FOUND',
      'Live match not found.',
    );
  }

  const { data: tournament, error: tournamentError } = await db
    .from('_live_tournaments')
    .select('created_by_player_id')
    .eq('id', match.tournament_id)
    .maybeSingle();

  if (tournamentError) {
    console.error('[live.match] tournament ownership lookup error', tournamentError);
    throw new LiveMatchError(
      'LIVE_MATCH_DATABASE_FAILURE',
      'Unable to load Live match.',
    );
  }

  if (!tournament || tournament.created_by_player_id !== requestedByPlayerId) {
    throw new LiveMatchError(
      'LIVE_MATCH_FORBIDDEN',
      'Player cannot manage this match.',
    );
  }
}

async function assertPlayerInMatch(matchId: string, playerId: LivePlayerId) {
  const { data, error } = await db
    .from('_live_match_players')
    .select('id')
    .eq('match_id', matchId)
    .eq('player_id', playerId)
    .maybeSingle();

  if (error) {
    console.error('[live.match] player membership lookup error', error);
    throw new LiveMatchError(
      'LIVE_MATCH_DATABASE_FAILURE',
      'Unable to load Live match player.',
    );
  }

  if (!data) {
    throw new LiveMatchError(
      'LIVE_MATCH_PLAYER_NOT_FOUND',
      'Live match player not found.',
    );
  }
}

async function guardedMatchUpdate({
  matchId,
  nextStatus,
  requestedByPlayerId,
  allowedStatuses,
  patch,
}: {
  matchId: string;
  nextStatus: MatchStatus;
  requestedByPlayerId: string;
  allowedStatuses: string[];
  patch: Record<string, unknown>;
}) {
  await assertMatchOwner(matchId, requestedByPlayerId);

  const { data, error } = await db
    .from('_live_matches')
    .update({
      ...patch,
      status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', matchId)
    .in('status', allowedStatuses)
    .select(matchSelect())
    .maybeSingle();

  if (error) {
    console.error('[live.match] guarded match update error', error);
    throw new LiveMatchError(
      'LIVE_MATCH_DATABASE_FAILURE',
      'Unable to update Live match.',
    );
  }

  if (!data) {
    throw new LiveMatchError(
      'LIVE_MATCH_INVALID_TRANSITION',
      'Live match cannot transition from its current state.',
    );
  }

  return mapMatchRow(data);
}

async function updateMatchPlayersStatus({
  matchId,
  fromStatuses,
  patch,
}: {
  matchId: string;
  fromStatuses: string[];
  patch: Record<string, unknown>;
}) {
  const { error } = await db
    .from('_live_match_players')
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq('match_id', matchId)
    .in('status', fromStatuses);

  if (error) {
    console.error('[live.match] match players update error', error);
    throw new LiveMatchError(
      'LIVE_MATCH_DATABASE_FAILURE',
      'Unable to update Live match players.',
    );
  }
}

function normalizeCreateMatchInput(input: CreateMatchInput) {
  const tournamentId = assertRequiredId(input?.tournamentId, 'tournamentId');
  const requestedByPlayerId = assertRequiredId(
    input?.requestedByPlayerId,
    'requestedByPlayerId',
  );
  const roundNumber = assertPositiveInteger(input?.roundNumber, 'roundNumber');
  const matchNumber = assertPositiveInteger(input?.matchNumber, 'matchNumber');
  const wordLength = input.wordLength ?? 5;
  const maxAttempts = input.maxAttempts ?? 6;
  const solution = normalizeSolution(input.solution);

  if (!Array.isArray(input.playerIds) || input.playerIds.length !== 2) {
    throw new LiveMatchError(
      'LIVE_MATCH_INVALID_INPUT',
      'Exactly two match players are required.',
    );
  }

  const playerIds = input.playerIds.map((playerId) =>
    assertRequiredId(playerId, 'playerId'),
  );

  if (playerIds[0] === playerIds[1]) {
    throw new LiveMatchError(
      'LIVE_MATCH_DUPLICATE_PLAYER',
      'Match players must be different.',
    );
  }

  if (solution.length !== wordLength) {
    throw new LiveMatchError(
      'LIVE_MATCH_INVALID_INPUT',
      'solution length must match wordLength.',
    );
  }

  assertPositiveInteger(wordLength, 'wordLength');
  assertPositiveInteger(maxAttempts, 'maxAttempts');
  assertLiveJson(input.config, 'config');
  assertLiveJson(input.metadata, 'metadata');

  return {
    tournamentId,
    requestedByPlayerId,
    roundNumber,
    matchNumber,
    wordPack: input.wordPack?.trim().toUpperCase() || 'FIVE_LETTER',
    wordLength,
    maxAttempts,
    playerIds,
    solution,
    solutionHash: input.solutionHash ?? null,
    solutionSaltId: input.solutionSaltId ?? null,
    scheduledAt: input.scheduledAt ?? null,
    config: input.config ?? {},
    metadata: input.metadata ?? {},
  };
}

export async function createMatch(
  input: CreateMatchInput,
): Promise<LiveMatch> {
  const match = normalizeCreateMatchInput(input);

  const { data, error } = await db.rpc('wordrama_live_create_match', {
    p_tournament_id: match.tournamentId,
    p_requested_by_player_id: match.requestedByPlayerId,
    p_player_ids: match.playerIds,
    p_round_number: match.roundNumber,
    p_match_number: match.matchNumber,
    p_solution: match.solution,
    p_word_pack: match.wordPack,
    p_word_length: match.wordLength,
    p_max_attempts: match.maxAttempts,
    p_solution_hash: match.solutionHash,
    p_solution_salt_id: match.solutionSaltId,
    p_scheduled_at: match.scheduledAt,
    p_config: match.config,
    p_metadata: match.metadata,
  });

  if (error) {
    throwCreateMatchRpcError(error);
  }

  const row = Array.isArray(data) ? data[0] : data;

  if (!row) {
    console.error('[live.match] createMatch RPC returned no row');
    throw new LiveMatchError(
      'LIVE_MATCH_DATABASE_FAILURE',
      'Unable to create Live match.',
    );
  }

  return mapMatchRow(row);
}

export async function startMatch(
  input: StartMatchInput,
): Promise<LiveMatch> {
  const matchId = assertRequiredId(input?.matchId, 'matchId');
  const requestedByPlayerId = assertRequiredId(
    input?.requestedByPlayerId,
    'requestedByPlayerId',
  );
  const now = new Date().toISOString();
  const match = await guardedMatchUpdate({
    matchId,
    requestedByPlayerId,
    allowedStatuses: ['READY'],
    nextStatus: 'IN_PROGRESS',
    patch: {
      started_at: now,
    },
  });

  await updateMatchPlayersStatus({
    matchId,
    fromStatuses: ['READY'],
    patch: {
      status: 'PLAYING',
    },
  });

  return match;
}

export async function cancelMatch(
  input: CancelMatchInput,
): Promise<LiveMatch> {
  const matchId = assertRequiredId(input?.matchId, 'matchId');
  const requestedByPlayerId = assertRequiredId(
    input?.requestedByPlayerId,
    'requestedByPlayerId',
  );
  const now = new Date().toISOString();
  const match = await guardedMatchUpdate({
    matchId,
    requestedByPlayerId,
    allowedStatuses: ['PENDING', 'READY'],
    nextStatus: 'CANCELLED',
    patch: {
      ended_at: now,
    },
  });

  await updateMatchPlayersStatus({
    matchId,
    fromStatuses: ['JOINED', 'READY'],
    patch: {
      status: 'DISCONNECTED',
      finished_at: now,
      result: 'NO_CONTEST',
    },
  });

  return match;
}

function assertWinnerReason(winnerReason: LiveWinnerReason | null | undefined) {
  if (!winnerReason) return null;

  const allowedReasons: LiveWinnerReason[] = [
    'OPPONENT_FORFEITED',
    'ADMIN_DECISION',
    'NO_WINNER',
  ];

  if (!allowedReasons.includes(winnerReason)) {
    throw new LiveMatchError(
      'LIVE_MATCH_INVALID_INPUT',
      'winnerReason is not valid for lifecycle finish.',
    );
  }

  return winnerReason;
}

export async function finishMatch(
  input: FinishMatchInput,
): Promise<LiveMatch> {
  const matchId = assertRequiredId(input?.matchId, 'matchId');
  const requestedByPlayerId = assertRequiredId(
    input?.requestedByPlayerId,
    'requestedByPlayerId',
  );
  const winnerPlayerId = input.winnerPlayerId
    ? assertRequiredId(input.winnerPlayerId, 'winnerPlayerId')
    : null;
  const winnerReason = assertWinnerReason(input.winnerReason);
  const now = new Date().toISOString();

  if (winnerPlayerId) {
    await assertPlayerInMatch(matchId, winnerPlayerId);
  }

  const match = await guardedMatchUpdate({
    matchId,
    requestedByPlayerId,
    allowedStatuses: ['IN_PROGRESS'],
    nextStatus: 'COMPLETED',
    patch: {
      ended_at: now,
      winner_player_id: winnerPlayerId,
      winner_reason: winnerReason,
    },
  });

  await updateMatchPlayersStatus({
    matchId,
    fromStatuses: ['PLAYING'],
    patch: {
      status: 'FINISHED',
      finished_at: now,
    },
  });

  return match;
}

export async function forfeitPlayer(
  input: ForfeitPlayerInput,
): Promise<LiveMatch> {
  const matchId = assertRequiredId(input?.matchId, 'matchId');
  const playerId = assertRequiredId(input?.playerId, 'playerId');
  const requestedByPlayerId = assertRequiredId(
    input?.requestedByPlayerId,
    'requestedByPlayerId',
  );
  const now = new Date().toISOString();

  await assertMatchOwner(matchId, requestedByPlayerId);

  const { data: matchPlayer, error: playerError } = await db
    .from('_live_match_players')
    .update({
      status: 'FORFEITED',
      result: 'FORFEIT',
      forfeited_at: now,
      finished_at: now,
      updated_at: now,
    })
    .eq('match_id', matchId)
    .eq('player_id', playerId)
    .in('status', ['READY', 'PLAYING'])
    .select('id')
    .maybeSingle();

  if (playerError) {
    console.error('[live.match] forfeitPlayer update error', playerError);
    throw new LiveMatchError(
      'LIVE_MATCH_DATABASE_FAILURE',
      'Unable to forfeit Live match player.',
    );
  }

  if (!matchPlayer) {
    throw new LiveMatchError(
      'LIVE_MATCH_PLAYER_NOT_FOUND',
      'Live match player not found.',
    );
  }

  const { data, error } = await db
    .from('_live_matches')
    .select(matchSelect())
    .eq('id', matchId)
    .maybeSingle();

  if (error) {
    console.error('[live.match] forfeitPlayer match lookup error', error);
    throw new LiveMatchError(
      'LIVE_MATCH_DATABASE_FAILURE',
      'Unable to load Live match.',
    );
  }

  if (!data) {
    throw new LiveMatchError(
      'LIVE_MATCH_NOT_FOUND',
      'Live match not found.',
    );
  }

  return mapMatchRow(data);
}

export async function determineWinner(
  input: DetermineWinnerInput,
): Promise<MatchResultDecision> {
  assertRequiredId(input?.matchId, 'matchId');

  throw new LiveMatchError(
    'LIVE_MATCH_NOT_IMPLEMENTED',
    'Winner determination is deferred until the guess engine phase.',
  );
}
