import { Response } from 'express';
import { z } from 'zod';
import { ApiRequest } from '../../../types';
import {
  addGameResult as addGameResultSchema,
  type CreateCustom,
  createCustom as createCustomSchema,
} from '../../../schema/game/wordle';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
  unauthorizedResponse,
} from '../../../utils/responses';

import gameService from '../../../services/game/wordle';
import { checkIfValidWordPack } from './words';

async function getCompletedInstance(req: ApiRequest, res: Response) {
  if (!req.userId) return unauthorizedResponse(req, res);
  const parsed = z.string().uuid().safeParse(req.params.gameInstanceId);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid game instance ID', status: 400 });
  try {
    const result = await gameService.getCompletedInstance(req.userId, parsed.data);
    // Never cache a negative answer: another tab may complete this game next.
    res.set('Cache-Control', 'no-store');
    return successfulResponse(req, res, result, '[Wordle] Instance Checked', result ? 1 : 0);
  } catch (error) {
    console.error('[wordle] unable to check completed instance', error);
    return res.status(503).json({ message: 'Unable to verify Wordle game', status: 503 });
  }
}

async function getCustom(req: ApiRequest, res: Response) {
  const shareCode = req.params.shareCode;
  if (!shareCode) return badRequest(req, res, 'No share code provided');

  const custom = await gameService.getCustomByShareCode(shareCode);
  if (custom?.shareCode !== shareCode) return notFoundResponse(req, res);

  return successfulResponse(req, res, custom, '[Wordle] Custom Game Found', 1);
}

async function getLast30(req: ApiRequest, res: Response) {
  const { gameMode, wordPack } = req.params;

  if (!gameMode) {
    return badRequest(req, res, 'No gameMode provided');
  }

  if (!wordPack) {
    return badRequest(req, res, 'No wordPack provided');
  }

  const normalizedGameMode = gameMode.toUpperCase();

  if (!['DAILY', 'INFINITE'].includes(normalizedGameMode)) {
    return badRequest(req, res, 'Invalid Game Mode');
  }

  const isValidWordPack = checkIfValidWordPack(wordPack);
  if (!isValidWordPack) {
    return badRequest(req, res, 'Invalid Word Pack');
  }

  const last30 = await gameService.getLast30(
    req.userId,
    normalizedGameMode,
    wordPack,
  );

  if (!last30 || last30.length < 1) {
    return notFoundResponse(req, res);
  }

  return successfulResponse(
    req,
    res,
    last30,
    '[Wordle] Games Found',
    last30.length,
  );
}

async function submitWordleResult(req: ApiRequest, res: Response) {
  const validated = addGameResultSchema.safeParse(req.body);

  if (!validated.success) {
    return badRequest(req, res, validated.error.message);
  }

  if (Object.keys(validated.data).length === 0) {
    return badRequest(req, res, 'No fields to update');
  }

  const result = await gameService.submitWordleResult(
    req.userId,
    validated.data,
  );

  if (!result?.resultId) {
    return notFoundResponse(req, res);
  }

  return successfulResponse(
    req,
    res,
    result,
    '[Wordle] Result Added',
    1,
  );
}

async function createCustom(req: ApiRequest, res: Response) {
  const validated: CreateCustom = createCustomSchema.safeParse(req.body);
  if (!validated.success) return badRequest(req, res, validated.error.message);
  else if (Object.keys(validated.data).length === 0)
    return badRequest(req, res, 'No fields to update');

  const result = await gameService.createCustom(req.userId, validated.data);
  if (!result || !result?.shareCode) return notFoundResponse(req, res);

  return successfulResponse(req, res, result, '[Wordle] Custom Added', 1);
}

export default {
  getCompletedInstance,
  getCustom,
  getLast30,
  submitWordleResult,
  createCustom,
};
