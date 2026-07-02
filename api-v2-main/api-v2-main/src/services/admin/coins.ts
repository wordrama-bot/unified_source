import { randomUUID } from 'crypto';
import { db } from '../../models';

export async function grantPlayerCoins({
  targetPlayerId,
  adminPlayerId,
  amount,
  reason,
  requestIp,
  userAgent,
}: {
  targetPlayerId: string;
  adminPlayerId: string;
  amount: number;
  reason: string;
  requestIp?: string;
  userAgent?: string;
}) {
  const cleanReason = reason.trim();

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Amount must be a positive whole number.');
  }

  if (!cleanReason) {
    throw new Error('Reason is required.');
  }

  const currencyCode = 'COIN';

  const { data: currentBalance, error: balanceError } = await db
    .from('_player_coin_balances')
    .select('*')
    .eq('player_id', targetPlayerId)
    .eq('currency_code', currencyCode)
    .maybeSingle();

  if (balanceError) {
    console.error('[admin.coins] balance lookup error', balanceError);
    throw new Error('Unable to load coin balance.');
  }

  const balanceBefore = currentBalance?.available_balance ?? 0;
  const balanceAfter = balanceBefore + amount;

  let balanceResult;

  if (currentBalance) {
    balanceResult = await db
      .from('_player_coin_balances')
      .update({
        available_balance: balanceAfter,
        lifetime_earned: (currentBalance.lifetime_earned ?? 0) + amount,
        version: (currentBalance.version ?? 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentBalance.id)
      .select('*')
      .maybeSingle();
  } else {
    balanceResult = await db
      .from('_player_coin_balances')
      .insert({
        player_id: targetPlayerId,
        currency_code: currencyCode,
        available_balance: balanceAfter,
        lifetime_earned: amount,
        lifetime_spent: 0,
        version: 1,
      })
      .select('*')
      .maybeSingle();
  }

  if (balanceResult.error) {
    console.error('[admin.coins] balance update error', balanceResult.error);
    throw new Error('Unable to update coin balance.');
  }

  const ledgerIdempotencyKey = `admin-grant:${randomUUID()}`;

  const { data: ledgerEntry, error: ledgerError } = await db
    .from('_coin_ledger')
    .insert({
      player_id: targetPlayerId,
      currency_code: currencyCode,
      direction: 'CREDIT',
      amount,
      entry_type: 'ADMIN_GRANT',
      status: 'POSTED',
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      idempotency_key: ledgerIdempotencyKey,
      metadata: {
        reason: cleanReason,
        adminPlayerId,
      },
    })
    .select('*')
    .maybeSingle();

  if (ledgerError) {
    console.error('[admin.coins] ledger insert error', ledgerError);
    throw new Error('Coin balance updated but ledger insert failed.');
  }

  await db.from('_moderation_actions').insert({
    action_type: 'COINS_GRANTED',
    target_user_id: targetPlayerId,
    reason: cleanReason,
    performed_by: adminPlayerId,
    target_type: 'PLAYER',
    target_id: targetPlayerId,
    before_value: {
      available_balance: balanceBefore,
    },
    after_value: {
      available_balance: balanceAfter,
      amount_granted: amount,
      ledger_id: ledgerEntry?.id,
    },
    request_ip: requestIp ?? null,
    user_agent: userAgent ?? null,
    metadata: {
      currencyCode,
      ledgerIdempotencyKey,
    },
  });

  return {
    balance: balanceResult.data,
    ledgerEntry,
  };
}
