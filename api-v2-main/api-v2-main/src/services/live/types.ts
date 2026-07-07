import type {
  LIVE_ENTRANT_STATUSES,
  LIVE_MATCH_PLAYER_STATUSES,
  LIVE_MATCH_RESULTS,
  LIVE_MATCH_STATUSES,
  LIVE_MATCH_TYPES,
  LIVE_OVERLAY_TOKEN_STATUSES,
  LIVE_TOURNAMENT_BEST_OF_VALUES,
  LIVE_TOURNAMENT_STATUSES,
  LIVE_TOURNAMENT_VISIBILITIES,
  LIVE_WINNER_REASONS,
} from './constants.js';

export type LiveId = string;
export type LivePlayerId = string;
export type LiveTimestamp = string;
export type LiveJson = Record<string, unknown>;

export type LiveTournamentStatus = typeof LIVE_TOURNAMENT_STATUSES[number];
export type LiveTournamentVisibility = typeof LIVE_TOURNAMENT_VISIBILITIES[number];
export type LiveTournamentBestOf = typeof LIVE_TOURNAMENT_BEST_OF_VALUES[number];
export type LiveEntrantStatus = typeof LIVE_ENTRANT_STATUSES[number];
export type LiveMatchStatus = typeof LIVE_MATCH_STATUSES[number];
export type LiveMatchType = typeof LIVE_MATCH_TYPES[number];
export type LiveWinnerReason = typeof LIVE_WINNER_REASONS[number];
export type LiveMatchPlayerStatus = typeof LIVE_MATCH_PLAYER_STATUSES[number];
export type LiveMatchResult = typeof LIVE_MATCH_RESULTS[number];
export type LiveOverlayTokenStatus = typeof LIVE_OVERLAY_TOKEN_STATUSES[number];

export type LiveLetterStatus = 'correct' | 'present' | 'absent';

export interface LiveTournament {
  id: LiveId;
  name: string;
  joinCode: string;
  status: LiveTournamentStatus;
  visibility: LiveTournamentVisibility;
  createdByPlayerId: LivePlayerId;
  startsAt?: LiveTimestamp | null;
  endsAt?: LiveTimestamp | null;
  maxEntrants?: number | null;
  bestOf: LiveTournamentBestOf;
  config: LiveJson;
  metadata: LiveJson;
  createdAt: LiveTimestamp;
  updatedAt: LiveTimestamp;
}

export interface LiveTournamentEntrant {
  id: LiveId;
  tournamentId: LiveId;
  playerId: LivePlayerId;
  displayNameSnapshot: string;
  status: LiveEntrantStatus;
  seed?: number | null;
  score: number;
  metadata: LiveJson;
  joinedAt: LiveTimestamp;
  checkedInAt?: LiveTimestamp | null;
  eliminatedAt?: LiveTimestamp | null;
  createdAt: LiveTimestamp;
  updatedAt: LiveTimestamp;
}

export interface LiveMatch {
  id: LiveId;
  tournamentId?: LiveId | null;
  status: LiveMatchStatus;
  matchType: LiveMatchType;
  wordPack: string;
  wordLength: number;
  maxAttempts: number;
  winnerPlayerId?: LivePlayerId | null;
  winnerReason?: LiveWinnerReason | null;
  roundNumber?: number | null;
  matchNumber: number;
  scheduledAt?: LiveTimestamp | null;
  startedAt?: LiveTimestamp | null;
  endedAt?: LiveTimestamp | null;
  solution: string;
  solutionHash?: string | null;
  solutionSaltId?: string | null;
  config: LiveJson;
  metadata: LiveJson;
  createdAt: LiveTimestamp;
  updatedAt: LiveTimestamp;
}

export interface LiveMatchPlayer {
  id: LiveId;
  matchId: LiveId;
  playerId: LivePlayerId;
  tournamentEntrantId?: LiveId | null;
  seat: number;
  status: LiveMatchPlayerStatus;
  score: number;
  guessCount: number;
  result?: LiveMatchResult | null;
  joinedAt: LiveTimestamp;
  readyAt?: LiveTimestamp | null;
  solvedAt?: LiveTimestamp | null;
  failedAt?: LiveTimestamp | null;
  finishedAt?: LiveTimestamp | null;
  forfeitedAt?: LiveTimestamp | null;
  lastSeenAt?: LiveTimestamp | null;
  metadata: LiveJson;
  createdAt: LiveTimestamp;
  updatedAt: LiveTimestamp;
}

export interface LiveGuessEvaluationCell {
  letter: string;
  status: LiveLetterStatus;
}

export interface LiveMatchGuess {
  id: LiveId;
  matchId: LiveId;
  matchPlayerId: LiveId;
  playerId: LivePlayerId;
  guessIndex: number;
  guess: string;
  isValid: boolean;
  validationError?: string | null;
  evaluation: LiveGuessEvaluationCell[];
  submittedAt: LiveTimestamp;
  metadata: LiveJson;
  createdAt: LiveTimestamp;
}

export interface LiveOverlayToken {
  id: LiveId;
  playerId: LivePlayerId;
  tournamentId?: LiveId | null;
  matchId?: LiveId | null;
  tokenHash: string;
  label?: string | null;
  scopes: string[];
  status: LiveOverlayTokenStatus;
  expiresAt?: LiveTimestamp | null;
  revokedAt?: LiveTimestamp | null;
  lastUsedAt?: LiveTimestamp | null;
  metadata: LiveJson;
  createdAt: LiveTimestamp;
  updatedAt: LiveTimestamp;
}

export interface CreateTournamentInput {
  name: string;
  createdByPlayerId: LivePlayerId;
  visibility?: LiveTournamentVisibility;
  bestOf?: LiveTournamentBestOf;
  config?: LiveJson;
  metadata?: LiveJson;
}

export interface UpdateTournamentInput {
  tournamentId: LiveId;
  name?: string;
  visibility?: LiveTournamentVisibility;
  startsAt?: LiveTimestamp | null;
  endsAt?: LiveTimestamp | null;
  maxEntrants?: number | null;
  bestOf?: LiveTournamentBestOf;
  config?: LiveJson;
  metadata?: LiveJson;
}

export interface TournamentStatusInput {
  tournamentId: LiveId;
  playerId?: LivePlayerId;
}

export interface JoinTournamentInput {
  tournamentId: LiveId;
  playerId: LivePlayerId;
  metadata?: LiveJson;
}

export interface LeaveTournamentInput {
  tournamentId: LiveId;
  playerId: LivePlayerId;
}

export interface ReadyPlayerInput {
  tournamentId: LiveId;
  playerId: LivePlayerId;
}

export interface CheckEligibilityInput {
  tournamentId: LiveId;
  playerId: LivePlayerId;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export interface CreateMatchInput {
  tournamentId: LiveId;
  requestedByPlayerId: LivePlayerId;
  wordPack: string;
  wordLength?: number;
  maxAttempts?: number;
  roundNumber: number;
  matchNumber: number;
  playerIds: LivePlayerId[];
  solution: string;
  solutionHash?: string | null;
  solutionSaltId?: string | null;
  scheduledAt?: LiveTimestamp | null;
  config?: LiveJson;
  metadata?: LiveJson;
}

export interface StartMatchInput {
  matchId: LiveId;
  requestedByPlayerId: LivePlayerId;
}

export interface CancelMatchInput {
  matchId: LiveId;
  requestedByPlayerId: LivePlayerId;
}

export interface FinishMatchInput {
  matchId: LiveId;
  requestedByPlayerId: LivePlayerId;
  winnerPlayerId?: LivePlayerId | null;
  winnerReason?: LiveWinnerReason | null;
}

export interface DetermineWinnerInput {
  matchId: LiveId;
}

export interface ForfeitPlayerInput {
  matchId: LiveId;
  playerId: LivePlayerId;
  requestedByPlayerId: LivePlayerId;
}

export interface ValidateGuessInput {
  matchId: LiveId;
  playerId: LivePlayerId;
  guess: string;
}

export interface ValidateGuessResult {
  valid: boolean;
  error?: string;
}

export interface EvaluateGuessInput {
  guess: string;
  solution: string;
}

export interface CalculateWinnerInput {
  match: LiveMatch;
  players: LiveMatchPlayer[];
  guesses: LiveMatchGuess[];
}

export interface DetermineMatchResultInput {
  match: LiveMatch;
  players: LiveMatchPlayer[];
  guesses: LiveMatchGuess[];
}

export interface MatchResultDecision {
  winnerPlayerId?: LivePlayerId | null;
  winnerReason?: LiveWinnerReason | null;
  playerResults: Array<{
    playerId: LivePlayerId;
    result: LiveMatchResult;
  }>;
}

export interface GenerateBracketInput {
  tournamentId: LiveId;
  entrants: LiveTournamentEntrant[];
  bestOf: LiveTournamentBestOf;
}

export interface LiveBracketMatchSeed {
  roundNumber: number;
  matchNumber: number;
  playerIds: LivePlayerId[];
}

export interface LiveBracket {
  tournamentId: LiveId;
  matches: LiveBracketMatchSeed[];
}

export interface AdvanceWinnerInput {
  tournamentId: LiveId;
  matchId: LiveId;
  winnerPlayerId: LivePlayerId;
}

export interface GetNextMatchInput {
  tournamentId: LiveId;
  playerId?: LivePlayerId;
  roundNumber?: number;
  matchNumber?: number;
}

export interface CreateOverlayTokenInput {
  playerId: LivePlayerId;
  tokenHash: string;
  tournamentId?: LiveId | null;
  matchId?: LiveId | null;
  label?: string | null;
  scopes?: string[];
  expiresAt?: LiveTimestamp | null;
  metadata?: LiveJson;
}

export interface RevokeOverlayTokenInput {
  tokenId: LiveId;
  revokedByPlayerId?: LivePlayerId;
}

export interface ValidateOverlayTokenInput {
  tokenHash: string;
  requiredScopes?: string[];
}

export interface OverlayTokenValidationResult {
  valid: boolean;
  token?: LiveOverlayToken;
  error?: string;
}

export interface GetOverlayStateInput {
  tokenHash: string;
  tournamentId?: LiveId;
  matchId?: LiveId;
}

export interface LiveOverlayState {
  tournament?: LiveTournament;
  entrants?: LiveTournamentEntrant[];
  match?: LiveMatch;
  players?: LiveMatchPlayer[];
  guesses?: LiveMatchGuess[];
}
