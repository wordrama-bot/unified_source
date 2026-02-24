import { Response } from 'express';
import { ApiRequest } from '../types';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../utils/responses';

import challengeService from '../services/challenge';
import challengeProgressService from '../services/challenge/progress';

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
  //@ts-ignore
  const challenges = await challengeProgressService.updateChallengeProgress(
    req.params.challengeId as string,
    req.userId as string,
    req.query.status as string,
    Number(req.query.progress as string),
  );
  if (!challenges) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    challenges,
    'Challenge Progress Updated',
    challenges.length,
  );
}

export default {
  getAllMyChallenges,
  updateChallengeProgress,
};
