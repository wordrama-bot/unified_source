import { DateTime } from 'luxon';

import { db } from '../src/models';
import challengeProgressService from '../src/services/challenge/progress';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

type ChampionMetric = {
  rankColumn: string;
  winsColumn: string;
};

type PeriodConfig = {
  challengeId: string;
  table: string;
  metrics: ChampionMetric[];
};

const APPLY = process.argv.includes('--apply');

const periodArg = process.argv.find((arg) =>
  arg.startsWith('--period='),
);

const period = periodArg?.split('=')[1] as Period | undefined;

if (
  !period ||
  !['daily', 'weekly', 'monthly', 'yearly'].includes(period)
) {
  throw new Error(
    'Usage: bun run scripts/award-period-champions.ts --period=daily|weekly|monthly|yearly [--apply]',
  );
}

const WORD_PACK_METRICS = [
  { suffix: '', winsColumn: 'games_won' },
  { suffix: '_4_letter', winsColumn: 'four_letter_games_won' },
  { suffix: '_5_letter', winsColumn: 'five_letter_games_won' },
  {
    suffix: '_five_letter_crazy',
    winsColumn: 'five_letter_crazy_games_won',
  },
  { suffix: '_6_letter', winsColumn: 'six_letter_games_won' },
  { suffix: '_7_letter', winsColumn: 'seven_letter_games_won' },
  { suffix: '_8_letter', winsColumn: 'eight_letter_games_won' },
  { suffix: '_9_letter', winsColumn: 'nine_letter_games_won' },
  { suffix: '_10_letter', winsColumn: 'ten_letter_games_won' },
  { suffix: '_11_letter', winsColumn: 'eleven_letter_games_won' },
  { suffix: '_12_letter', winsColumn: 'twelve_letter_games_won' },
  { suffix: '_13_letter', winsColumn: 'thirteen_letter_games_won' },
  { suffix: '_14_letter', winsColumn: 'fourteen_letter_games_won' },
  { suffix: '_15_letter', winsColumn: 'fifteen_letter_games_won' },
  { suffix: '_16_letter', winsColumn: 'sixteen_letter_games_won' },
  { suffix: '_17_letter', winsColumn: 'seventeen_letter_games_won' },
  { suffix: '_18_letter', winsColumn: 'eighteen_letter_games_won' },
  { suffix: '_19_letter', winsColumn: 'nineteen_letter_games_won' },
  { suffix: '_20_letter', winsColumn: 'twenty_letter_games_won' },
  { suffix: '_21_letter', winsColumn: 'twentyone_letter_games_won' },
  { suffix: '_22_letter', winsColumn: 'twentytwo_letter_games_won' },
  { suffix: '_23_letter', winsColumn: 'twentythree_letter_games_won' },
];

function buildMetrics(prefix: string): ChampionMetric[] {
  return WORD_PACK_METRICS.map(({ suffix, winsColumn }) => ({
    rankColumn: `${prefix}_rank${suffix}`,
    winsColumn,
  }));
}

const CONFIG: Record<Period, PeriodConfig> = {
  daily: {
    challengeId: '4a73b85a-9e40-4ed4-a55d-a7de4ce20f8a',
    table: '_mv_wordle_daily_leaderboard',
    metrics: buildMetrics('daily'),
  },
  weekly: {
    challengeId: '3beaa47f-5638-4ba2-a42a-b45f3cb5b6bf',
    table: '_mv_wordle_weekly_leaderboard',
    metrics: buildMetrics('weekly'),
  },
  monthly: {
    challengeId: '0af08641-fbe3-454d-b21f-8f2cbdfdb28a',
    table: '_mv_wordle_monthly_leaderboard',
    metrics: buildMetrics('monthly'),
  },
  yearly: {
    challengeId: '95bb2ed7-c13b-4231-9625-e403725a5693',
    table: '_mv_wordle_yearly_leaderboard',
    metrics: buildMetrics('yearly'),
  },
};

function getCompletedPeriodFilters(period: Period) {
  const now = DateTime.utc();

  if (period === 'daily') {
    const completed = now.minus({ days: 1 });

    return {
      label: completed.toISODate(),
      filters: {
        day: completed.day,
        month: completed.month,
        year: completed.year,
      },
    };
  }

  if (period === 'weekly') {
    /*
     * Wordrama weeks begin on Sunday.
     *
     * Scheduled runs occur shortly after Sunday 00:00 UTC.
     * Saturday therefore belongs to the week that just completed.
     */
    const completed = now.startOf('day').minus({ days: 1 });

    return {
      label: `week ending ${completed.toISODate()}`,
      filters: {
        week: getSundayBasedWeekNumber(completed),
        year: completed.year,
      },
    };
  }

  if (period === 'monthly') {
    const completed = now.minus({ months: 1 });

    return {
      label: completed.toFormat('yyyy-MM'),
      filters: {
        month: completed.month,
        year: completed.year,
      },
    };
  }

  const completed = now.minus({ years: 1 });

  return {
    label: String(completed.year),
    filters: {
      year: completed.year,
    },
  };
}

function getSundayBasedWeekNumber(date: DateTime) {
  /*
   * Match Moment.js week-of-year behavior used when Wordle results
   * are stored: Sunday is the first day of the week and the first
   * week is the week containing January 1.
   */
  const yearStart = DateTime.utc(date.year, 1, 1);

  const yearStartSundayIndex = yearStart.weekday % 7;
  const dayOfYearZeroBased = date.ordinal - 1;

  return (
    Math.floor(
      (dayOfYearZeroBased + yearStartSundayIndex) / 7,
    ) + 1
  );
}

function getWinningMetrics(
  row: any,
  metrics: ChampionMetric[],
) {
  return metrics.filter(
    ({ rankColumn, winsColumn }) =>
      Number(row[rankColumn]) === 1 &&
      Number(row[winsColumn]) > 0,
  );
}

async function getQualifiedPlayers(
  config: PeriodConfig,
  filters: Record<string, number>,
) {
  const selectedColumns = [
    'player',
    'display_name',
    ...config.metrics.flatMap(
      ({ rankColumn, winsColumn }) => [
        rankColumn,
        winsColumn,
      ],
    ),
  ];

  let query = db
    .from(config.table)
    .select([...new Set(selectedColumns)].join(','));

  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).filter(
    (row: any) =>
      getWinningMetrics(row, config.metrics).length > 0,
  );
}

async function getExistingProgress(
  playerIds: string[],
  challengeId: string,
) {
  if (playerIds.length === 0) {
    return [];
  }

  const { data, error } = await db
    .from('_challenge_progress')
    .select('id, player_id, status, progress')
    .eq('challenge_id', challengeId)
    .in('player_id', playerIds);

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function main() {
  const config = CONFIG[period];

  const now = DateTime.utc();

  if (APPLY) {
    if (period === 'weekly' && now.weekday !== 7) {
      throw new Error(
        'Weekly champion awards may only be applied on Sunday UTC.',
      );
    }

    if (period === 'monthly' && now.day !== 1) {
      throw new Error(
        'Monthly champion awards may only be applied on the first day of the month UTC.',
      );
    }

    if (
      period === 'yearly' &&
      !(now.month === 1 && now.day === 1)
    ) {
      throw new Error(
        'Yearly champion awards may only be applied on January 1 UTC.',
      );
    }
  }

  const { label, filters } =
    getCompletedPeriodFilters(period);

  console.log(
    `Checking ${period} champions for completed period: ${label}`,
  );

  console.log('Period filters:', filters);

  const qualifiedRows = await getQualifiedPlayers(
    config,
    filters,
  );

  const qualifiedPlayers = Array.from(
    new Map(
      qualifiedRows.map((row: any) => [
        row.player,
        row,
      ]),
    ).values(),
  );

  const playerIds = qualifiedPlayers.map(
    (row: any) => row.player,
  );

  const progressRows = await getExistingProgress(
    playerIds,
    config.challengeId,
  );

  const progressByPlayer = new Map(
    progressRows.map((row: any) => [
      row.player_id,
      row,
    ]),
  );

  const preview = qualifiedPlayers.map((player: any) => {
    const winningRanks = getWinningMetrics(
      player,
      config.metrics,
    ).map(({ rankColumn }) => rankColumn);

    const progress =
      progressByPlayer.get(player.player) ?? null;

    return {
      playerId: player.player,
      displayName: player.display_name,
      winningRanks,
      challengeStatus:
        progress?.status ?? 'MISSING',
      challengeProgress:
        progress?.progress ?? null,
    };
  });

  console.table(
    preview.map((row) => ({
      playerId: row.playerId,
      displayName: row.displayName,
      winningRanks: row.winningRanks.join(', '),
      challengeStatus: row.challengeStatus,
      challengeProgress: row.challengeProgress,
    })),
  );

  console.log(
    `Qualified ${period} champions: ${preview.length}`,
  );

  if (!APPLY) {
    console.log(
      'Preview only. Re-run with --apply to complete eligible challenges.',
    );
    return;
  }

  for (const player of preview) {
    if (
      player.challengeStatus === 'COMPLETE' ||
      Number(player.challengeProgress) === 100
    ) {
      console.log(
        `Skipping ${player.displayName}: challenge already complete.`,
      );
      continue;
    }

    console.log(
      `Completing ${period} champion challenge for ${player.displayName} (${player.playerId})`,
    );

    const result =
      await challengeProgressService.updateChallengeProgress(
        config.challengeId,
        player.playerId,
        'COMPLETE',
        100,
      );

    if (
      !result ||
      result.status !== 'COMPLETE' ||
      Number(result.progress) !== 100
    ) {
      throw new Error(
        `Failed to complete ${period} champion challenge for ${player.displayName} (${player.playerId})`,
      );
    }

    console.log(
      `Completed ${period} champion challenge for ${player.displayName}.`,
    );
  }

  console.log(
    `${period} champion award run complete.`,
  );
}

main().catch((error) => {
  console.error(
    `${period} champion award failed:`,
    error,
  );

  process.exit(1);
});
