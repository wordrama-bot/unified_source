import { db } from '../models';

async function getBalance(userId: string) {
  const { data, error } = await db
    .from('_ledger')
    .select('coin_balance')
    .eq('player', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return {
    coinBalance: data.coin_balance || 0,
  };
}

async function changeBalance(
  userId: string,
  direction: string = 'up',
  amount: number,
) {
  if (!Number.isSafeInteger(amount) || amount < 0 || !['up', 'down'].includes(direction)) {
    throw new Error('Invalid balance change');
  }
  const { data, error } = await db.rpc('wordrama_change_coin_balance', {
    p_player: userId, p_delta: direction === 'up' ? amount : -amount,
  });
  if (error || !Number.isFinite(data?.coinBalance)) {
    throw new Error('Unable to change coin balance');
  }
  return data;
}

export default {
  getBalance,
  changeBalance,
};
