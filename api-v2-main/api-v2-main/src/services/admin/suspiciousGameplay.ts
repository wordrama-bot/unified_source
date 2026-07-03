import { db } from '../../models';

export type SuspiciousGameplayFlag =
  | 'ONE_GUESS_24H'
  | 'ONE_GUESS_RATE'
  | 'GAMES_PER_MINUTE'
  | 'GAMES_PER_HOUR';

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
  gamesPerMinute: number;
  gamesPerHour: number;
  flags: SuspiciousGameplayFlag[];
};

type RawSuspiciousGameplayRow = {
  player_id: string;
  username: string | null;
  display_name: string | null;
  email: string | null;
  discord_id: string | null;
  total_games: number;
  wins: number;
  one_guess_wins: number;
  one_guess_last_24h: number;
  one_guess_rate: number;
  avg_guesses: number | null;
  first_game: string | null;
  last_game: string | null;
  games_last_hour: number;
  games_last_24h: number;
  games_per_minute: number;
  games_per_hour: number;
};

const thresholds = {
  oneGuessLast24h: 3,
  oneGuessRatePercent: 5,
  oneGuessRateMinimumGames: 25,
  gamesPerMinute: 5,
  gamesPerHour: 200,
};

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getFlags(row: RawSuspiciousGameplayRow): SuspiciousGameplayFlag[] {
  const flags: SuspiciousGameplayFlag[] = [];

  const totalGames = toNumber(row.total_games);
  const oneGuessLast24h = toNumber(row.one_guess_last_24h);
  const oneGuessRate = toNumber(row.one_guess_rate);
  const gamesPerMinute = toNumber(row.games_per_minute);
  const gamesPerHour = toNumber(row.games_per_hour);

  if (oneGuessLast24h >= thresholds.oneGuessLast24h) {
    flags.push('ONE_GUESS_24H');
  }

  if (
    totalGames >= thresholds.oneGuessRateMinimumGames &&
    oneGuessRate > thresholds.oneGuessRatePercent
  ) {
    flags.push('ONE_GUESS_RATE');
  }

  if (gamesPerMinute > thresholds.gamesPerMinute) {
    flags.push('GAMES_PER_MINUTE');
  }

  if (gamesPerHour > thresholds.gamesPerHour) {
    flags.push('GAMES_PER_HOUR');
  }

  return flags;
}

function mapRow(row: RawSuspiciousGameplayRow): SuspiciousGameplayRow {
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
    avgGuesses:
      row.avg_guesses === null || row.avg_guesses === undefined
        ? null
        : toNumber(row.avg_guesses),
    firstGame: row.first_game,
    lastGame: row.last_game,
    gamesLastHour: toNumber(row.games_last_hour),
    gamesLast24h: toNumber(row.games_last_24h),
    gamesPerMinute: toNumber(row.games_per_minute),
    gamesPerHour: toNumber(row.games_per_hour),
    flags: getFlags(row),
  };
}

export async function getSuspiciousGameplay(): Promise<SuspiciousGameplayRow[]> {
  const { data, error } = await db.rpc('admin_get_suspicious_gameplay');

  if (error) {
    console.error('[admin.suspiciousGameplay] query error', error);
    throw new Error('Unable to load suspicious gameplay review queue.');
  }

  return ((data ?? []) as RawSuspiciousGameplayRow[])
    .map(mapRow)
    .filter((row) => row.flags.length > 0);
}
