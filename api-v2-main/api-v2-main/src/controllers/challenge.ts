import { Response } from 'express';
import { ApiRequest } from '../types';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../utils/responses';

import challengeService from '../services/challenge';

async function getAllMyChallenges(req: ApiRequest, res: Response) {
  const orderBy = req.query.orderBy || 'IN_PROGRESS';
  const page = req.query.page || 1;
  const limit = req.query.limit || 25;
  const offset = (page - 1) * limit;
  //@ts-ignore
  const challenges = await challengeService.getMyChallenges(
    req.params.playerId || req.userId,
    req.query.statusFilter,
  );
  if (!challenges || challenges.length === 0) {
  return successfulResponse(req, res, [], "No challenges found", 0);
  }

  return successfulResponse(
    req,
    res,
    challenges,
    "Challenges Returned",
    challenges.length,
  );
}

async function updateChallengeProgress(req: ApiRequest, res: Response) {
  // Completion is derived by trusted server award jobs, never browser claims.
  return res.status(403).json({
    status: 403, count: 0, data: {},
    message: 'Challenge progress is managed by the server',
  });
}

export default {
  getAllMyChallenges,
  updateChallengeProgress,
};
