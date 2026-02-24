import * as changeKeys from 'change-case/keys';
import moment from 'moment';
import { db } from '../../../models';

function guardUserId(userId: string, fnName: string) {
  if (!userId) {
    console.error(`[WordleStats] Missing userId in ${fnName}`);
    return false;
  }
  return true;
}

async function getPlayerDailyStats(
  userId: string,
  day: number = new Date().getDate(),
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear(),
) {
  if (!guardUserId(userId, 'getPlayerDailyStats')) return {};

  const { data, error } = await db
    .from('_v_wordle_daily_stats')
    .select('*')
    .eq('player', userId)
    .eq('day', day)
    .eq('month', month)
    .eq('year', year)
    .maybeSingle();

  if (error) {
    console.error('[WordleStats] getPlayerDailyStats error:', error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getPlayerWeeklyStats(
  userId: string,
  week: number = moment().week(),
  year: number = new Date().getFullYear(),
) {
  if (!guardUserId(userId, 'getPlayerWeeklyStats')) return {};

  const { data, error } = await db
    .from('_v_wordle_weekly_stats')
    .select('*')
    .eq('player', userId)
    .eq('week', week)
    .eq('year', year)
    .maybeSingle();

  if (error) {
    console.error('[WordleStats] getPlayerWeeklyStats error:', error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getPlayerMonthlyStats(
  userId: string,
  // NOTE: keeping your original default (0-based) to avoid behavior changes.
  month: number = new Date().getMonth(),
  year: number = new Date().getFullYear(),
) {
  if (!guardUserId(userId, 'getPlayerMonthlyStats')) return {};

  const { data, error } = await db
    .from('_v_wordle_monthly_stats')
    .select('*')
    .eq('player', userId)
    .eq('month', month)
    .eq('year', year)
    .maybeSingle();

  if (error) {
    console.error('[WordleStats] getPlayerMonthlyStats error:', error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getPlayerYearlyStats(
  userId: string,
  year: number = new Date().getFullYear(),
) {
  if (!guardUserId(userId, 'getPlayerYearlyStats')) return {};

  const { data, error } = await db
    .from('_v_wordle_yearly_stats')
    .select('*')
    .eq('player', userId)
    .eq('year', year)
    .maybeSingle();

  if (error) {
    console.error('[WordleStats] getPlayerYearlyStats error:', error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getPlayerAllTimeStats(userId: string) {
  if (!guardUserId(userId, 'getPlayerAllTimeStats')) return {};

  const { data, error } = await db
    .from('_v_wordle_alltime_stats')
    .select('*')
    .eq('player', userId)
    .maybeSingle();

  if (error) {
    console.error('[WordleStats] getPlayerAllTimeStats error:', error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getPlayerAllTimeStatsByType(userId: string, type: string) {
  if (!guardUserId(userId, 'getPlayerAllTimeStatsByType')) return {};

  const { data, error } = await db
    .from('_v_wordle_alltime_stats_by_type')
    .select('*')
    .eq('player', userId)
    .eq('type', type)
    .maybeSingle();

  if (error) {
    console.error('[WordleStats] getPlayerAllTimeStatsByType error:', error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

export default {
  getPlayerDailyStats,
  getPlayerWeeklyStats,
  getPlayerMonthlyStats,
  getPlayerYearlyStats,
  getPlayerAllTimeStats,
  getPlayerAllTimeStatsByType,
};