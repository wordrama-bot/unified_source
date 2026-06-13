import { Response } from 'express';
import moment from 'moment';
import { ApiRequest } from '../../../types';
import {
  badRequest,
  successfulResponse,
} from '../../../utils/responses';

import statsService from '../../../services/game/wordle/stats';

function emptyStatsResponse(
  req: ApiRequest,
  res: Response,
  message: string,
) {
  return successfulResponse(req, res, null, message, 0);
}

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
  if (!stats || Object.keys(stats).length === 0)
    return emptyStatsResponse(req, res, 'Daily Stats Returned');

  return successfulResponse(req, res, stats, 'Daily Stats Returned', 1);
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
  
  if (!stats || Object.keys(stats).length === 0)
    return emptyStatsResponse(req, res, 'Weekly Stats Returned');

  return successfulResponse(req, res, stats, 'Weekly Stats Returned', 1);
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

  if (!stats || Object.keys(stats).length === 0)
    return emptyStatsResponse(req, res, 'Monthly Stats Returned');

  return successfulResponse(req, res, stats, 'Monthly Stats Returned', 1);
}

async function getYearlyStats(req: ApiRequest, res: Response) {
  const year = req.params.year || new Date().getFullYear();

  const stats = await statsService.getPlayerYearlyStats(req.userId, year);
  if (!stats || Object.keys(stats).length === 0)
    return emptyStatsResponse(req, res, 'Yearly Stats Returned');

  return successfulResponse(req, res, stats, 'Yearly Stats Returned', 1);
}

async function getAllTimeStats(req: ApiRequest, res: Response) {
  const stats = await statsService.getPlayerAllTimeStats(req.userId);
  if (!stats || Object.keys(stats).length === 0)
    return emptyStatsResponse(req, res, 'All Time Stats Returned');

  return successfulResponse(req, res, stats, 'All Time Stats Returned', 1);
}

async function getAllTimeStatsByType(req: ApiRequest, res: Response) {
  const validTypes = ['INFINITE', 'DAILY'];
  if (!validTypes.includes(req.params.type))
    return badRequest(req, res, 'Invalid type [INFINITE, DAILY]');

  const stats = await statsService.getPlayerAllTimeStatsByType(
    req.userId,
    req.params.type,
  );
  if (!stats || Object.keys(stats).length === 0)
    return emptyStatsResponse(req, res, 'All Time Stats Returned');

  return successfulResponse(req, res, stats, 'All Time Stats Returned', 1);
}

export default {
  getYearlyStats,
  getMonthlyStats,
  getWeeklyStats,
  getDailyStats,
  getAllTimeStats,
  getAllTimeStatsByType,
};
