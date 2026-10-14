import { db } from '../models';
import { isWordramaOwner } from '../config/owner';
import { getPlayerEntitlements } from './marketplaceV2/entitlements';

export async function getAuthorizedAvatarFrameKey(
  playerId: string,
  frameKey: string | null | undefined,
): Promise<string | null> {
  if (!frameKey) return null;

  // The Owner frame is exclusive to the configured owner account.
  if (frameKey === 'FRAME:OWNER' && !isWordramaOwner(playerId)) {
    return null;
  }

  // Every frame must have a currently valid entitlement.
  let entitlements;

  try {
    entitlements = await getPlayerEntitlements(playerId);
  } catch (error) {
    console.error(
      '[avatarFrameAccess] Unable to verify frame entitlements:',
      error,
    );

    return null;
  }

  if (!Array.isArray(entitlements)) {
    return null;
  }

  const hasEntitlement = entitlements.some(
    (entitlement: any) => entitlement.entitlement_key === frameKey,
  );

  if (!hasEntitlement) return null;

  // Subscription frames additionally require the matching live plan.
  const requiredPlan =
    frameKey === 'FRAME:PLUS'
      ? 'PLUS'
      : frameKey === 'FRAME:CREATOR'
        ? 'CREATOR'
        : null;

    if (requiredPlan) {
      try {
        const { data: subscription, error } = await db
          .from('_player_subscriptions')
          .select('id')
          .eq('player_id', playerId)
          .eq('subscription_key', requiredPlan)
          .in('status', ['TRIALING', 'ACTIVE', 'PAST_DUE'])
          .gt('current_period_end', new Date().toISOString())
          .limit(1)
          .maybeSingle();

        if (error || !subscription) return null;
      } catch (error) {
        console.error(
          '[avatarFrameAccess] Unable to verify subscription:',
          error,
        );

        return null;
      }
    }

  return frameKey;
}
