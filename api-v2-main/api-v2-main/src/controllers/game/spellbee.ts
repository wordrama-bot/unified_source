import { Response } from 'express';
import { ApiRequest } from '../../types';
import {
  type AddGameResult,
  addGameResult as addGameResultSchema,
} from '../../schema/game/spellbee';
import { 
  badRequest,
  notFoundResponse,
  successfulResponse
} from '../../utils/responses';

import gameService from '../../services/game/spellbee';

async function submitSpellbeeResult(req: ApiRequest, res: Response) {
  const validated: AddGameResult = addGameResultSchema.safeParse(req.body);
  if (!validated.success) return badRequest(req, res, validated.error.message);
  else if (Object.keys(validated.data).length === 0) return badRequest(req, res, 'No fields to update');

  //@ts-ignore
  const result = await gameService.submitSpellbeeResult(
    req.userId, 
    validated.data
  );
  if (
    result?.id != req.userId
  ) return notFoundResponse(req, res);

  return successfulResponse(req, res, result, '[Spellbee] Result Added', 1);
}

export default {
  submitSpellbeeResult
};
