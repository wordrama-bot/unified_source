import { Response } from 'express';
import moment from 'moment';
import { ApiRequest } from '../../../types';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../../../utils/responses';

import statsService from '../../../services/game/wordle/stats';

async function getDailyStats(req: ApiRequest, res: Response) {
  let day = new Date().getDate();
  if (req.params.day) {
    day = Number(req.params.day);
  }

  let month = new Date().getMonth() + 1;
  if (req.params.month) {
    month = Number(req.params.month);
  }

  let year = new Date().getFullYear();
  if (req.params.year) {
    year = Number(req.params.year);
  }

  const stats = await statsService.getPlayerDailyStats(
    req.userId,
    day,
    month,
    year,
  );
  if (!stats || stats.length === 0) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    stats,
    'Daily Stats Returned',
    stats.length,
  );
}

async function getWeeklyStats(req: ApiRequest, res: Response) {
  let week = moment().week();
  if (req.params.week) {
    week = Number(req.params.week);
  }

  let year = new Date().getFullYear();
  if (req.params.year) {
    year = Number(req.params.year);
  }

  const stats = await statsService.getPlayerWeeklyStats(req.userId, week, year);
  if (!stats || stats.length === 0) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    stats,
    'Weekly Stats Returned',
    stats.length,
  );
}

async function getMonthlyStats(req: ApiRequest, res: Response) {
  let month = new Date().getMonth() + 1;
  if (req.params.month) {
    month = Number(req.params.month);
  }

  let year = new Date().getFullYear();
  if (req.params.year) {
    year = Number(req.params.year);
  }

  const stats = await statsService.getPlayerMonthlyStats(
    req.userId,
    month,
    year,
  );

  if (!stats || stats.length === 0) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    stats,
    'Monthly Stats Returned',
    stats.length,
  );
}

async function getYearlyStats(req: ApiRequest, res: Response) {
  const year = req.params.year || new Date().getFullYear();

  const stats = await statsService.getPlayerYearlyStats(req.userId, year);
  if (!stats || stats.length === 0) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    stats,
    'Yearly Stats Returned',
    stats.length,
  );
}

async function getAllTimeStats(req: ApiRequest, res: Response) {
  const stats = await statsService.getPlayerAllTimeStats(req.userId);
  if (!stats || stats.length === 0) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    stats,
    'All Time Stats Returned',
    stats.length,
  );
}

async function getAllTimeStatsByType(req: ApiRequest, res: Response) {
  const validTypes = ['INFINITE', 'DAILY'];
  if (!validTypes.includes(req.params.type))
    return badRequest(req, res, 'Invalid type [INFINITE, DAILY]');

  const stats = await statsService.getPlayerAllTimeStatsByType(
    req.userId,
    req.params.type,
  );
  if (!stats || stats.length === 0) return notFoundResponse(req, res);
  return successfulResponse(
    req,
    res,
    stats,
    'All Time Stats Returned',
    stats.length,
  );
}

export default {
  getYearlyStats,
  getMonthlyStats,
  getWeeklyStats,
  getDailyStats,
  getAllTimeStats,
  getAllTimeStatsByType,
};
