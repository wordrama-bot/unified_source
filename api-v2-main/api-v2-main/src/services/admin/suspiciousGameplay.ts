import { db } from '../../models';

export type SuspiciousGameplayFlag =
  | 'ONE_GUESS_24H'
  | 'ONE_GUESS_RATE'
  | 'TEN_PLUS_GAMES_60S'
  | 'CONSISTENT_SUB_10S';

export type SuspiciousGameplayRow = {
  playerId: string;
  username: string | null;
  displayName: string | null;
  email: string | null;
  discordId: string | null;

  totalGames: number;
  wins: number;
  oneGuessWins: number;
  oneGuessLast24h: number;
  oneGuessRate: number;
  avgGuesses: number | null;

  firstGame: string | null;
  lastGame: string | null;

  gamesLastHour: number;
  gamesLast24h: number;

  maxGamesInRolling60Seconds: number;
  rolling60SecondWindowsOverLimit: number;

  fastestSessionGames: number;
  fastestSessionMedianGapSeconds: number | null;
  fastestSessionSub10Rate: number | null;

  flags: SuspiciousGameplayFlag[];
};

type RawSuspiciousGameplayRow = {
  player_id: string;
  username: string | null;
  display_name: string | null;
  email: string | null;
  discord_id: string | null;

  total_games: number | string | null;
  wins: number | string | null;
  one_guess_wins: number | string | null;
  one_guess_last_24h: number | string | null;
  one_guess_rate: number | string | null;
  avg_guesses: number | string | null;

  first_game: string | null;
  last_game: string | null;

  games_last_hour: number | string | null;
  games_last_24h: number | string | null;

  max_games_in_rolling_60_seconds: number | string | null;
  rolling_60_second_windows_over_limit: number | string | null;

  fastest_session_games: number | string | null;
  fastest_session_median_gap_seconds: number | string | null;
  fastest_session_sub_10_rate: number | string | null;
};

const thresholds = {
  oneGuessLast24h: 3,
  oneGuessRatePercent: 5,
  oneGuessRateMinimumGames: 25,

  extremeRollingMinuteGames: 10,

  sub10SessionMinimumGames: 30,
  sub10SessionMedianGapSeconds: 10,
  sub10SessionRatePercent: 75,
} as const;

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getFlags(
  row: RawSuspiciousGameplayRow,
): SuspiciousGameplayFlag[] {
  const flags: SuspiciousGameplayFlag[] = [];

  const totalGames = toNumber(row.total_games);
  const oneGuessLast24h = toNumber(row.one_guess_last_24h);
  const oneGuessRate = toNumber(row.one_guess_rate);

  const maxGamesInRolling60Seconds = toNumber(
    row.max_games_in_rolling_60_seconds,
  );

  const fastestSessionGames = toNumber(
    row.fastest_session_games,
  );

  const fastestSessionMedianGapSeconds = toNullableNumber(
    row.fastest_session_median_gap_seconds,
  );

  const fastestSessionSub10Rate = toNullableNumber(
    row.fastest_session_sub_10_rate,
  );

  if (oneGuessLast24h >= thresholds.oneGuessLast24h) {
    flags.push('ONE_GUESS_24H');
  }

  if (
    totalGames >= thresholds.oneGuessRateMinimumGames &&
    oneGuessRate >= thresholds.oneGuessRatePercent
  ) {
    flags.push('ONE_GUESS_RATE');
  }

  if (
    maxGamesInRolling60Seconds >=
      thresholds.extremeRollingMinuteGames
  ) {
    flags.push('TEN_PLUS_GAMES_60S');
  }

  if (
    fastestSessionGames >= thresholds.sub10SessionMinimumGames &&
    fastestSessionMedianGapSeconds !== null &&
    fastestSessionMedianGapSeconds <=
      thresholds.sub10SessionMedianGapSeconds &&
    fastestSessionSub10Rate !== null &&
    fastestSessionSub10Rate >=
      thresholds.sub10SessionRatePercent
  ) {
    flags.push('CONSISTENT_SUB_10S');
  }

  return flags;
}

function mapRow(
  row: RawSuspiciousGameplayRow,
): SuspiciousGameplayRow {
  return {
    playerId: row.player_id,
    username: row.username,
    displayName: row.display_name,
    email: row.email,
    discordId: row.discord_id,

    totalGames: toNumber(row.total_games),
    wins: toNumber(row.wins),
    oneGuessWins: toNumber(row.one_guess_wins),
    oneGuessLast24h: toNumber(row.one_guess_last_24h),
    oneGuessRate: toNumber(row.one_guess_rate),
    avgGuesses: toNullableNumber(row.avg_guesses),

    firstGame: row.first_game,
    lastGame: row.last_game,

    gamesLastHour: toNumber(row.games_last_hour),
    gamesLast24h: toNumber(row.games_last_24h),

    maxGamesInRolling60Seconds: toNumber(
      row.max_games_in_rolling_60_seconds,
    ),

    rolling60SecondWindowsOverLimit: toNumber(
      row.rolling_60_second_windows_over_limit,
    ),

    fastestSessionGames: toNumber(
      row.fastest_session_games,
    ),

    fastestSessionMedianGapSeconds: toNullableNumber(
      row.fastest_session_median_gap_seconds,
    ),

    fastestSessionSub10Rate: toNullableNumber(
      row.fastest_session_sub_10_rate,
    ),

    flags: getFlags(row),
  };
}

export async function getSuspiciousGameplay(): Promise<
  SuspiciousGameplayRow[]
> {
  const { data, error } = await db.rpc(
    'admin_get_suspicious_gameplay',
  );

  if (error) {
    console.error(
      '[admin.suspiciousGameplay] query error',
      error,
    );

    throw new Error(
      'Unable to load suspicious gameplay review queue.',
    );
  }

  return ((data ?? []) as RawSuspiciousGameplayRow[])
    .map(mapRow)
    .filter((row) => row.flags.length > 0);
}
