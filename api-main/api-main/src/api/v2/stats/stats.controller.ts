// Node Modules
import { Router, type Request, type Response } from 'express';
const router = Router();

// Services
import {
  getPlayersStatsForToday,
  getPlayersStatsForYesterday,
  getTodayVsYesterdaysStats,
  getPlayersStatsForWeek,
  getPlayersStatsForLastWeek,
  getWeekVsLastWeekStats,
  getPlayersStatsForMonth,
  getPlayersStatsForLastMonth,
  getMonthVsLastMonthStats,
  getPlayersStatsForYear,
  getYearVsLastYearStats
} from './stats.service'; 

// Controller
// GET - /api/v2/stats/:userId/today
router.get('/:userId/today', async (req: Request, res: Response) => {
  try {
    const stats = await getPlayersStatsForToday(req.params.userId);

    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v2/stats/:userId/yesterday
router.get('/:userId/yesterday', async (req: Request, res: Response) => {
  try {
    const stats = await getPlayersStatsForYesterday(req.params.userId);

    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v2/stats/:userId/this-week
router.get('/:userId/week', async (req: Request, res: Response) => {
  try {
    const stats = await getPlayersStatsForWeek(req.params.userId);

    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v2/stats/:userId/last-week
router.get('/:userId/last-week', async (req: Request, res: Response) => {
  try {
    const stats = await getPlayersStatsForLastWeek(req.params.userId);

    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v2/stats/:userId/month
router.get('/:userId/month', async (req: Request, res: Response) => {
  try {
    const stats = await getPlayersStatsForMonth(req.params.userId);

    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v2/stats/:userId/last-month
router.get('/:userId/last-month', async (req: Request, res: Response) => {
  try {
    const stats = await getPlayersStatsForLastMonth(req.params.userId);

    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v2/stats/:userId/year
router.get('/:userId/year', async (req: Request, res: Response) => {
  try {
    const stats = await getPlayersStatsForYear(req.params.userId);

    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v2/stats/:userId/year/:year
router.get('/:userId/year/:year', async (req: Request, res: Response) => {
  try {
    const stats = await getPlayersStatsForYear(req.params.userId, req.params.year);

    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v2/stats/:userId/compare/day
router.get('/:userId/compare/day', async (req: Request, res: Response) => {
  try {
    const stats = await getTodayVsYesterdaysStats(req.params.userId);

    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v2/stats/:userId/compare/week
router.get('/:userId/compare/week', async (req: Request, res: Response) => {
  try {
    const stats = await getWeekVsLastWeekStats(req.params.userId);

    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v2/stats/:userId/compare/month
router.get('/:userId/compare/month', async (req: Request, res: Response) => {
  try {
    const stats = await getMonthVsLastMonthStats(req.params.userId);

    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

// GET - /api/v2/stats/:userId/compare/year
router.get('/:userId/compare/year', async (req: Request, res: Response) => {
  try {
    const stats = await getYearVsLastYearStats(req.params.userId);

    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err);
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

export default router;
