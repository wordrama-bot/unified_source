import { db } from '../models';
import { getPlayerEntitlements } from './marketplaceV2/entitlements';
import { CATALOG } from './marketplaceV2/catalog';

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

  return data;
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
