import * as changeKeys from 'change-case/keys';
import { db } from '../models';

async function getReferralByCode(referralCode: string) {
  const { data, error } = await db
    .from('_referral_codes')
    .select(
      `
        id,
        referral_code,
        _players (
          id,
          display_name,
          profile_image,
          _levels (
            level,
            xp
          )
        )
      `,
    )
    .eq('referral_code', referralCode)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

export default {
  getReferralByCode,
};
