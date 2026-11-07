import { db } from '../../models';

type BanTarget = {
  banType: 'PLAYER' | 'EMAIL' | 'DISCORD' | 'IP' | 'USERNAME';
  banValue: string;
};

function validateTargets(playerId: string, targets?: BanTarget[]) {
  if (targets !== undefined && !Array.isArray(targets)) {
    throw new Error('Invalid ban targets.');
  }
  if ((targets?.length ?? 0) > 20) {
    throw new Error('Too many ban targets.');
  }
  for (const target of targets ?? []) {
    if (!target || target.banType !== 'PLAYER' || target.banValue !== playerId) {
      throw new Error('Only player-account bans are currently supported.');
    }
  }
}

async function changePlayerBan({
  action, targetPlayerId, adminPlayerId, reason, notes, expiresAt, requestIp, userAgent,
}: {
  action: 'BAN' | 'UNBAN';
  targetPlayerId: string;
  adminPlayerId: string;
  reason: string;
  notes?: string;
  expiresAt?: string | null;
  requestIp?: string;
  userAgent?: string;
}) {
  if (!reason?.trim() || reason.length > 2000) {
    throw new Error('A moderation reason of at most 2000 characters is required.');
  }
  const { data, error } = await db.rpc('admin_set_player_ban', {
    p_action: action,
    p_player: targetPlayerId,
    p_admin: adminPlayerId,
    p_reason: reason.trim(),
    p_notes: notes ?? null,
    p_expires_at: expiresAt || null,
    p_request_ip: requestIp ?? null,
    p_user_agent: userAgent ?? null,
  });
  if (error) {
    console.error('[admin.bans] atomic moderation failed', error);
    throw new Error('Unable to update player ban.');
  }
  if (!data || !Array.isArray(data.bans) || typeof data.auditId !== 'string') {
    throw new Error('Moderation transaction returned an invalid acknowledgement.');
  }
  return data.bans;
}

export async function banPlayer({
  targetPlayerId, adminPlayerId, reason, notes, expiresAt, requestIp, userAgent, banTargets,
}: {
  targetPlayerId: string;
  adminPlayerId: string;
  reason: string;
  notes?: string;
  expiresAt?: string | null;
  requestIp?: string;
  userAgent?: string;
  banTargets?: BanTarget[];
}) {
  validateTargets(targetPlayerId, banTargets);
  return changePlayerBan({
    action: 'BAN', targetPlayerId, adminPlayerId, reason, notes, expiresAt, requestIp, userAgent,
  });
}

export async function unbanPlayer({
  targetPlayerId, adminPlayerId, reason, requestIp, userAgent,
}: {
  targetPlayerId: string;
  adminPlayerId: string;
  reason: string;
  requestIp?: string;
  userAgent?: string;
}) {
  return changePlayerBan({
    action: 'UNBAN', targetPlayerId, adminPlayerId, reason, requestIp, userAgent,
  });
}
