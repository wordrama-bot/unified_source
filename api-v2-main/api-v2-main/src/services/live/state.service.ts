import { db } from '../../models/index.js';
import type {
  GetMatchStateInput,
  LiveMatch,
  LiveMatchGuess,
  LiveMatchPlayer,
  LiveMatchState,
  LiveMatchStateMatch,
} from './types.js';

export type LiveStateErrorCode =
  | 'LIVE_STATE_INVALID_INPUT'
  | 'LIVE_STATE_MATCH_NOT_FOUND'
  | 'LIVE_STATE_FORBIDDEN'
  | 'LIVE_STATE_DATABASE_FAILURE';

export class LiveStateError extends Error {
  code: LiveStateErrorCode;

  constructor(code: LiveStateErrorCode, message: string) {
    super(message);
    this.name = 'LiveStateError';
    this.code = code;
  }
}

function assertRequiredId(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new LiveStateError(
      'LIVE_STATE_INVALID_INPUT',
      `${fieldName} is required.`,
    );
  }

  return value.trim();
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

function matchPlayerSelect() {
  return `
    id,
    match_id,
    player_id,
    tournament_entrant_id,
    seat,
    status,
    score,
    guess_count,
    result,
    joined_at,
    ready_at,
    solved_at,
    failed_at,
    finished_at,
    forfeited_at,
    last_seen_at,
    metadata,
    created_at,
    updated_at
  `;
}

function matchGuessSelect() {
  return `
    id,
    match_id,
    match_player_id,
    player_id,
    guess_index,
    guess,
    is_valid,
    validation_error,
    evaluation,
    submitted_at,
    metadata,
    created_at
  `;
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

function mapMatchPlayerRow(row: any): LiveMatchPlayer {
  return {
    id: row.id,
    matchId: row.match_id,
    playerId: row.player_id,
    tournamentEntrantId: row.tournament_entrant_id,
    seat: row.seat,
    status: row.status,
    score: row.score,
    guessCount: row.guess_count,
    result: row.result,
    joinedAt: row.joined_at,
    readyAt: row.ready_at,
    solvedAt: row.solved_at,
    failedAt: row.failed_at,
    finishedAt: row.finished_at,
    forfeitedAt: row.forfeited_at,
    lastSeenAt: row.last_seen_at,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapGuessRow(row: any): LiveMatchGuess {
  return {
    id: row.id,
    matchId: row.match_id,
    matchPlayerId: row.match_player_id,
    playerId: row.player_id,
    guessIndex: row.guess_index,
    guess: row.guess,
    isValid: row.is_valid,
    validationError: row.validation_error,
    evaluation: row.evaluation ?? [],
    submittedAt: row.submitted_at,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
  };
}

function sanitizeMatch(
  match: LiveMatch,
  canViewSolution: boolean,
): LiveMatchStateMatch {
  if (canViewSolution) return match;

  return {
    ...match,
    solution: null,
    solutionHash: null,
    solutionSaltId: null,
  };
}

async function loadTournamentCreatorId(tournamentId: string | null | undefined) {
  if (!tournamentId) return null;

  const { data, error } = await db
    .from('_live_tournaments')
    .select('created_by_player_id')
    .eq('id', tournamentId)
    .maybeSingle();

  if (error) {
    console.error('[live.state] tournament lookup error', error);
    throw new LiveStateError(
      'LIVE_STATE_DATABASE_FAILURE',
      'Unable to load Live tournament.',
    );
  }

  return data?.created_by_player_id ?? null;
}

async function loadMatch(matchId: string): Promise<LiveMatch> {
  const { data, error } = await db
    .from('_live_matches')
    .select(matchSelect())
    .eq('id', matchId)
    .maybeSingle();

  if (error) {
    console.error('[live.state] match lookup error', error);
    throw new LiveStateError(
      'LIVE_STATE_DATABASE_FAILURE',
      'Unable to load Live match.',
    );
  }

  if (!data) {
    throw new LiveStateError(
      'LIVE_STATE_MATCH_NOT_FOUND',
      'Live match not found.',
    );
  }

  return mapMatchRow(data);
}

async function loadMatchPlayers(matchId: string): Promise<LiveMatchPlayer[]> {
  const { data, error } = await db
    .from('_live_match_players')
    .select(matchPlayerSelect())
    .eq('match_id', matchId)
    .order('seat', { ascending: true });

  if (error) {
    console.error('[live.state] match players lookup error', error);
    throw new LiveStateError(
      'LIVE_STATE_DATABASE_FAILURE',
      'Unable to load Live match players.',
    );
  }

  return (data ?? []).map(mapMatchPlayerRow);
}

async function loadVisibleGuesses({
  matchId,
  playerId,
  canViewAllGuesses,
}: {
  matchId: string;
  playerId: string;
  canViewAllGuesses: boolean;
}): Promise<LiveMatchGuess[]> {
  let query = db
    .from('_live_match_guesses')
    .select(matchGuessSelect())
    .eq('match_id', matchId)
    .order('player_id', { ascending: true })
    .order('guess_index', { ascending: true });

  if (!canViewAllGuesses) {
    query = query.eq('player_id', playerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[live.state] guesses lookup error', error);
    throw new LiveStateError(
      'LIVE_STATE_DATABASE_FAILURE',
      'Unable to load Live match guesses.',
    );
  }

  return (data ?? []).map(mapGuessRow);
}

export async function getMatchState(
  input: GetMatchStateInput,
): Promise<LiveMatchState> {
  const matchId = assertRequiredId(input?.matchId, 'matchId');
  const playerId = assertRequiredId(input?.playerId, 'playerId');

  const match = await loadMatch(matchId);
  const players = await loadMatchPlayers(matchId);
  const isParticipant = players.some((player) => player.playerId === playerId);
  const tournamentCreatorId = await loadTournamentCreatorId(match.tournamentId);
  const isTournamentCreator = tournamentCreatorId === playerId;

  if (!isParticipant && !isTournamentCreator) {
    throw new LiveStateError(
      'LIVE_STATE_FORBIDDEN',
      'Player cannot view this Live match.',
    );
  }

  const canViewSolution = match.status === 'COMPLETED';
  const canViewAllGuesses = isTournamentCreator || canViewSolution;
  const guesses = await loadVisibleGuesses({
    matchId,
    playerId,
    canViewAllGuesses,
  });

  return {
    match: sanitizeMatch(match, canViewSolution),
    players,
    guesses,
    viewer: {
      playerId,
      isParticipant,
      isTournamentCreator,
      canViewAllGuesses,
      canViewSolution,
    },
  };
}
