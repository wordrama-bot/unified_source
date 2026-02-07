import { supabase } from '../../../../';

export async function getTop10Balances() {
  const leaderboard = await supabase.from('ledger')
    .select()
    .order('coin_count', { ascending: false })
    .limit(10)
  
  const { data } = leaderboard;

  if (!data) return {
    ...leaderboard,
    status: 404,
    statusText: 'Not Found'
  };

  const saturatedLeaderboard = await Promise.all(leaderboard.data.map(async player => {
    const playerIdentity = await supabase.auth.admin.getUserById(player.user_id);
    if (playerIdentity?.data?.user?.app_metadata?.provider === 'discord') {
      return { 
        ...player, 
        username: playerIdentity.data.user.user_metadata.full_name,
        profileImage: playerIdentity.data.user.user_metadata.avatar_url 
      }
    } else if (
      playerIdentity?.data?.user?.app_metadata?.provider === 'email'
    ) {
      return {
        ...player,
        username: playerIdentity.data.user.email.split('@')[0],
        profileImage: '/default.jpeg'
      }
    }
    
    return player;
  }));

  return { 
    status: leaderboard.status, 
    statusText: leaderboard.statusText, 
    data: saturatedLeaderboard,
    error: leaderboard.error
  };
};

// export async function getTop10BalancesWithMe(userId) {
//   const leaderboard = await supabase.from('ledger')
//     .select()
//     .order('coin_count', { ascending: false })
//     .limit(9);
//   const myPosition = await supabase.from('ledger')
//     .select()
//     .eq('user_id', userId)
//     .limit(1)
//     .single();
  
//   const { data } = leaderboard;
//   const { data: myData } = myPosition;

//   if (!data) return {
//     ...leaderboard,
//     status: 404,
//     statusText: 'Not Found'
//   };

//   return leaderboard;
// };