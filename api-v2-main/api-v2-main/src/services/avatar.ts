import { db } from '../models';
import { getPlayerEntitlements } from './marketplaceV2/entitlements';

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

    const ownsFrame = entitlements.some(
      (entitlement: any) =>
        entitlement.status === 'ACTIVE' &&
        entitlement.entitlement_type === 'AVATAR' &&
        entitlement.entitlement_key === avatarStyleKey,
    );

    if (!ownsFrame) {
      throw new Error('Player does not own this avatar frame.');
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
