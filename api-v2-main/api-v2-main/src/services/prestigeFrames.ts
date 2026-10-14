import { db } from '../models';
import { grantEntitlement } from './marketplaceV2/entitlements';

export const PRESTIGE_FRAME_REWARDS = [
  { prestige: 1, entitlementKey: 'FRAME:BRONZE' },
  { prestige: 3, entitlementKey: 'FRAME:SILVER' },
  { prestige: 5, entitlementKey: 'FRAME:GOLD' },
  { prestige: 10, entitlementKey: 'FRAME:PLATINUM' },
  { prestige: 20, entitlementKey: 'FRAME:DIAMOND' },
] as const;

export async function awardPrestigeFrames(
  playerId: string,
  prestige: number,
) {
  const eligibleRewards = PRESTIGE_FRAME_REWARDS.filter(
    (reward) => prestige >= reward.prestige,
  );

  if (eligibleRewards.length === 0) {
    return;
  }

  const { data: existing, error } = await db
    .from('_player_entitlements')
    .select('entitlement_key')
    .eq('player_id', playerId)
    .eq('status', 'ACTIVE')
    .is('revoked_at', null)
    .is('expires_at', null)
    .in(
      'entitlement_key',
      eligibleRewards.map((reward) => reward.entitlementKey),
    );

  if (error) {
    throw error;
  }

  const ownedKeys = new Set(
    (existing ?? []).map((row) => row.entitlement_key),
  );

  for (const reward of eligibleRewards) {
    if (ownedKeys.has(reward.entitlementKey)) {
      continue;
    }

    await grantEntitlement({
      playerId,
      entitlementKey: reward.entitlementKey,
      entitlementType: 'AVATAR',
      sourceType: 'ACHIEVEMENT',
      metadata: {
        source: 'prestige_milestone',
        requiredPrestige: reward.prestige,
      },
    });
  }
}
