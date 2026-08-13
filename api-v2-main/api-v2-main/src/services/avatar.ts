import { db } from '../models';
import { getPlayerEntitlements } from './marketplaceV2/entitlements';
import { CATALOG } from './marketplaceV2/catalog';

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
  avatarStyleKey: string | null,
) {
  // Allow unequipping
  if (avatarStyleKey !== null) {
    const entitlements = await getPlayerEntitlements(playerId);

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

  const { data, error } = await db
    .from('_player_avatar')
    .upsert(
      {
        player_id: playerId,
        equipped_avatar_style_key: avatarStyleKey,
      },
      {
        onConflict: 'player_id',
      },
    )
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
