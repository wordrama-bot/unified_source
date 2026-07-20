import { db } from '../../models';

export async function getPlayerIdentityReport(playerId: string) {
  const { data, error } = await db.rpc(
    'admin_get_player_identity',
    {
      p_player_id: playerId,
      p_ip_limit: 10,
      p_related_account_limit: 100,
    },
  );

  if (error) {
    console.error(
      '[admin.playerIdentity] getPlayerIdentityReport',
      error,
    );

    throw new Error('Unable to load player identity report.');
  }

  return data;
}
