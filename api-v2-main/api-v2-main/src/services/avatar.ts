import { db } from '../models';
import { getPlayerEntitlements } from './marketplaceV2/entitlements';
import { CATALOG } from './marketplaceV2/catalog';
import { isWordramaOwner } from '../config/owner';
import { getCurrentSubscription } from './marketplaceV2/billing';
import { getAuthorizedAvatarFrameKey } from './avatarFrameAccess';

type AvatarEquipmentUpdate = {
  avatarStyleKey?: string | null;
  avatarFrameKey?: string | null;
};

async function getPlayerAvatar(playerId: string) {
  const { data, error } = await db
    .from('_player_avatar')
    .select('*')
    .eq('player_id', playerId)
    .maybeSingle();

    if (error) {
    console.error(error);
    return null;
  }

  if (!data) return null;

  const authorizedFrameKey = await getAuthorizedAvatarFrameKey(
    playerId,
    data.equipped_avatar_frame_key,
  );

  return {
    ...data,
    equipped_avatar_frame_key: authorizedFrameKey,
  };
}

async function updatePlayerAvatar(
  playerId: string,
  {
    avatarStyleKey,
    avatarFrameKey,
  }: AvatarEquipmentUpdate,
) {

  if (
    avatarStyleKey === undefined &&
    avatarFrameKey === undefined
  ) {
    throw new Error('No avatar equipment update provided.');
  }

  const entitlements = await getPlayerEntitlements(playerId);

  if (avatarStyleKey !== undefined && avatarStyleKey !== null) {
    const catalogItem = CATALOG.find(
      (item) =>
        item.entitlementKey === avatarStyleKey &&
        item.entitlementType === 'AVATAR_STYLE',
    );

    if (!catalogItem) {
      throw new Error('Invalid avatar style.');
    }

    if (
      avatarFrameKey === 'FRAME:OWNER' &&
      !isWordramaOwner(playerId)
    ) {
      throw new Error('Owner frame is restricted to the Wordrama owner.');
    }

    if (
      avatarFrameKey === 'FRAME:PLUS' ||
      avatarFrameKey === 'FRAME:CREATOR'
    ) {
      const result = await getCurrentSubscription({ playerId });

      const requiredPlan =
        avatarFrameKey === 'FRAME:PLUS' ? 'PLUS' : 'CREATOR';

      if (
        result.error ||
        result.subscription?.subscriptionKey !== requiredPlan
      ) {
        throw new Error(
          `${requiredPlan} frame requires an active ${requiredPlan} subscription.`,
        );
      }
    }

    const ownsAvatarStyle = entitlements.some(
      (entitlement: any) =>
        entitlement.entitlement_key === avatarStyleKey,
    );

    if (!ownsAvatarStyle) {
      throw new Error('Player does not own this avatar style.');
    }
  }

  if (avatarFrameKey !== undefined && avatarFrameKey !== null) {
    const catalogItem = CATALOG.find(
      (item) =>
        item.entitlementKey === avatarFrameKey &&
        item.entitlementType === 'AVATAR' &&
        item.entitlementKey.startsWith('FRAME:'),
    );

    if (!catalogItem) {
      throw new Error('Invalid avatar frame.');
    }

    const ownsAvatarFrame = entitlements.some(
      (entitlement: any) =>
        entitlement.entitlement_key === avatarFrameKey,
    );

    if (!ownsAvatarFrame) {
      throw new Error('Player does not own this avatar frame.');
    }
  }

  const update: Record<string, any> = {
    player_id: playerId,
  };

  if (avatarStyleKey !== undefined) {
    update.equipped_avatar_style_key = avatarStyleKey;
  }

  if (avatarFrameKey !== undefined) {
    update.equipped_avatar_frame_key = avatarFrameKey;
  }

  const { data, error } = await db
    .from('_player_avatar')
    .upsert(update, {
      onConflict: 'player_id',
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export default {
  getPlayerAvatar,
  updatePlayerAvatar,
};
