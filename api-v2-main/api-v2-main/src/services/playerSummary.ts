import { db } from '../models';
import playerService from './player';
import leaderboardService from './leaderboard';

async function getAllTimeStats(playerId: string) {
  const { count: gamesPlayed, error: gamesError } = await db
    .from('_wordle_game_result')
    .select('*', { count: 'exact', head: true })
    .eq('player', playerId);

  if (gamesError) {
    console.error('[playerSummary] getAllTimeStats games error:', gamesError);
  }

  const { count: gamesWon, error: winsError } = await db
    .from('_wordle_game_result')
    .select('*', { count: 'exact', head: true })
    .eq('player', playerId)
    .eq('game_was_won', true);

  if (winsError) {
    console.error('[playerSummary] getAllTimeStats wins error:', winsError);
  }

  const totalGames = gamesPlayed || 0;
  const totalWins = gamesWon || 0;
  const winPercentage =
    totalGames > 0 ? Number(((totalWins / totalGames) * 100).toFixed(2)) : 0;

  return {
    gamesPlayed: totalGames,
    gamesWon: totalWins,
    gamesLost: Math.max(0, totalGames - totalWins),
    winPercentage,
  };
}

async function getGuessDistribution(playerId: string) {
  const { data, error } = await db
    .from('_wordle_game_result')
    .select('guess_count, game_was_won')
    .eq('player', playerId);

  if (error) {
    console.error('[playerSummary] getGuessDistribution error:', error);
    return {
      gamesWonIn_1: 0,
      gamesWonIn_2: 0,
      gamesWonIn_3: 0,
      gamesWonIn_4: 0,
      gamesWonIn_5: 0,
      gamesWonIn_6: 0,
    };
  }

  const distribution = {
    gamesWonIn_1: 0,
    gamesWonIn_2: 0,
    gamesWonIn_3: 0,
    gamesWonIn_4: 0,
    gamesWonIn_5: 0,
    gamesWonIn_6: 0,
  };

  for (const row of data || []) {
    if (!row?.game_was_won) continue;

    switch (row.guess_count) {
      case 1:
        distribution.gamesWonIn_1++;
        break;
      case 2:
        distribution.gamesWonIn_2++;
        break;
      case 3:
        distribution.gamesWonIn_3++;
        break;
      case 4:
        distribution.gamesWonIn_4++;
        break;
      case 5:
        distribution.gamesWonIn_5++;
        break;
      case 6:
        distribution.gamesWonIn_6++;
        break;
    }
  }

  return distribution;
}

async function getStreakSummary(playerId: string) {
  const { data, error } = await db
    .from('_wordle_streak')
    .select('current_streak, best_streak')
    .eq('player', playerId);

  if (error) {
    console.error('[playerSummary] getStreakSummary error:', error);
    return {
      currentStreak: 0,
      bestStreak: 0,
    };
  }

  const rows = data || [];

  return {
    currentStreak: Math.max(
      0,
      ...rows.map((row) => row?.current_streak ?? 0),
    ),
    bestStreak: Math.max(
      0,
      ...rows.map((row) => row?.best_streak ?? 0),
    ),
  };
}

async function getLeaderboardPositions(playerId: string) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  let weeklyPosition: any = null;
  let dailyPosition: any = null;

  try {
    weeklyPosition = await leaderboardService.getPlayerLeaderboardPositionThisWeek(
      playerId,
      1,
      currentYear,
    );
  } catch (e) {
    console.error('[playerSummary] weekly position error:', e);
  }

  try {
    const now = new Date();

    dailyPosition = await leaderboardService.getPlayerLeaderboardPositionToday(
      playerId,
      now.getDate(),
      now.getMonth() + 1,
      now.getFullYear(),
    );
  } catch (e) {
    console.error('[playerSummary] daily position error:', e);
  }

  const [allTime, yearly, monthly] = await Promise.all([
    leaderboardService.getPlayerLeaderboardPositionAllTime(playerId).catch((e) => {
      console.error('[playerSummary] allTime position error:', e);
      return null;
    }),
    leaderboardService
      .getPlayerLeaderboardPositionThisYear(playerId, currentYear)
      .catch((e) => {
        console.error('[playerSummary] yearly position error:', e);
        return null;
      }),
    leaderboardService
      .getPlayerLeaderboardPositionThisMonth(playerId, currentMonth, currentYear)
      .catch((e) => {
        console.error('[playerSummary] monthly position error:', e);
        return null;
      }),
  ]);

  return {
    allTime: Array.isArray(allTime) ? allTime?.[0] || null : allTime,
    yearly: Array.isArray(yearly) ? yearly?.[0] || null : yearly,
    monthly: Array.isArray(monthly) ? monthly?.[0] || null : monthly,
    weekly: Array.isArray(weeklyPosition) ? weeklyPosition?.[0] || null : weeklyPosition,
    daily: Array.isArray(dailyPosition) ? dailyPosition?.[0] || null : dailyPosition,
  };
}

async function getPublicPlayerSummary(playerId: string) {
  const profile = await playerService.getPublicPlayerProfileByUserId(playerId);

  if (!profile || !profile?.id) return null;

  const [stats, guessDistribution, streak, leaderboardPositions] = await Promise.all([
    getAllTimeStats(playerId),
    getGuessDistribution(playerId),
    getStreakSummary(playerId),
    getLeaderboardPositions(playerId),
  ]);

  return {
    ...profile,
    stats,
    guessDistribution,
    streak,
    leaderboardPositions,
  };
}

export default {
  getPublicPlayerSummary,
};