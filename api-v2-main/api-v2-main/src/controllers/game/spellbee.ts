import type { Response } from 'express';
import type { ApiRequest } from '../../types';

async function submitSpellbeeResult(_req: ApiRequest, res: Response) {
  // Spellbee is retired. Never parse results, persist stats, or award rewards.
  return res.status(410).json({
    status: 410, count: 0, data: {}, message: 'Spellbee has been retired',
  });
}

export default { submitSpellbeeResult };
