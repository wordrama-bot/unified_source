import { MAX_CHALLENGES } from '../constants/settings'
import {
  GameStat,
  IGameStats,
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './localStorage'

// In stats array elements 0-5 are successes in 1-6 trys

export const addStatsForCompletedGame = (
  wordLength: string,
  gameStats: IGameStats,
  count: number,
  isDaily: boolean = true
) => {
  // Count is number of incorrect guesses before end.
  let stats = { ...gameStats }

  stats[wordLength].totalGames += 1

  if (count >= MAX_CHALLENGES) {
    // A fail situation
    stats[wordLength].currentStreak = 0
    stats[wordLength].gamesFailed += 1
  } else {
    stats[wordLength].winDistribution[count] += 1
    stats[wordLength].currentStreak += 1

    if (stats[wordLength].bestStreak < stats[wordLength].currentStreak) {
      stats[wordLength].bestStreak = stats[wordLength].currentStreak
    }
  }

  stats[wordLength].successRate = getSuccessRate(wordLength, stats)

  saveStatsToLocalStorage(stats, isDaily)
  return stats
}

const defaultStats: GameStat = {
  winDistribution: Array.from(new Array(MAX_CHALLENGES), () => 0),
  gamesFailed: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  successRate: 0,
}

export const loadStats = (isDaily: boolean = true) => {
  return (
    loadStatsFromLocalStorage(isDaily) || {
      FIVE: defaultStats,
      SIX: defaultStats,
      SEVEN: defaultStats,
      EIGHT: defaultStats,
      NINE: defaultStats,
      TEN: defaultStats,
      ELEVEN: defaultStats,
    }
  )
}

const getSuccessRate = (wordLength: string, gameStats: IGameStats) => {
  const { totalGames, gamesFailed } = gameStats[wordLength]

  return Math.round(
    (100 * (totalGames - gamesFailed)) / Math.max(totalGames, 1)
  )
}
