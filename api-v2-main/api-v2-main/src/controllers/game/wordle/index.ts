import { Response } from 'express';
import { ApiRequest } from '../../../types';
import {
  type AddGameResult,
  addGameResult as addGameResultSchema,
  type CreateCustom,
  createCustom as createCustomSchema,
} from '../../../schema/game/wordle';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../../../utils/responses';

import gameService from '../../../services/game/wordle';
import { checkIfValidWordPack } from './words';

async function getCustom(req: ApiRequest, res: Response) {
  const shareCode = req.params.shareCode;
  if (!shareCode) return badRequest(req, res, 'No share code provided');

  const custom = await gameService.getCustomByShareCode(shareCode);
  if (custom?.shareCode !== shareCode) return notFoundResponse(req, res);

  return successfulResponse(req, res, custom, '[Wordle] Custom Game Found', 1);
}

async function getLast30(req: ApiRequest, res: Response) {
  const wordPack = req.params.wordPack;
  if (!wordPack) return badRequest(req, res, 'No wordPack provided');

  const isValidWordPack = checkIfValidWordPack(wordPack);
  if (!isValidWordPack) return badRequest(req, res, 'Invalid Word Pack');

  const last30 = await gameService.getLast30(req.userId, wordPack);
  if (!last30 || last30.length < 1) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    last30,
    '[Wordle] Games Found',
    last30.length || 0,
  );
}

async function submitWordleResult(req: ApiRequest, res: Response) {
  const validated: AddGameResult = addGameResultSchema.safeParse(req.body);
  if (!validated.success) return badRequest(req, res, validated.error.message);
  else if (Object.keys(validated.data).length === 0)
    return badRequest(req, res, 'No fields to update');

  const result = await gameService.submitWordleResult(
    req.userId,
    validated.data,
  );
  if (result?.id != req.userId) return notFoundResponse(req, res);

  return successfulResponse(req, res, result, '[Wordle] Result Added', 1);
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
  getCustom,
  getLast30,
  submitWordleResult,
  createCustom,
};
