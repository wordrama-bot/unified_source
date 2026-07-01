import { db } from '../../models';

type BanTarget = {
  banType: 'PLAYER' | 'EMAIL' | 'DISCORD' | 'IP' | 'USERNAME';
  banValue: string;
};

export async function banPlayer({
  targetPlayerId,
  adminPlayerId,
  reason,
  notes,
  expiresAt,
  requestIp,
  userAgent,
  banTargets,
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
  const cleanReason = reason.trim();

  if (!cleanReason) {
    throw new Error('Reason is required.');
  }

  const before = await db
    .from('_admin_bans')
    .select('*')
    .eq('ban_type', 'PLAYER')
    .eq('ban_value', targetPlayerId)
    .eq('is_active', true);

    const targets: BanTarget[] =
    banTargets && banTargets.length > 0
      ? banTargets
      : [{ banType: 'PLAYER', banValue: targetPlayerId }];

  const uniqueTargets = Array.from(
    new Map(
      targets
        .filter((target) => target.banValue)
        .map((target) => [
          `${target.banType}:${target.banValue}`,
          target,
        ]),
    ).values(),
  );

  const rows = uniqueTargets.map((target) => ({
    ban_type: target.banType,
    ban_value: target.banValue,
    reason: cleanReason,
    notes: notes?.trim() || null,
    created_by: adminPlayerId,
    expires_at: expiresAt || null,
    is_active: true,
    metadata: {
      source: 'admin_dashboard',
      targetPlayerId,
    },
  }));

  const { data: bans, error } = await db
    .from('_admin_bans')
    .insert(rows)
    .select('*');

  if (error) {
    console.error('[admin.bans] banPlayer error', error);
    throw new Error('Unable to ban player.');
  }

  await db.from('_moderation_actions').insert({
    action_type: 'PLAYER_BANNED',
    target_user_id: targetPlayerId,
    reason: cleanReason,
    performed_by: adminPlayerId,
    target_type: 'PLAYER',
    target_id: targetPlayerId,
    before_value: before.data ?? [],
    after_value: bans ?? [],
    request_ip: requestIp ?? null,
    user_agent: userAgent ?? null,
    metadata: {
      banIds: (bans ?? []).map((ban: any) => ban.id),
      banTargets: uniqueTargets,
      expiresAt: expiresAt || null,
    },
  });

  return bans ?? [];
}

export async function unbanPlayer({
  targetPlayerId,
  adminPlayerId,
  reason,
  requestIp,
  userAgent,
}: {
  targetPlayerId: string;
  adminPlayerId: string;
  reason: string;
  requestIp?: string;
  userAgent?: string;
}) {
  const cleanReason = reason.trim();

  if (!cleanReason) {
    throw new Error('Reason is required.');
  }

  const { data: activeBans, error: lookupError } = await db
    .from('_admin_bans')
    .select('*')
    .eq('ban_type', 'PLAYER')
    .eq('ban_value', targetPlayerId)
    .eq('is_active', true);

  if (lookupError) {
    console.error('[admin.bans] unban lookup error', lookupError);
    throw new Error('Unable to look up active bans.');
  }

  const { data: updatedBans, error } = await db
    .from('_admin_bans')
    .update({
      is_active: false,
      metadata: {
        unbannedBy: adminPlayerId,
        unbanReason: cleanReason,
        unbannedAt: new Date().toISOString(),
      },
    })
    .eq('ban_type', 'PLAYER')
    .eq('ban_value', targetPlayerId)
    .eq('is_active', true)
    .select('*');

  if (error) {
    console.error('[admin.bans] unbanPlayer error', error);
    throw new Error('Unable to unban player.');
  }

  await db.from('_moderation_actions').insert({
    action_type: 'PLAYER_UNBANNED',
    target_user_id: targetPlayerId,
    reason: cleanReason,
    performed_by: adminPlayerId,
    target_type: 'PLAYER',
    target_id: targetPlayerId,
    before_value: activeBans ?? [],
    after_value: updatedBans ?? [],
    request_ip: requestIp ?? null,
    user_agent: userAgent ?? null,
    metadata: {
      unbannedCount: updatedBans?.length ?? 0,
    },
  });

  return updatedBans ?? [];
}
