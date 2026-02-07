import { Response } from 'express';
import { ApiRequest } from '../types';
import { 
  badRequest,
  notFoundResponse,
  successfulResponse
} from '../utils/responses';

import referralsService from '../services/referrals';

async function checkValidity(req: ApiRequest, res: Response) {
  //@ts-ignore
  const referral = await referralsService.getReferralByCode(req.params.referralCode);
  if (!referral) return notFoundResponse(req, res);

  return successfulResponse(req, res, referral, 'Referral Found', 1);
}

export default {
  checkValidity
};
