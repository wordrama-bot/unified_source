import * as changeKeys from 'change-case/keys';
import { db } from '../models';
import moment from 'moment-timezone';

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
  const { data, error } = await db
    .from('_mv_wordle_alltime_leaderboard')
    .select('*')
    .order(orderBy, { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((row: any) => changeKeys.camelCase(row, 10));
}

async function getPlayerLeaderboardForTheYear(
  orderBy: string = 'yearly_rank',
  offset: number = 0,
  limit: number = 10,
  year: number = new Date().getFullYear(),
) {
  const { data, error } = await db
    .from('_mv_wordle_yearly_leaderboard')
    .select('*, _players ( _levels (level), _ledger (coin_balance))')
    .order(orderBy, { ascending: true })
    .range(offset, offset + limit - 1)
    .eq('year', year);

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((row: any) => changeKeys.camelCase(row, 10));
}

async function getPlayerLeaderboardForTheMonth(
  orderBy: string = 'monthly_rank',
  offset: number = 0,
  limit: number = 10,
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear(),
) {
  const { data, error } = await db
    .from('_mv_wordle_monthly_leaderboard')
    .select('*, _players ( _levels (level), _ledger (coin_balance))')
    .order(orderBy, { ascending: true })
    .range(offset, offset + limit - 1)
    .eq('month', month)
    .eq('year', year);

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((row: any) => changeKeys.camelCase(row, 10));
}

async function getPlayerLeaderboardForThisWeek(
  orderBy: string = 'weekly_rank',
  offset: number = 0,
  limit: number = 10,
  week: number = moment().week(),
  year: number = new Date().getFullYear(),
) {
  const { data, error } = await db
    .from('_mv_wordle_weekly_leaderboard')
    .select('*, _players ( _levels (level), _ledger (coin_balance))')
    .order(orderBy, { ascending: true })
    .range(offset, offset + limit - 1)
    .eq('week', week)
    .eq('year', year);

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((row: any) => changeKeys.camelCase(row, 10));
}

async function getPlayerLeaderboardForToday(
  orderBy: string = 'daily_rank',
  offset: number = 0,
  limit: number = 10,
  day: number = new Date().getDate(),
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear(),
) {
  const { data, error } = await db
    .from('_mv_wordle_daily_leaderboard')
    .select('*, _players ( _levels (level), _ledger (coin_balance))')
    .order(orderBy, { ascending: true })
    .range(offset, offset + limit - 1)
    .eq('day', day)
    .eq('month', month)
    .eq('year', year);

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((row: any) => changeKeys.camelCase(row, 10));
}

async function getPlayerLeaderboardAllTimeLength() {
  const { count, error } = await db
    .from('_mv_wordle_alltime_leaderboard')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getPlayerLeaderboardYearlyLength() {
  const { count, error } = await db
    .from('_mv_wordle_yearly_leaderboard')
    .select('*', { count: 'exact', head: true })
    .eq('year', new Date().getFullYear());

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getPlayerLeaderboardMonthlyLength() {
  const { count, error } = await db
    .from('_mv_wordle_monthly_leaderboard')
    .select('*', { count: 'exact', head: true })
    .eq('month', new Date().getMonth() + 1)
    .eq('year', new Date().getFullYear());

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getPlayerLeaderboardWeeklyLength() {
  const { count, error } = await db
    .from('_mv_wordle_weekly_leaderboard')
    .select('*', { count: 'exact', head: true })
    .eq('week', moment().week())
    .eq('year', new Date().getFullYear());

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getPlayerLeaderboardDailyLength() {
  const { count, error } = await db
    .from('_mv_wordle_daily_leaderboard')
    .select('*', { count: 'exact', head: true })
    .eq('day', new Date().getDate())
    .eq('month', new Date().getMonth() + 1)
    .eq('year', new Date().getFullYear());

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
