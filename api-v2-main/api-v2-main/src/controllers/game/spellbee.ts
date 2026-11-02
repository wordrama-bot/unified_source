import type { Response } from 'express';
import type { ApiRequest } from '../../types';
import { addGameResult } from '../../schema/game/spellbee';
import gameService from '../../services/game/spellbee';

async function submitSpellbeeResult(req: ApiRequest, res: Response) {
  const validated = addGameResult.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({ status: 400, count: 0, data: {}, message: 'Invalid Spellbee result' });
  }
  const result = await gameService.submitSpellbeeResult(req.userId, validated.data);
  return res.status(503).json({ status: 503, count: 0, data: {}, message: result.error });
}

export default { submitSpellbeeResult };
