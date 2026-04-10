import * as changeKeys from 'change-case/keys';
import { db } from '../models';
import moment from 'moment-timezone';

const ALLOWED_ORDER_COLUMNS = new Set([
  'alltime_rank',
  'yearly_rank',
  'monthly_rank',
  'weekly_rank',
  'daily_rank',

  'alltime_rank_4_letter',
  'alltime_rank_5_letter',
  'alltime_rank_6_letter',
  'alltime_rank_7_letter',
  'alltime_rank_8_letter',
  'alltime_rank_9_letter',
  'alltime_rank_10_letter',
  'alltime_rank_11_letter',
  'alltime_rank_12_letter',
  'alltime_rank_13_letter',
  'alltime_rank_14_letter',
  'alltime_rank_15_letter',
  'alltime_rank_16_letter',
  'alltime_rank_17_letter',
  'alltime_rank_18_letter',
  'alltime_rank_19_letter',
  'alltime_rank_20_letter',
  'alltime_rank_21_letter',
  'alltime_rank_22_letter',
  'alltime_rank_23_letter',

  'yearly_rank_4_letter',
  'yearly_rank_5_letter',
  'yearly_rank_6_letter',
  'yearly_rank_7_letter',
  'yearly_rank_8_letter',
  'yearly_rank_9_letter',
  'yearly_rank_10_letter',
  'yearly_rank_11_letter',
  'yearly_rank_12_letter',
  'yearly_rank_13_letter',
  'yearly_rank_14_letter',
  'yearly_rank_15_letter',
  'yearly_rank_16_letter',
  'yearly_rank_17_letter',
  'yearly_rank_18_letter',
  'yearly_rank_19_letter',
  'yearly_rank_20_letter',
  'yearly_rank_21_letter',
  'yearly_rank_22_letter',
  'yearly_rank_23_letter',

  'monthly_rank_4_letter',
  'monthly_rank_5_letter',
  'monthly_rank_6_letter',
  'monthly_rank_7_letter',
  'monthly_rank_8_letter',
  'monthly_rank_9_letter',
  'monthly_rank_10_letter',
  'monthly_rank_11_letter',
  'monthly_rank_12_letter',
  'monthly_rank_13_letter',
  'monthly_rank_14_letter',
  'monthly_rank_15_letter',
  'monthly_rank_16_letter',
  'monthly_rank_17_letter',
  'monthly_rank_18_letter',
  'monthly_rank_19_letter',
  'monthly_rank_20_letter',
  'monthly_rank_21_letter',
  'monthly_rank_22_letter',
  'monthly_rank_23_letter',

  'weekly_rank_4_letter',
  'weekly_rank_5_letter',
  'weekly_rank_6_letter',
  'weekly_rank_7_letter',
  'weekly_rank_8_letter',
  'weekly_rank_9_letter',
  'weekly_rank_10_letter',
  'weekly_rank_11_letter',
  'weekly_rank_12_letter',
  'weekly_rank_13_letter',
  'weekly_rank_14_letter',
  'weekly_rank_15_letter',
  'weekly_rank_16_letter',
  'weekly_rank_17_letter',
  'weekly_rank_18_letter',
  'weekly_rank_19_letter',
  'weekly_rank_20_letter',
  'weekly_rank_21_letter',
  'weekly_rank_22_letter',
  'weekly_rank_23_letter',

  'daily_rank_4_letter',
  'daily_rank_5_letter',
  'daily_rank_6_letter',
  'daily_rank_7_letter',
  'daily_rank_8_letter',
  'daily_rank_9_letter',
  'daily_rank_10_letter',
  'daily_rank_11_letter',
]);

function sanitizeOrderBy(orderBy: string, fallback: string) {
  return ALLOWED_ORDER_COLUMNS.has(orderBy) ? orderBy : fallback;
}

async function getPlayerLeaderboardPositionAllTime(userId: string) {
  const { data, error } = await db
    .from('_mv_wordle_alltime_leaderboard')
    .select('*')
    .eq('player', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getPlayerLeaderboardPositionThisYear(
  userId: string,
  year: number = new Date().getFullYear(),
) {
  const { data, error } = await db
    .from('_mv_wordle_yearly_leaderboard')
    .select('*')
    .eq('player', userId)
    .eq('year', year)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getPlayerLeaderboardPositionThisMonth(
  userId: string,
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear(),
) {
  const { data, error } = await db
    .from('_mv_wordle_monthly_leaderboard')
    .select('*')
    .eq('player', userId)
    .eq('month', month)
    .eq('year', year)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getPlayerLeaderboardPositionThisWeek(
  userId: string,
  week: number = moment().week(),
  year: number = new Date().getFullYear(),
) {
  const { data, error } = await db
    .from('_mv_wordle_weekly_leaderboard')
    .select('*')
    .eq('player', userId)
    .eq('week', week)
    .eq('year', year)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getPlayerLeaderboardPositionToday(
  userId: string,
  day: number = new Date().getDate(),
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear(),
) {
  const { data, error } = await db
    .from('_mv_wordle_daily_leaderboard')
    .select('*')
    .eq('player', userId)
    .eq('day', day)
    .eq('month', month)
    .eq('year', year)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getPlayerLeaderboardAllTime(
  orderBy: string = 'alltime_rank',
  offset: number = 0,
  limit: number = 10,
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'alltime_rank');

  const { data, error } = await db
    .from('_mv_wordle_alltime_leaderboard')
    .select('*')
    .not(safeOrderBy, 'is', null)
    .order(safeOrderBy, { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((row: any) => {
    const camel = changeKeys.camelCase(row, 10) as any;

    return {
      ...camel,
      bestStreak: camel.overallBestStreak ?? 0,
      players: {
        levels: {
          level: camel.level ?? 0,
        },
        ledger: {
          coinBalance: camel.coinBalance ?? 0,
        },
      },
    };
  });
}

async function getPlayerLeaderboardForTheYear(
  orderBy: string = 'yearly_rank',
  offset: number = 0,
  limit: number = 10,
  year: number = new Date().getFullYear(),
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'yearly_rank');

  const { data, error } = await db
    .from('_mv_wordle_yearly_leaderboard')
    .select('*')
    .eq('year', year)
    .not(safeOrderBy, 'is', null)
    .order(safeOrderBy, { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((row: any) => {
    const camel = changeKeys.camelCase(row, 10) as any;

    return {
      ...camel,
      players: {
        levels: {
          level: camel.level ?? 0,
        },
        ledger: {
          coinBalance: camel.coinBalance ?? 0,
        },
      },
    };
  });
}

async function getPlayerLeaderboardForTheMonth(
  orderBy: string = 'monthly_rank',
  offset: number = 0,
  limit: number = 10,
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear(),
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'monthly_rank');

  const { data, error } = await db
    .from('_mv_wordle_monthly_leaderboard')
    .select('*')
    .eq('month', month)
    .eq('year', year)
    .not(safeOrderBy, 'is', null)
    .order(safeOrderBy, { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((row: any) => {
    const camel = changeKeys.camelCase(row, 10) as any;

    return {
      ...camel,
      players: {
        levels: {
          level: camel.level ?? 0,
        },
        ledger: {
          coinBalance: camel.coinBalance ?? 0,
        },
      },
    };
  });
}

async function getPlayerLeaderboardForThisWeek(
  orderBy: string = 'weekly_rank',
  offset: number = 0,
  limit: number = 10,
  week: number = moment().week(),
  year: number = new Date().getFullYear(),
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'weekly_rank');

  const { data, error } = await db
    .from('_mv_wordle_weekly_leaderboard')
    .select('*')
    .eq('week', week)
    .eq('year', year)
    .not(safeOrderBy, 'is', null)
    .order(safeOrderBy, { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((row: any) => {
    const camel = changeKeys.camelCase(row, 10) as any;

    return {
      ...camel,
      players: {
        levels: {
          level: camel.level ?? 0,
        },
        ledger: {
          coinBalance: camel.coinBalance ?? 0,
        },
      },
    };
  });
}

async function getPlayerLeaderboardForToday(
  orderBy: string = 'daily_rank',
  offset: number = 0,
  limit: number = 10,
  day: number = new Date().getDate(),
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear(),
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'daily_rank');

  const { data, error } = await db
    .from('_mv_wordle_daily_leaderboard')
    .select('*')
    .eq('day', day)
    .eq('month', month)
    .eq('year', year)
    .not(safeOrderBy, 'is', null)
    .order(safeOrderBy, { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((row: any) => {
    const camel = changeKeys.camelCase(row, 10) as any;

    return {
      ...camel,
      players: {
        levels: {
          level: camel.level ?? 0,
        },
        ledger: {
          coinBalance: camel.coinBalance ?? 0,
        },
      },
    };
  });
}

async function getPlayerLeaderboardAllTimeLength(
  orderBy: string = 'alltime_rank',
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'alltime_rank');

  const { count, error } = await db
    .from('_mv_wordle_alltime_leaderboard')
    .select('player', { count: 'exact', head: true })
    .not(safeOrderBy, 'is', null);

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getPlayerLeaderboardYearlyLength(
  orderBy: string = 'yearly_rank',
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'yearly_rank');

  const { count, error } = await db
    .from('_mv_wordle_yearly_leaderboard')
    .select('player', { count: 'exact', head: true })
    .eq('year', new Date().getFullYear())
    .not(safeOrderBy, 'is', null);

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getPlayerLeaderboardMonthlyLength(
  orderBy: string = 'monthly_rank',
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'monthly_rank');

  const { count, error } = await db
    .from('_mv_wordle_monthly_leaderboard')
    .select('player', { count: 'exact', head: true })
    .eq('month', new Date().getMonth() + 1)
    .eq('year', new Date().getFullYear())
    .not(safeOrderBy, 'is', null);

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getPlayerLeaderboardWeeklyLength(
  orderBy: string = 'weekly_rank',
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'weekly_rank');

  const { count, error } = await db
    .from('_mv_wordle_weekly_leaderboard')
    .select('player', { count: 'exact', head: true })
    .eq('week', moment().week())
    .eq('year', new Date().getFullYear())
    .not(safeOrderBy, 'is', null);

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getPlayerLeaderboardDailyLength(
  orderBy: string = 'daily_rank',
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'daily_rank');

  const { count, error } = await db
    .from('_mv_wordle_daily_leaderboard')
    .select('player', { count: 'exact', head: true })
    .eq('day', new Date().getDate())
    .eq('month', new Date().getMonth() + 1)
    .eq('year', new Date().getFullYear())
    .not(safeOrderBy, 'is', null);

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

export default {
  getPlayerLeaderboardAllTimeLength,
  getPlayerLeaderboardYearlyLength,
  getPlayerLeaderboardMonthlyLength,
  getPlayerLeaderboardWeeklyLength,
  getPlayerLeaderboardDailyLength,
  getPlayerLeaderboardPositionAllTime,
  getPlayerLeaderboardPositionThisYear,
  getPlayerLeaderboardPositionThisMonth,
  getPlayerLeaderboardPositionThisWeek,
  getPlayerLeaderboardPositionToday,
  getPlayerLeaderboardAllTime,
  getPlayerLeaderboardForTheYear,
  getPlayerLeaderboardForTheMonth,
  getPlayerLeaderboardForThisWeek,
  getPlayerLeaderboardForToday,
};
