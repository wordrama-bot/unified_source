import moment from 'moment';
import { supabase } from '../../../..';

// Service
import { updateBalance } from '../coins/coins.service';

type Reward = {
  id: number
  created_at: any
  prize_name: string
  is_coin_prize: boolean
  coin_count: number
}

async function getRandomPrize() {
  const prizes: { data: Reward[] } = await supabase.from('daily_spin_prizes')
  .select()
  .eq('is_coin_prize', true)

  if (!prizes.data) throw new Error('Could not find prizes');

  const sudoRandomNumber = Math.floor((Math.random() * 5));

  const reward: Reward = prizes.data[sudoRandomNumber];

  return { 
    prizes: prizes.data, 
    prizeIndex: sudoRandomNumber,
    reward
  };
}

export async function getDailySpin(
  userId: string
) {
  const dailySpin = await supabase.from('daily_spin')
    .select()
    .eq('user_id', userId)
    .limit(1)
    .single();
  
  const { data } = dailySpin;

  if (!data) return {
    ...dailySpin,
    status: 404,
    statusText: 'Not Found'
  };

  return {
    ...dailySpin,
    count: 1 
  };
}

export async function updateDailySpin(
  userId: string, 
  isClaimed: boolean = false,
  isCoinPrize: boolean = false,
  prizeCoinCount: number = 0
) {
  const dailySpin = await supabase.from('daily_spin')
    .select()
    .eq('user_id', userId)
    .limit(1)
    .single();
  
  const { data } = dailySpin;

  if (!data) return {
    status: 404,
    statusText: 'Not Found'
  };

  const endOfDayEpoch = moment().endOf('day').unix();
  const updatedDailySpin = await supabase.from('daily_spin')
    .update({ 
      is_claimed: isClaimed,
      prize_coin_count: prizeCoinCount,
      last_spin: endOfDayEpoch,
      is_coin_prize: isCoinPrize
    })
    .eq('id', data.id) 
    .eq('user_id', userId)
    .select()
    .single();

  if (!updatedDailySpin.data) return {
    status: 404,
    statusText: 'Not Found'
  };

  return {
    ...updatedDailySpin,
    count: 1 
  };
};

export async function spin(
  userId: string
) {
  const { data, status, statusText } = await getDailySpin(userId);

  const currentEpoch = Math.floor(Date.now() / 1000);
  if ( 
    data && data.is_claimed && currentEpoch > data.last_spin
  ) return {
    status: 400,
    statusText: 'Not enough time has passed. Come back later',
    data
  } 
  
  const { prizeIndex, prizes, reward } = await getRandomPrize();
  if (
    data && 
    !data.is_claimed &&
    currentEpoch < data.last_spin
  ) return {
    status,
    statusText,
    data,
    prizeIndex,
    prizes
  }

  const updatedDailySpin = await updateDailySpin(
    userId, 
    false,
    reward.is_coin_prize,
    reward.coin_count || 0
  );

  return { ...updatedDailySpin, prizeIndex, prizes };
};

export async function claimSpin(
  userId: string
) {
  const { data, status, statusText } = await getDailySpin(userId);

  if (!data) return {
    status: 404,
    statusText: 'Not Found'
  }

  if (
    data.is_claimed
  ) {
    return {
      status: 400,
      statusText: 'Not enough time has passed. Come back later',
      data
    }
  }

  let updatedBalance = {};
  if (data && data.is_coin_prize) {
    updatedBalance = await updateBalance(
      userId,
      data.prize_coin_count,
      'increment'
    );
  } 

  const updatedDailySpin = await updateDailySpin(
    userId,
    true,
    data.is_coin_prize,
    data.prize_coin_count
  );
  return { status, statusText, data, ...updatedDailySpin, updatedBalance };
};