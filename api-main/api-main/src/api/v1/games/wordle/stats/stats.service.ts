import { sendMessage } from 'src/websocket';
import { supabase } from '../../../../..';

import { WordleStat } from './stats.types';

export async function getStat(
  userId: string,
  gameModeId: number,
  wordLength: string = 'FIVE'
) {
  const stats = await supabase.from('wordle_stats')
    .select()
    .eq('user_id', userId)
    .eq('gamemode_id', gameModeId)
    .eq('word_length', wordLength)
    .limit(1)
    .single();
  
  const { data } = stats;

  if (!data) return {
    ...stats,
    status: 404,
    statusText: 'Not Found'
  };

  return {
    ...stats,
    count: 1
  };
};

export async function getStats(
  userId: string,
  gameModeId: number
) {
  const stats = await supabase.from('wordle_stats')
    .select()
    .eq('user_id', userId)
    .eq('gamemode_id', gameModeId)
  
  const { data } = stats;

  if (!data) return {
    ...stats,
    status: 404,
    statusText: 'Not Found'
  };

  return stats;
};

export async function getTotalGamesPlayed(
  userId: string
) {
  const stats = await supabase.from('wordle_stats')
    .select('total_games, games_failed')
    .eq('user_id', userId)
  
  const { data } = stats;
  
  if (!data) return {
    ...stats,
    status: 404,
    statusText: 'Not Found'
  };

  const totalGames = data.reduce((runningTotal, { total_games }) => {
    return runningTotal + total_games;
  }, 0);

  const totalGamesLost = data.reduce((runningTotal, { games_failed }) => {
    return runningTotal + games_failed;
  }, 0);

  const totalGamesWon = totalGames - totalGamesLost;

  return {
    ...stats,
    data: {
      games_played: totalGames,
      games_lost: totalGamesLost,
      games_won: totalGamesWon
    }
  };
}

export async function submitStat(
  userId: string,
  gameModeId: number,
  gamesFailed: number,
  currentStreak: number,
  bestStreak: number,
  successRate: number,
  totalGames: number,
  winDistribution: number[],
  wordLength: string
) {
  try {
    const stats = await getStat(userId, gameModeId, wordLength);
    const { data } = stats;

    const gamesWon = totalGames - gamesFailed;
  
    const stat = {}
    if (data.games_won < gamesWon) {
      stat['games_won'] = gamesWon;
    }

    if (data.games_failed < gamesFailed) {
      stat['games_failed'] = gamesFailed;
    }

    if (data.current_streak < currentStreak) {
      stat['current_streak'] = currentStreak;
    }

    if (data.best_streak < bestStreak) {
      stat['best_streak'] = bestStreak;
    }

    if (data.success_rate < successRate) {
      stat['success_rate'] = successRate;
    }

    if (data.total_games < totalGames) {
      stat['total_games'] = totalGames;
    }

    if (data.win_distribution !== winDistribution) {
      stat['win_distribution'] = winDistribution;
    }
    console.log('Updating', stats);
    if (Object.keys(stat).length === 0) return {
      ...stats,
      count: 1 
    };

    const updatedStats = await supabase.from('wordle_stats')
      .update(stat)
      .eq('id', data.id)
      .eq('user_id', userId)
      .eq('word_length', wordLength)
      .select()
      .single();

    if (!updatedStats.data) return {
      status: 404,
      statusText: 'Not Found'
    };

    return {
      ...updatedStats,
      count: 1 
    };
  } catch(err) {
    console.error(err);
    return {
      status: 500,
      statusText: 'Internal Server Error'
    };
  }
};
