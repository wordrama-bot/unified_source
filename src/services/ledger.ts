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
  const { data: current, error: currentError } = await db
    .from('_ledger')
    .select('coin_balance')
    .eq('player', userId)
    .maybeSingle();

  if (currentError) {
    console.error(currentError);
    return {};
  }

  let balance = current.coin_balance;
  if (direction === 'up') {
    balance += amount;
  } else if (direction === 'down') {
    balance -= amount;
  }

  const { data, error } = await db
    .from('_ledger')
    .update({
      coin_balance: balance,
    })
    .select('coin_balance')
    .eq('player', userId);

  if (error) {
    console.error(error);
    return {};
  }

  return { ...data };
}

export default {
  getBalance,
  changeBalance,
};
