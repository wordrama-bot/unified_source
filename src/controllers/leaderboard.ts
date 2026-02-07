import { Response } from 'express';
import moment from 'moment';
import { ApiRequest } from '../types';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../utils/responses';

import leaderboardService from '../services/leaderboard';

async function getLeaderboardPositionAllTime(req: ApiRequest, res: Response) {
  const userId = req.params.userId ? req.params.userId : req.userId;

  const leaderboard =
    await leaderboardService.getPlayerLeaderboardPositionAllTime(userId);
  if (!leaderboard) return notFoundResponse(req, res);

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
  if (!leaderboard || leaderboard.length === 0)
    return notFoundResponse(req, res);

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
  if (!leaderboard || leaderboard.length === 0)
    return notFoundResponse(req, res);

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
  if (!leaderboard || leaderboard.length === 0)
    return notFoundResponse(req, res);

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
  if (!leaderboard || leaderboard.length === 0)
    return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    leaderboard,
    'Daily Leaderboard Position Returned',
    leaderboard.length,
  );
}

async function getLeaderboardAllTime(req: ApiRequest, res: Response) {
  const orderBy = req.query.orderBy || 'alltime_rank';
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const leaderboardLength =
    await leaderboardService.getPlayerLeaderboardAllTimeLength();

  const leaderboard = await leaderboardService.getPlayerLeaderboardAllTime(
    orderBy,
    offset,
    limit,
    page,
  );

  if (!leaderboard || leaderboard.length === 0)
    return notFoundResponse(req, res);

  const totalPages = Math.ceil(leaderboardLength / limit);
  return successfulResponse(
    req,
    res,
    leaderboard.map((item, idx) => {
      return {
        ...item,
        position: offset + idx + 1,
      };
    }),
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
  const orderBy = req.query.orderBy || 'yearly_rank';
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const leaderboardLength =
    await leaderboardService.getPlayerLeaderboardYearlyLength();

  const leaderboard = await leaderboardService.getPlayerLeaderboardForTheYear(
    orderBy,
    offset,
    limit,
  );

  if (!leaderboard || leaderboard.length === 0)
    return notFoundResponse(req, res);

  const totalPages = Math.ceil(leaderboardLength / limit);
  return successfulResponse(
    req,
    res,
    leaderboard.map((item, idx) => {
      return {
        ...item,
        position: offset + idx + 1,
      };
    }),
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
  const orderBy = req.query.orderBy || 'monthly_rank';
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const leaderboardLength =
    await leaderboardService.getPlayerLeaderboardMonthlyLength();

  const leaderboard = await leaderboardService.getPlayerLeaderboardForTheMonth(
    orderBy,
    offset,
    limit,
  );
  if (!leaderboard || leaderboard.length === 0)
    return notFoundResponse(req, res);

  const totalPages = Math.ceil(leaderboardLength / limit);
  return successfulResponse(
    req,
    res,
    leaderboard.map((item, idx) => {
      return {
        ...item,
        position: offset + idx + 1,
      };
    }),
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
  const orderBy = req.query.orderBy || 'weekly_rank';
  const page = Number(req.query.page) || 1;
  const limit = req.query.limit || 10;
  const offset = (page - 1) * limit;

  const leaderboardLength =
    await leaderboardService.getPlayerLeaderboardWeeklyLength();

  const leaderboard = await leaderboardService.getPlayerLeaderboardForThisWeek(
    orderBy,
    offset,
    limit,
  );
  if (!leaderboard || leaderboard.length === 0)
    return notFoundResponse(req, res);

  const totalPages = Math.ceil(leaderboardLength / limit);
  return successfulResponse(
    req,
    res,
    leaderboard.map((item, idx) => {
      return {
        ...item,
        position: offset + idx + 1,
      };
    }),
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
  const orderBy = req.query.orderBy || 'daily_rank';
  const page = Number(req.query.page) || 1;
  const limit = req.query.limit || 10;
  const offset = (page - 1) * limit;

  const leaderboardLength =
    await leaderboardService.getPlayerLeaderboardDailyLength();

  const leaderboard = await leaderboardService.getPlayerLeaderboardForToday(
    orderBy,
    offset,
    limit,
    new Date().getDate(),
    new Date().getMonth() + 1,
    new Date().getFullYear(),
  );

  if (!leaderboard) return notFoundResponse(req, res);
  else if (leaderboard.length === 0)
    return successfulResponse(
      req,
      res,
      [],
      'Daily Leaderboard Returned',
      leaderboard.length,
    );

  const totalPages = Math.ceil(leaderboardLength / limit);
  return successfulResponse(
    req,
    res,
    leaderboard.map((item, idx) => {
      return {
        ...item,
        position: offset + idx + 1,
      };
    }),
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
