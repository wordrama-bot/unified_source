import { db } from '../../models';

export class PlayerIdentityReportError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'PlayerIdentityReportError';
    this.code = code;
  }
}

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
      {
        code: error.code,
        message: error.message,
      },
    );

    throw new PlayerIdentityReportError(
      'Unable to load player identity report.',
      error.code,
    );
  }

  return data;
}
