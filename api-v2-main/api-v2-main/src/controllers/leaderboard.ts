import { Response } from 'express';
import moment from 'moment';
import { ApiRequest } from '../types';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../utils/responses';

import leaderboardService from '../services/leaderboard';

function serviceUnavailable(res: Response, payload: unknown) {
  console.error('Leaderboard service error / non-array response:', payload);
  return res.status(503).json({
    status: 503,
    message: 'Leaderboard temporarily unavailable',
    data: {},
    count: 0,
  });
}

function asNumber(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

async function getLeaderboardPositionAllTime(req: ApiRequest, res: Response) {
  const userId = req.params.userId ? req.params.userId : req.userId;

  const leaderboard =
    await leaderboardService.getPlayerLeaderboardPositionAllTime(userId);

  if (!Array.isArray(leaderboard)) return serviceUnavailable(res, leaderboard);
  if (leaderboard.length === 0) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    leaderboard,
    'All Time Leaderboard Position Returned',
    leaderboard.length,
  );
}

async function getLeaderboardPositionThisYear(req: ApiRequest, res: Response) {
  const userId = req.params.userId ? req.params.userId : req.userId;
  const { year } = req.params;

  const leaderboard =
    await leaderboardService.getPlayerLeaderboardPositionThisYear(userId, year);

  if (!Array.isArray(leaderboard)) return serviceUnavailable(res, leaderboard);
  if (leaderboard.length === 0) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    leaderboard,
    'Yearly Leaderboard Position Returned',
    leaderboard.length,
  );
}

async function getLeaderboardPositionThisMonth(req: ApiRequest, res: Response) {
  const userId = req.params.userId ? req.params.userId : req.userId;
  const { month, year } = req.params;

  const leaderboard =
    await leaderboardService.getPlayerLeaderboardPositionThisMonth(
      userId,
      month,
      year,
    );

  if (!Array.isArray(leaderboard)) return serviceUnavailable(res, leaderboard);
  if (leaderboard.length === 0) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    leaderboard,
    'Monthly Leaderboard Position Returned',
    leaderboard.length,
  );
}

async function getLeaderboardPositionThisWeek(req: ApiRequest, res: Response) {
  const userId = req.params.userId ? req.params.userId : req.userId;
  const { week, year } = req.params;

  const leaderboard =
    await leaderboardService.getPlayerLeaderboardPositionThisWeek(
      userId,
      week,
      year,
    );

  if (!Array.isArray(leaderboard)) return serviceUnavailable(res, leaderboard);
  if (leaderboard.length === 0) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    leaderboard,
    'Weekly Leaderboard Position Returned',
    leaderboard.length,
  );
}

async function getLeaderboardPositionToday(req: ApiRequest, res: Response) {
  const userId = req.params.userId ? req.params.userId : req.userId;
  const { day, month, year } = req.params;

  const leaderboard =
    await leaderboardService.getPlayerLeaderboardPositionToday(
      userId,
      day,
      month,
      year,
    );

  if (!Array.isArray(leaderboard)) return serviceUnavailable(res, leaderboard);
  if (leaderboard.length === 0) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    leaderboard,
    'Daily Leaderboard Position Returned',
    leaderboard.length,
  );
}

const QUERY_TIMEOUT_MS = 30000;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

async function getLeaderboardAllTime(req: ApiRequest, res: Response) {
  const orderBy = (req.query.orderBy as string) || 'alltime_rank';
  const page = asNumber(req.query.page, 1);
  const limit = asNumber(req.query.limit, 10);
  const offset = (page - 1) * limit;

  // Run both queries in parallel with timeout protection
  const [leaderboardLength, leaderboard] = await Promise.all([
    withTimeout(
      leaderboardService.getPlayerLeaderboardAllTimeLength(),
      QUERY_TIMEOUT_MS,
      0,
    ),
    withTimeout(
      leaderboardService.getPlayerLeaderboardAllTime(orderBy, offset, limit),
      QUERY_TIMEOUT_MS,
      {},
    ),
  ]);

  if (!Array.isArray(leaderboard)) return serviceUnavailable(res, leaderboard);
  if (leaderboard.length === 0) return notFoundResponse(req, res);

  const totalPages = Math.max(1, Math.ceil(leaderboardLength / limit));
  return successfulResponse(
    req,
    res,
    leaderboard.map((item, idx) => ({
      ...item,
      position: offset + idx + 1,
    })),
    'All Time Leaderboard Returned',
    leaderboard.length,
    {
      previousPage: page - 1 > 0 ? page - 1 : 1,
      currentPage: page,
      nextPage: page + 1 < totalPages ? page + 1 : totalPages,
      totalPages,
      totalItems: leaderboardLength,
    },
  );
}

async function getLeaderboardForTheYear(req: ApiRequest, res: Response) {
  const orderBy = (req.query.orderBy as string) || 'yearly_rank';
  const page = asNumber(req.query.page, 1);
  const limit = asNumber(req.query.limit, 10);
  const offset = (page - 1) * limit;

  // Run both queries in parallel with timeout protection
  const [leaderboardLength, leaderboard] = await Promise.all([
    withTimeout(
      leaderboardService.getPlayerLeaderboardYearlyLength(),
      QUERY_TIMEOUT_MS,
      0,
    ),
    withTimeout(
      leaderboardService.getPlayerLeaderboardForTheYear(orderBy, offset, limit),
      QUERY_TIMEOUT_MS,
      {},
    ),
  ]);

  if (!Array.isArray(leaderboard)) return serviceUnavailable(res, leaderboard);
  if (leaderboard.length === 0) return notFoundResponse(req, res);

  const totalPages = Math.max(1, Math.ceil(leaderboardLength / limit));
  return successfulResponse(
    req,
    res,
    leaderboard.map((item, idx) => ({
      ...item,
      position: offset + idx + 1,
    })),
    'Yearly Leaderboard Returned',
    leaderboard.length,
    {
      previousPage: page - 1 > 0 ? page - 1 : 1,
      currentPage: page,
      nextPage: page + 1 < totalPages ? page + 1 : totalPages,
      totalPages,
      totalItems: leaderboardLength,
    },
  );
}

async function getLeaderboardForTheMonth(req: ApiRequest, res: Response) {
  const orderBy = (req.query.orderBy as string) || 'monthly_rank';
  const page = asNumber(req.query.page, 1);
  const limit = asNumber(req.query.limit, 10);
  const offset = (page - 1) * limit;

  // Run both queries in parallel with timeout protection
  const [leaderboardLength, leaderboard] = await Promise.all([
    withTimeout(
      leaderboardService.getPlayerLeaderboardMonthlyLength(),
      QUERY_TIMEOUT_MS,
      0,
    ),
    withTimeout(
      leaderboardService.getPlayerLeaderboardForTheMonth(orderBy, offset, limit),
      QUERY_TIMEOUT_MS,
      {},
    ),
  ]);

  if (!Array.isArray(leaderboard)) return serviceUnavailable(res, leaderboard);
  if (leaderboard.length === 0) return notFoundResponse(req, res);

  const totalPages = Math.max(1, Math.ceil(leaderboardLength / limit));
  return successfulResponse(
    req,
    res,
    leaderboard.map((item, idx) => ({
      ...item,
      position: offset + idx + 1,
    })),
    'Monthly Leaderboard Returned',
    leaderboard.length,
    {
      previousPage: page - 1 > 0 ? page - 1 : 1,
      currentPage: page,
      nextPage: page + 1 < totalPages ? page + 1 : totalPages,
      totalPages,
      totalItems: leaderboardLength,
    },
  );
}

async function getLeaderboardForThisWeek(req: ApiRequest, res: Response) {
  const orderBy = (req.query.orderBy as string) || 'weekly_rank';
  const page = asNumber(req.query.page, 1);
  const limit = asNumber(req.query.limit, 10);
  const offset = (page - 1) * limit;

  // Run both queries in parallel with timeout protection
  const [leaderboardLength, leaderboard] = await Promise.all([
    withTimeout(
      leaderboardService.getPlayerLeaderboardWeeklyLength(),
      QUERY_TIMEOUT_MS,
      0,
    ),
    withTimeout(
      leaderboardService.getPlayerLeaderboardForThisWeek(orderBy, offset, limit),
      QUERY_TIMEOUT_MS,
      {},
    ),
  ]);

  if (!Array.isArray(leaderboard)) return serviceUnavailable(res, leaderboard);
  if (leaderboard.length === 0) return notFoundResponse(req, res);

  const totalPages = Math.max(1, Math.ceil(leaderboardLength / limit));
  return successfulResponse(
    req,
    res,
    leaderboard.map((item, idx) => ({
      ...item,
      position: offset + idx + 1,
    })),
    'Weekly Leaderboard Returned',
    leaderboard.length,
    {
      previousPage: page - 1 > 0 ? page - 1 : 1,
      currentPage: page,
      nextPage: page + 1 < totalPages ? page + 1 : totalPages,
      totalPages,
      totalItems: leaderboardLength,
    },
  );
}

async function getLeaderboardForToday(req: ApiRequest, res: Response) {
  const orderBy = (req.query.orderBy as string) || 'daily_rank';
  const page = asNumber(req.query.page, 1);
  const limit = asNumber(req.query.limit, 10);
  const offset = (page - 1) * limit;

  // Run both queries in parallel with timeout protection
  const [leaderboardLength, leaderboard] = await Promise.all([
    withTimeout(
      leaderboardService.getPlayerLeaderboardDailyLength(),
      QUERY_TIMEOUT_MS,
      0,
    ),
    withTimeout(
      leaderboardService.getPlayerLeaderboardForToday(
        orderBy,
        offset,
        limit,
        new Date().getDate(),
        new Date().getMonth() + 1,
        new Date().getFullYear(),
      ),
      QUERY_TIMEOUT_MS,
      {},
    ),
  ]);

  if (!Array.isArray(leaderboard)) return serviceUnavailable(res, leaderboard);

  if (leaderboard.length === 0) {
    return successfulResponse(req, res, [], 'Daily Leaderboard Returned', 0);
  }

  const totalPages = Math.max(1, Math.ceil(leaderboardLength / limit));
  return successfulResponse(
    req,
    res,
    leaderboard.map((item, idx) => ({
      ...item,
      position: offset + idx + 1,
    })),
    'Daily Leaderboard Returned',
    leaderboard.length,
    {
      previousPage: page - 1 > 0 ? page - 1 : 1,
      currentPage: page,
      nextPage: page + 1 < totalPages ? page + 1 : totalPages,
      totalPages,
      totalItems: leaderboardLength,
    },
  );
}

export default {
  getLeaderboardPositionAllTime,
  getLeaderboardPositionThisYear,
  getLeaderboardPositionThisMonth,
  getLeaderboardPositionThisWeek,
  getLeaderboardPositionToday,
  getLeaderboardAllTime,
  getLeaderboardForTheYear,
  getLeaderboardForTheMonth,
  getLeaderboardForThisWeek,
  getLeaderboardForToday,
};