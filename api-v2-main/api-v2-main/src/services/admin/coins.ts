import { db } from '../../models';

export async function grantPlayerCoins({
  targetPlayerId,
  adminPlayerId,
  amount,
  reason,
  requestId,
  requestIp,
  userAgent,
}: {
  targetPlayerId: string;
  adminPlayerId: string;
  amount: number;
  reason: string;
  requestId: string;
  requestIp?: string;
  userAgent?: string;
}) {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuid.test(requestId) || !uuid.test(targetPlayerId) || !uuid.test(adminPlayerId)) {
    throw new Error('Valid player, administrator, and request IDs are required.');
  }
  if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 1000000) {
    throw new Error('Amount must be between 1 and 1,000,000 coins.');
  }
  if (!reason?.trim() || reason.length > 2000) {
    throw new Error('A reason of up to 2,000 characters is required.');
  }

  // This RPC must be installed and explicitly enabled only after staging tests.
  // Never fall back to direct table writes if it is unavailable.
  const { data, error } = await db.rpc('admin_grant_live_coins', {
    p_request_id: requestId,
    p_player: targetPlayerId,
    p_admin: adminPlayerId,
    p_amount: amount,
    p_reason: reason.trim(),
    p_request_ip: requestIp ?? null,
    p_user_agent: userAgent ?? null,
  });
  if (error) {
    console.error('[admin.coins] atomic grant failed', error);
    throw new Error('Unable to grant coins atomically.');
  }
  if (!data || typeof data.balanceAfter !== 'number' ||
      typeof data.balanceBefore !== 'number' ||
      typeof data.moderationActionId !== 'string') {
    throw new Error('Coin grant response could not be verified.');
  }
  return data;
}
