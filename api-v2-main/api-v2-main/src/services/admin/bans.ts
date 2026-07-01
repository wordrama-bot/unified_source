import { db } from '../../models';

export async function banPlayer({
  targetPlayerId,
  adminPlayerId,
  reason,
  notes,
  expiresAt,
  requestIp,
  userAgent,
}: {
  targetPlayerId: string;
  adminPlayerId: string;
  reason: string;
  notes?: string;
  expiresAt?: string | null;
  requestIp?: string;
  userAgent?: string;
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

  const { data: ban, error } = await db
    .from('_admin_bans')
    .insert({
      ban_type: 'PLAYER',
      ban_value: targetPlayerId,
      reason: cleanReason,
      notes: notes?.trim() || null,
      created_by: adminPlayerId,
      expires_at: expiresAt || null,
      is_active: true,
      metadata: {
        source: 'admin_dashboard',
      },
    })
    .select('*')
    .maybeSingle();

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
    after_value: ban,
    request_ip: requestIp ?? null,
    user_agent: userAgent ?? null,
    metadata: {
      banId: ban?.id,
      expiresAt: expiresAt || null,
    },
  });

  return ban;
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
