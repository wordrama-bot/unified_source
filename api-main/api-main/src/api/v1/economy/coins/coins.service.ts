import { supabase } from '../../../../';
import { sendMessage } from '../../../../websocket';

export async function getCoinBalance(
  userId: string
) {
  const balance = await supabase.from('ledger')
    .select()
    .eq('user_id', userId)
    .limit(1)
    .single();
  
  const { data } = balance;

  if (!data) return {
    ...balance,
    status: 404,
    statusText: 'Not Found'
  };

  return {
    ...balance,
    count: 1 
  };
}

export async function updateBalance(
  userId: string, 
  changeBy: number,
  direction: string
) {
  const currentBalance = await supabase.from('ledger')
    .select()
    .eq('user_id', userId)
    .limit(1)
    .single();
  
  const { data } = currentBalance;

  if (!data) return {
    status: 404,
    statusText: 'Not Found'
  };

  let newBalance = data.coin_count;
  if (direction === 'increment') {
    newBalance = data.coin_count + changeBy;
  }
  else if (direction === 'decrement') {
    newBalance = data.coin_count - changeBy;
  }

  //const endOfDayEpoch = moment().endOf('day').unix();
  const updatedBalance = await supabase.from('ledger')
    .update({ 
      coin_count: newBalance
    })
    .eq('id', data.id) 
    .eq('user_id', userId)  
    .select()
    .single();

  sendMessage(userId, 'balance', newBalance);

  if (!updatedBalance.data) return {
    status: 404,
    statusText: 'Not Found'
  };

  return {
    ...updatedBalance,
    count: 1 
  };
};

export async function transferCoins(
  senderUserId: string,
  receiverUserId: string, 
  coins: number
) {
  const senderCurrentBalance = await supabase.from('ledger')
    .select()
    .eq('user_id', senderUserId)
    .limit(1)
    .single();

  if (!senderCurrentBalance.data) return {
    status: 404,
    statusText: 'Not Found'
  };

  if (senderCurrentBalance.data.coin_count < coins) return {
    status: 400,
    statusText: 'Insufficient Funds'
  };

  const senderNewBalance = await updateBalance(
    senderUserId, 
    coins, 
    'decrement'
  );

  const receiverNewBalance = await updateBalance(
    receiverUserId, 
    coins, 
    'increment'
  );

  if (!senderNewBalance || !receiverNewBalance) return {
    status: 400,
    statusText: 'An error occurred during the transfer'
  };

  return {
    data: {
      sender: {
        status: senderNewBalance.status,
        statusText: senderNewBalance.statusText,
      },
      receiver: {
        status: receiverNewBalance.status,
        statusText: receiverNewBalance.statusText,
      },
    },
    status: senderNewBalance.status,
    statusText: senderNewBalance.statusText,
    count: 2 
  };
};
