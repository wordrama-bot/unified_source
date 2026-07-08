import { db } from '../../models/index.js';
import CUSTOM from '../../utils/wordPacks/CUSTOM/index.js';
import EIGHT_LETTER from '../../utils/wordPacks/EIGHT_LETTER/index.js';
import EIGHTEEN_LETTER from '../../utils/wordPacks/EIGHTEEN_LETTER/index.js';
import ELEVEN_LETTER from '../../utils/wordPacks/ELEVEN_LETTER/index.js';
import ELEVEN_LETTER_EXTENDED from '../../utils/wordPacks/ELEVEN_LETTER_EXTENDED/index.js';
import FIFTEEN_LETTER from '../../utils/wordPacks/FIFTEEN_LETTER/index.js';
import FIVE_LETTER from '../../utils/wordPacks/FIVE_LETTER/index.js';
import FIVE_LETTER_CRAZY from '../../utils/wordPacks/FIVE_LETTER_CRAZY/index.js';
import FOUR_LETTER from '../../utils/wordPacks/FOUR_LETTER/index.js';
import FOURTEEN_LETTER from '../../utils/wordPacks/FOURTEEN_LETTER/index.js';
import NINE_LETTER from '../../utils/wordPacks/NINE_LETTER/index.js';
import NINETEEN_LETTER from '../../utils/wordPacks/NINETEEN_LETTER/index.js';
import SEVEN_LETTER from '../../utils/wordPacks/SEVEN_LETTER/index.js';
import SEVENTEEN_LETTER from '../../utils/wordPacks/SEVENTEEN_LETTER/index.js';
import SIX_LETTER from '../../utils/wordPacks/SIX_LETTER/index.js';
import SIXTEEN_LETTER from '../../utils/wordPacks/SIXTEEN_LETTER/index.js';
import TEN_LETTER from '../../utils/wordPacks/TEN_LETTER/index.js';
import THIRTEEN_LETTER from '../../utils/wordPacks/THIRTEEN_LETTER/index.js';
import TWELVE_LETTER from '../../utils/wordPacks/TWELVE_LETTER/index.js';
import TWENTY_LETTER from '../../utils/wordPacks/TWENTY_LETTER/index.js';
import TWENTYONE_LETTER from '../../utils/wordPacks/TWENTYONE_LETTER/index.js';
import TWENTYTHREE_LETTER from '../../utils/wordPacks/TWENTYTHREE_LETTER/index.js';
import TWENTYTWO_LETTER from '../../utils/wordPacks/TWENTYTWO_LETTER/index.js';
import type {
  DetermineMatchResultInput,
  EvaluateGuessInput,
  LiveGuessEvaluationCell,
  LiveGuessResult,
  LiveJson,
  LiveMatch,
  LiveMatchGuess,
  LiveMatchPlayer,
  LiveMatchResult,
  LivePlayerId,
  MatchResultDecision,
  SubmitGuessInput,
  ValidateGuessInput,
  ValidateGuessResult,
} from './types.js';

export const LIVE_WORDLE_DEFAULT_MAX_ATTEMPTS = 6;

export type LiveWordleCharStatus = 'absent' | 'present' | 'correct';

export type LivePlayerTerminalState = {
  isSolved: boolean;
  isFailed: boolean;
  isTerminal: boolean;
  guessCount: number;
};

type WordPack = {
  WORD_LIST?: string[];
  VALID_GUESSES?: string[];
  wordList?: string[];
  validGuesses?: string[];
};

type ApplyGuessResultRow = {
  match_id: string;
  match_tournament_id: string | null;
  match_status: LiveMatch['status'];
  match_type: LiveMatch['matchType'];
  match_word_pack: string;
  match_word_length: number;
  match_max_attempts: number;
  match_winner_player_id: string | null;
  match_winner_reason: LiveMatch['winnerReason'];
  match_round_number: number | null;
  match_match_number: number;
  match_scheduled_at: string | null;
  match_started_at: string | null;
  match_ended_at: string | null;
  match_solution: string;
  match_solution_hash: string | null;
  match_solution_salt_id: string | null;
  match_config: LiveJson;
  match_metadata: LiveJson;
  match_created_at: string;
  match_updated_at: string;
  player_id: string;
  match_player_id: string;
  match_player_tournament_entrant_id: string | null;
  match_player_seat: number;
  match_player_status: LiveMatchPlayer['status'];
  match_player_score: number;
  match_player_guess_count: number;
  match_player_result: LiveMatchPlayer['result'];
  match_player_joined_at: string;
  match_player_ready_at: string | null;
  match_player_solved_at: string | null;
  match_player_failed_at: string | null;
  match_player_finished_at: string | null;
  match_player_forfeited_at: string | null;
  match_player_last_seen_at: string | null;
  match_player_metadata: LiveJson;
  match_player_created_at: string;
  match_player_updated_at: string;
  guess_id: string;
  guess_index: number;
  guess_text: string;
  guess_is_valid: boolean;
  guess_validation_error: string | null;
  guess_evaluation: LiveGuessEvaluationCell[];
  guess_submitted_at: string;
  guess_metadata: LiveJson;
  guess_created_at: string;
};

type ImmutableGuessResult = Readonly<{
  matchId: string;
  playerId: string;
  guess: string;
  evaluation: LiveGuessEvaluationCell[];
  isSolved: boolean;
  isFailed: boolean;
  submittedAt: string;
  metadata: LiveJson;
}>;

const WORD_PACKS: Record<string, WordPack> = {
  CUSTOM,
  EIGHT_LETTER,
  EIGHTEEN_LETTER,
  ELEVEN_LETTER,
  ELEVEN_LETTER_EXTENDED,
  FIFTEEN_LETTER,
  FIVE_LETTER,
  FIVE_LETTER_CRAZY,
  FOUR_LETTER,
  FOURTEEN_LETTER,
  NINE_LETTER,
  NINETEEN_LETTER,
  SEVEN_LETTER,
  SEVENTEEN_LETTER,
  SIX_LETTER,
  SIXTEEN_LETTER,
  TEN_LETTER,
  THIRTEEN_LETTER,
  TWELVE_LETTER,
  TWENTY_LETTER,
  TWENTYONE_LETTER,
  TWENTYTHREE_LETTER,
  TWENTYTWO_LETTER,
};

export type LiveEngineErrorCode =
  | 'LIVE_ENGINE_INVALID_INPUT'
  | 'LIVE_ENGINE_MATCH_NOT_FOUND'
  | 'LIVE_ENGINE_PLAYER_NOT_FOUND'
  | 'LIVE_ENGINE_INVALID_MATCH_STATE'
  | 'LIVE_ENGINE_INVALID_PLAYER_STATE'
  | 'LIVE_ENGINE_NO_ATTEMPTS_REMAINING'
  | 'LIVE_ENGINE_STALE_GUESS_RESULT'
  | 'LIVE_ENGINE_WORD_PACK_NOT_FOUND'
  | 'LIVE_ENGINE_INVALID_GUESS_LENGTH'
  | 'LIVE_ENGINE_WORD_NOT_ALLOWED'
  | 'LIVE_ENGINE_DATABASE_FAILURE';

export class LiveEngineError extends Error {
  code: LiveEngineErrorCode;

  constructor(code: LiveEngineErrorCode, message: string) {
    super(message);
    this.name = 'LiveEngineError';
    this.code = code;
  }
}

export interface EngineService {
  submitGuess(input: SubmitGuessInput): Promise<LiveGuessResult>;
  validateGuess(input: ValidateGuessInput): Promise<ValidateGuessResult>;
  evaluateGuess(input: EvaluateGuessInput): Promise<LiveGuessEvaluationCell[]>;
  determineMatchResult(input: DetermineMatchResultInput): Promise<MatchResultDecision>;
}

export function normalizeGuess(guess: string): string {
  return guess.trim().toUpperCase();
}

export function unicodeSplit(word: string = ''): string[] {
  return Array.from(word);
}

export function unicodeLength(word: string): number {
  return unicodeSplit(word).length;
}

export function isGuessLengthValid(
  guess: string,
  solutionOrLength: string | number,
): boolean {
  const requiredLength =
    typeof solutionOrLength === 'number'
      ? solutionOrLength
      : unicodeLength(solutionOrLength);

  return unicodeLength(guess) === requiredLength;
}

export function getGuessStatuses(
  solution: string,
  guess: string,
): LiveWordleCharStatus[] {
  const splitSolution = unicodeSplit(normalizeGuess(solution));
  const splitGuess = unicodeSplit(normalizeGuess(guess));
  const solutionCharsTaken = splitSolution.map(() => false);
  const statuses: LiveWordleCharStatus[] = Array.from(Array(splitGuess.length));

  splitGuess.forEach((letter, index) => {
    if (letter === splitSolution[index]) {
      statuses[index] = 'correct';
      solutionCharsTaken[index] = true;
    }
  });

  splitGuess.forEach((letter, index) => {
    if (statuses[index]) return;

    if (!splitSolution.includes(letter)) {
      statuses[index] = 'absent';
      return;
    }

    const indexOfPresentChar = splitSolution.findIndex(
      (solutionLetter, solutionIndex) =>
        solutionLetter === letter && !solutionCharsTaken[solutionIndex],
    );

    if (indexOfPresentChar > -1) {
      statuses[index] = 'present';
      solutionCharsTaken[indexOfPresentChar] = true;
      return;
    }

    statuses[index] = 'absent';
  });

  return statuses;
}

export function evaluateGuess(
  input: EvaluateGuessInput,
): LiveGuessEvaluationCell[] {
  const normalizedGuess = normalizeGuess(input.guess);
  const statuses = getGuessStatuses(input.solution, normalizedGuess);
  const letters = unicodeSplit(normalizedGuess);

  return letters.map((letter, index) => ({
    letter,
    status: statuses[index],
  }));
}

export function isWinningGuess(solution: string, guess: string): boolean {
  return normalizeGuess(solution) === normalizeGuess(guess);
}

export function hasAttemptsRemaining(
  guessCount: number,
  maxAttempts: number = LIVE_WORDLE_DEFAULT_MAX_ATTEMPTS,
): boolean {
  return guessCount < maxAttempts;
}

export function getPlayerTerminalStateAfterGuess({
  solution,
  guess,
  previousGuessCount,
  maxAttempts = LIVE_WORDLE_DEFAULT_MAX_ATTEMPTS,
}: {
  solution: string;
  guess: string;
  previousGuessCount: number;
  maxAttempts?: number;
}): LivePlayerTerminalState {
  const guessCount = previousGuessCount + 1;
  const isSolved = isWinningGuess(solution, guess);
  const isFailed = !isSolved && guessCount >= maxAttempts;

  return {
    isSolved,
    isFailed,
    isTerminal: isSolved || isFailed,
    guessCount,
  };
}

export function validateGuess(input: ValidateGuessInput): ValidateGuessResult {
  const guess = normalizeGuess(input.guess ?? '');

  if (!guess) {
    return {
      valid: false,
      error: 'Guess is required.',
    };
  }

  return {
    valid: true,
  };
}

function assertRequiredId(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new LiveEngineError(
      'LIVE_ENGINE_INVALID_INPUT',
      `${fieldName} is required.`,
    );
  }

  return value.trim();
}

function assertLiveJson(value: LiveJson | undefined, fieldName: string) {
  if (value === undefined) return;

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new LiveEngineError(
      'LIVE_ENGINE_INVALID_INPUT',
      `${fieldName} must be an object.`,
    );
  }
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

function mapApplyGuessResultRow(row: ApplyGuessResultRow): LiveGuessResult {
  const match: LiveMatch = {
    id: row.match_id,
    tournamentId: row.match_tournament_id,
    status: row.match_status,
    matchType: row.match_type,
    wordPack: row.match_word_pack,
    wordLength: row.match_word_length,
    maxAttempts: row.match_max_attempts,
    winnerPlayerId: row.match_winner_player_id,
    winnerReason: row.match_winner_reason,
    roundNumber: row.match_round_number,
    matchNumber: row.match_match_number,
    scheduledAt: row.match_scheduled_at,
    startedAt: row.match_started_at,
    endedAt: row.match_ended_at,
    solution: row.match_solution,
    solutionHash: row.match_solution_hash,
    solutionSaltId: row.match_solution_salt_id,
    config: row.match_config ?? {},
    metadata: row.match_metadata ?? {},
    createdAt: row.match_created_at,
    updatedAt: row.match_updated_at,
  };
  const player: LiveMatchPlayer = {
    id: row.match_player_id,
    matchId: row.match_id,
    playerId: row.player_id,
    tournamentEntrantId: row.match_player_tournament_entrant_id,
    seat: row.match_player_seat,
    status: row.match_player_status,
    score: row.match_player_score,
    guessCount: row.match_player_guess_count,
    result: row.match_player_result,
    joinedAt: row.match_player_joined_at,
    readyAt: row.match_player_ready_at,
    solvedAt: row.match_player_solved_at,
    failedAt: row.match_player_failed_at,
    finishedAt: row.match_player_finished_at,
    forfeitedAt: row.match_player_forfeited_at,
    lastSeenAt: row.match_player_last_seen_at,
    metadata: row.match_player_metadata ?? {},
    createdAt: row.match_player_created_at,
    updatedAt: row.match_player_updated_at,
  };
  const guess: LiveMatchGuess = {
    id: row.guess_id,
    matchId: row.match_id,
    matchPlayerId: row.match_player_id,
    playerId: row.player_id,
    guessIndex: row.guess_index,
    guess: row.guess_text,
    isValid: row.guess_is_valid,
    validationError: row.guess_validation_error,
    evaluation: row.guess_evaluation ?? [],
    submittedAt: row.guess_submitted_at,
    metadata: row.guess_metadata ?? {},
    createdAt: row.guess_created_at,
  };

  return {
    match,
    player,
    guess,
    matchResult: match.status === 'COMPLETED'
      ? {
          winnerPlayerId: match.winnerPlayerId,
          winnerReason: match.winnerReason,
          playerResults: player.result
            ? [{ playerId: player.playerId, result: player.result }]
            : [],
        }
      : null,
  };
}

async function loadMatch(matchId: string): Promise<LiveMatch> {
  const { data, error } = await db
    .from('_live_matches')
    .select(matchSelect())
    .eq('id', matchId)
    .maybeSingle();

  if (error) {
    console.error('[live.engine] match lookup error', error);
    throw new LiveEngineError(
      'LIVE_ENGINE_DATABASE_FAILURE',
      'Unable to load Live match.',
    );
  }

  if (!data) {
    throw new LiveEngineError(
      'LIVE_ENGINE_MATCH_NOT_FOUND',
      'Live match not found.',
    );
  }

  return mapMatchRow(data);
}

async function loadSubmittingPlayer(
  matchId: string,
  playerId: string,
): Promise<LiveMatchPlayer> {
  const { data, error } = await db
    .from('_live_match_players')
    .select(matchPlayerSelect())
    .eq('match_id', matchId)
    .eq('player_id', playerId)
    .maybeSingle();

  if (error) {
    console.error('[live.engine] match player lookup error', error);
    throw new LiveEngineError(
      'LIVE_ENGINE_DATABASE_FAILURE',
      'Unable to load Live match player.',
    );
  }

  if (!data) {
    throw new LiveEngineError(
      'LIVE_ENGINE_PLAYER_NOT_FOUND',
      'Live match player not found.',
    );
  }

  return mapMatchPlayerRow(data);
}

async function loadWordPack(wordPackName: string): Promise<WordPack> {
  const normalizedWordPack = normalizeGuess(wordPackName);
  const wordPack = WORD_PACKS[normalizedWordPack];

  if (!wordPack) {
    throw new LiveEngineError(
      'LIVE_ENGINE_WORD_PACK_NOT_FOUND',
      'Live word pack not found.',
    );
  }

  return wordPack;
}

function assertGuessAllowed(
  guess: string,
  match: LiveMatch,
  player: LiveMatchPlayer,
  wordPack: WordPack,
) {
  if (match.status !== 'IN_PROGRESS') {
    throw new LiveEngineError(
      'LIVE_ENGINE_INVALID_MATCH_STATE',
      'Live match is not accepting guesses.',
    );
  }

  if (player.status !== 'PLAYING') {
    throw new LiveEngineError(
      'LIVE_ENGINE_INVALID_PLAYER_STATE',
      'Live match player is not accepting guesses.',
    );
  }

  if (!hasAttemptsRemaining(player.guessCount, match.maxAttempts)) {
    throw new LiveEngineError(
      'LIVE_ENGINE_NO_ATTEMPTS_REMAINING',
      'No attempts remain for this Live match player.',
    );
  }

  if (!isGuessLengthValid(guess, match.wordLength)) {
    throw new LiveEngineError(
      'LIVE_ENGINE_INVALID_GUESS_LENGTH',
      'Guess length is invalid for this Live match.',
    );
  }

  const validGuesses = new Set([
    ...(wordPack.validGuesses ?? []),
    ...(wordPack.VALID_GUESSES ?? []),
    ...(wordPack.wordList ?? []),
    ...(wordPack.WORD_LIST ?? []),
  ].map((word) => word.toLowerCase()));

  if (!validGuesses.has(guess.toLowerCase())) {
    throw new LiveEngineError(
      'LIVE_ENGINE_WORD_NOT_ALLOWED',
      'Guess is not in the Live word list.',
    );
  }
}

function buildGuessResult({
  match,
  player,
  guess,
  metadata,
}: {
  match: LiveMatch;
  player: LiveMatchPlayer;
  guess: string;
  metadata: LiveJson;
}): ImmutableGuessResult {
  const terminalState = getPlayerTerminalStateAfterGuess({
    solution: match.solution,
    guess,
    previousGuessCount: player.guessCount,
    maxAttempts: match.maxAttempts,
  });

  return Object.freeze({
    matchId: match.id,
    playerId: player.playerId,
    guess,
    evaluation: evaluateGuess({
      solution: match.solution,
      guess,
    }),
    isSolved: terminalState.isSolved,
    isFailed: terminalState.isFailed,
    submittedAt: new Date().toISOString(),
    metadata: { ...metadata },
  });
}

function throwApplyGuessRpcError(error: { message?: string }): never {
  const message = error.message ?? '';

  if (message.includes('LIVE_GUESS_MATCH_NOT_FOUND')) {
    throw new LiveEngineError(
      'LIVE_ENGINE_MATCH_NOT_FOUND',
      'Live match not found.',
    );
  }

  if (message.includes('LIVE_GUESS_PLAYER_NOT_FOUND')) {
    throw new LiveEngineError(
      'LIVE_ENGINE_PLAYER_NOT_FOUND',
      'Live match player not found.',
    );
  }

  if (message.includes('LIVE_GUESS_INVALID_MATCH_STATE')) {
    throw new LiveEngineError(
      'LIVE_ENGINE_INVALID_MATCH_STATE',
      'Live match is not accepting guesses.',
    );
  }

  if (message.includes('LIVE_GUESS_INVALID_PLAYER_STATE')) {
    throw new LiveEngineError(
      'LIVE_ENGINE_INVALID_PLAYER_STATE',
      'Live match player is not accepting guesses.',
    );
  }

  if (message.includes('LIVE_GUESS_NO_ATTEMPTS_REMAINING')) {
    throw new LiveEngineError(
      'LIVE_ENGINE_NO_ATTEMPTS_REMAINING',
      'No attempts remain for this Live match player.',
    );
  }

  if (message.includes('LIVE_GUESS_STALE_RESULT')) {
    throw new LiveEngineError(
      'LIVE_ENGINE_STALE_GUESS_RESULT',
      'Live guess state changed before the guess could be applied.',
    );
  }

  if (message.includes('LIVE_GUESS_INVALID_INPUT')) {
    throw new LiveEngineError(
      'LIVE_ENGINE_INVALID_INPUT',
      'Live guess request is invalid.',
    );
  }

  console.error('[live.engine] apply guess RPC error', error);
  throw new LiveEngineError(
    'LIVE_ENGINE_DATABASE_FAILURE',
    'Unable to apply Live guess.',
  );
}

function elapsedFromMatchStart(
  matchStartedAt: string | null | undefined,
  playerSolvedAt: string | null | undefined,
): number | null {
  if (!matchStartedAt || !playerSolvedAt) return null;

  const startedAt = Date.parse(matchStartedAt);
  const solvedAt = Date.parse(playerSolvedAt);

  if (Number.isNaN(startedAt) || Number.isNaN(solvedAt)) return null;

  return solvedAt - startedAt;
}

function getPlayerResult(
  player: LiveMatchPlayer,
  winnerPlayerId: LivePlayerId | null,
  isDraw: boolean,
): LiveMatchResult {
  if (player.status === 'FORFEITED') return 'FORFEIT';
  if (isDraw) return 'DRAW';
  if (winnerPlayerId && player.playerId === winnerPlayerId) return 'WIN';
  return 'LOSS';
}

export function determineMatchResult(
  input: DetermineMatchResultInput,
): MatchResultDecision {
  const players = input.players.filter(
    (player) => player.status !== 'DISCONNECTED',
  );

  if (players.length === 0) {
    return {
      winnerPlayerId: null,
      winnerReason: null,
      playerResults: [],
    };
  }

  const solvedPlayers = players.filter((player) => Boolean(player.solvedAt));
  const failedPlayers = players.filter((player) => Boolean(player.failedAt));
  const forfeitedPlayers = players.filter(
    (player) => player.status === 'FORFEITED',
  );
  const terminalPlayers = players.filter(
    (player) =>
      Boolean(player.solvedAt) ||
      Boolean(player.failedAt) ||
      player.status === 'FORFEITED' ||
      player.status === 'FINISHED',
  );

  if (terminalPlayers.length < players.length) {
    return {
      winnerPlayerId: null,
      winnerReason: null,
      playerResults: [],
    };
  }

  let winnerPlayerId: LivePlayerId | null = null;
  let winnerReason: MatchResultDecision['winnerReason'] = 'NO_WINNER';

  if (forfeitedPlayers.length === 1 && players.length === 2) {
    const winner = players.find(
      (player) => player.playerId !== forfeitedPlayers[0].playerId,
    );

    winnerPlayerId = winner?.playerId ?? null;
    winnerReason = winnerPlayerId ? 'OPPONENT_FORFEITED' : 'NO_WINNER';
  } else if (solvedPlayers.length === 1 && failedPlayers.length > 0) {
    winnerPlayerId = solvedPlayers[0].playerId;
    winnerReason = 'OPPONENT_FAILED';
  } else if (solvedPlayers.length > 1) {
    const sortedByGuesses = [...solvedPlayers].sort(
      (left, right) => left.guessCount - right.guessCount,
    );
    const fewestGuesses = sortedByGuesses[0].guessCount;
    const fewestGuessPlayers = sortedByGuesses.filter(
      (player) => player.guessCount === fewestGuesses,
    );

    if (fewestGuessPlayers.length === 1) {
      winnerPlayerId = fewestGuessPlayers[0].playerId;
      winnerReason = 'FEWEST_GUESSES';
    } else {
      const sortedByElapsed = [...fewestGuessPlayers].sort((left, right) => {
        const leftElapsed =
          elapsedFromMatchStart(input.match.startedAt, left.solvedAt) ??
          Number.POSITIVE_INFINITY;
        const rightElapsed =
          elapsedFromMatchStart(input.match.startedAt, right.solvedAt) ??
          Number.POSITIVE_INFINITY;

        return leftElapsed - rightElapsed;
      });
      const fastestElapsed = elapsedFromMatchStart(
        input.match.startedAt,
        sortedByElapsed[0].solvedAt,
      );
      const fastestPlayers = sortedByElapsed.filter(
        (player) =>
          elapsedFromMatchStart(input.match.startedAt, player.solvedAt) ===
          fastestElapsed,
      );

      if (fastestElapsed !== null && fastestPlayers.length === 1) {
        winnerPlayerId = fastestPlayers[0].playerId;
        winnerReason = 'FASTEST_SOLVE';
      }
    }
  }

  const isDraw = !winnerPlayerId;

  return {
    winnerPlayerId,
    winnerReason,
    playerResults: players.map((player) => ({
      playerId: player.playerId,
      result: getPlayerResult(player, winnerPlayerId, isDraw),
    })),
  };
}

export async function submitGuess(
  input: SubmitGuessInput,
): Promise<LiveGuessResult> {
  const matchId = assertRequiredId(input?.matchId, 'matchId');
  const playerId = assertRequiredId(input?.playerId, 'playerId');
  const guess = normalizeGuess(input?.guess ?? '');

  assertLiveJson(input?.metadata, 'metadata');

  const basicValidation = validateGuess({ matchId, playerId, guess });

  if (!basicValidation.valid) {
    throw new LiveEngineError(
      'LIVE_ENGINE_INVALID_INPUT',
      basicValidation.error ?? 'Live guess request is invalid.',
    );
  }

  const match = await loadMatch(matchId);
  const player = await loadSubmittingPlayer(matchId, playerId);
  const wordPack = await loadWordPack(match.wordPack);

  assertGuessAllowed(guess, match, player, wordPack);

  const guessResult = buildGuessResult({
    match,
    player,
    guess,
    metadata: input.metadata ?? {},
  });

  const { data, error } = await db.rpc('wordrama_live_apply_guess_result', {
    p_match_id: guessResult.matchId,
    p_player_id: guessResult.playerId,
    p_guess: guessResult.guess,
    p_evaluation: guessResult.evaluation,
    p_is_solved: guessResult.isSolved,
    p_is_failed: guessResult.isFailed,
    p_submitted_at: guessResult.submittedAt,
    p_metadata: guessResult.metadata,
  });

  if (error) {
    throwApplyGuessRpcError(error);
  }

  const row = Array.isArray(data) ? data[0] : data;

  if (!row) {
    console.error('[live.engine] apply guess RPC returned no row');
    throw new LiveEngineError(
      'LIVE_ENGINE_DATABASE_FAILURE',
      'Unable to apply Live guess.',
    );
  }

  return mapApplyGuessResultRow(row);
}

export const LIVE_WORDLE_ENGINE_FIXTURES = [
  {
    name: 'duplicate letters only mark available solution letters present',
    solution: 'APPLE',
    guess: 'ALLEY',
    statuses: ['correct', 'present', 'absent', 'present', 'absent'],
  },
  {
    name: 'extra duplicate letters become absent after exact matches are taken',
    solution: 'BANAL',
    guess: 'LLAMA',
    statuses: ['present', 'absent', 'present', 'absent', 'present'],
  },
  {
    name: 'all correct letters win',
    solution: 'CRANE',
    guess: 'CRANE',
    statuses: ['correct', 'correct', 'correct', 'correct', 'correct'],
  },
] as const;
