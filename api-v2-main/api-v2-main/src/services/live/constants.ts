export const LIVE_TOURNAMENT_STATUSES = [
  'DRAFT',
  'SCHEDULED',
  'REGISTRATION_OPEN',
  'REGISTRATION_CLOSED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
] as const;

export const LIVE_TOURNAMENT_VISIBILITIES = [
  'PRIVATE',
  'PUBLIC',
  'UNLISTED',
] as const;

export const LIVE_TOURNAMENT_BEST_OF_VALUES = [1, 3, 5] as const;

export const LIVE_ENTRANT_STATUSES = [
  'REGISTERED',
  'CHECKED_IN',
  'ACTIVE',
  'ELIMINATED',
  'WITHDRAWN',
  'DISQUALIFIED',
] as const;

export const LIVE_MATCH_STATUSES = [
  'PENDING',
  'READY',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'ABANDONED',
] as const;

export const LIVE_MATCH_TYPES = [
  'DUEL',
  'TOURNAMENT',
  'SHOWMATCH',
] as const;

export const LIVE_WINNER_REASONS = [
  'SOLVED_FIRST',
  'FEWEST_GUESSES',
  'FASTEST_SOLVE',
  'OPPONENT_FAILED',
  'OPPONENT_FORFEITED',
  'ADMIN_DECISION',
  'NO_WINNER',
] as const;

export const LIVE_MATCH_PLAYER_STATUSES = [
  'JOINED',
  'READY',
  'PLAYING',
  'FINISHED',
  'FORFEITED',
  'DISCONNECTED',
] as const;

export const LIVE_MATCH_RESULTS = [
  'WIN',
  'LOSS',
  'DRAW',
  'FORFEIT',
  'NO_CONTEST',
] as const;

export const LIVE_OVERLAY_TOKEN_STATUSES = [
  'ACTIVE',
  'REVOKED',
  'EXPIRED',
] as const;

export const LIVE_DEFAULT_WORD_LENGTH = 5;
export const LIVE_DEFAULT_MAX_ATTEMPTS = 6;
export const LIVE_DEFAULT_BEST_OF = 1;
