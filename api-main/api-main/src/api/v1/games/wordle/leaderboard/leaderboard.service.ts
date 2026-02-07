import { redisClient, supabase } from '../../../../../';
import { getPublicProfile } from '../../../auth/account/account.service';

async function getLeaderboardLength(wordLength: string = 'FIVE') {
  if (process.env.CACHE_ENABLED === 'true') {
    const cache = await redisClient.get(`leaderboardLength_${wordLength}`);
    if (cache) return Number(cache);
  }

  const { count, error } = await supabase.from('wordle_stats')
    .select('*', { count: 'exact', head: true })
    .eq('gamemode_id', 1)
    .eq('word_length', wordLength)
    .gt('total_games', 0);

  if (error) {
    console.error(error);
    return 0;
  }

  if (process.env.CACHE_ENABLED === 'true') {
    await redisClient.setEx(`leaderboardLength_${wordLength}`, 1800, `${count}`);
  }

  return count;
}

export async function getTop15Players(
  wordLength: string = 'FIVE',
  startIndex: number = 0, 
  count: number = 15
) {
  if (process.env.CACHE_ENABLED === 'true') {
    const cache = await redisClient.get(`leaderboard_${wordLength}_${startIndex}_${count}`);
    if (cache) return JSON.parse(cache);
  }

  const leaderboardLength = await getLeaderboardLength(wordLength);

  if (startIndex > leaderboardLength) return {
    status: 404,
    statusText: 'Not Found'
  }

  const endIndex = startIndex + count - 1;
  const { data, status, statusText, error } = await supabase.from('wordle_stats')
    .select('user_id, games_won, games_failed, current_streak, best_streak, success_rate, total_games, win_distribution, gamemode_id, word_length')
    .eq('gamemode_id', 1)
    .eq('word_length', wordLength)
    .gt('total_games', 0)
    .order('current_streak', { ascending: false })
    .range(startIndex, endIndex);

    if (!data) return {
      status: 404,
      statusText: 'Not Found',
      metadata: {
        leaderboardLength: 0
      }
    };

  const saturatedLeaderboard = await Promise.all(data.map(async player => {
    const playerProfile: any = await getPublicProfile(player.user_id);
  
    return {
      ...player,
      username: playerProfile?.data?.username,
      profileImage: playerProfile?.data?.profile_image,
    }
  }));

  if (process.env.CACHE_ENABLED === 'true') {
    await redisClient.setEx(
      `leaderboard_${wordLength}_${startIndex}_${count}`, 
      900, 
      JSON.stringify({
        status,
        statusText,
        data: saturatedLeaderboard,
        count: saturatedLeaderboard.length,
        metadata: {
          leaderboardLength
        }
      })
    );
  }

  return { 
    status,
    statusText,
    data: saturatedLeaderboard,
    count: saturatedLeaderboard.length,
    metadata: {
      leaderboardLength
    }
  };
};