const dailyGameStateKey = 'dailyGameState'
const gameStateKey = 'gameState'
const archiveGameStateKey = 'archiveGameState'
const highContrastKey = 'highContrast'
const swapEnterAndDeleteKey = 'swapEnterAndDeleteKeys'
const wordLengthKey = 'wordLength'
const confettiEnabledKey = 'confettiEnabled'

export type StoredGameState = {
  guesses: string[]
  solution: string
}

export interface IStoredGameState {
  [key: string]: StoredGameState
}

const defaultState = {
  FIVE: { guesses: [], solution: '' },
  SIX: { guesses: [], solution: '' },
  SEVEN: { guesses: [], solution: '' },
  EIGHT: { guesses: [], solution: '' },
  NINE: { guesses: [], solution: '' },
  TEN: { guesses: [], solution: '' },
  ELEVEN: { guesses: [], solution: '' },
}

export const saveGameStateToLocalStorage = (
  isLatestGame: boolean,
  gameState: StoredGameState,
  isDaily: boolean = true,
  wordLength: string = 'FIVE'
) => {
  if (!localStorage.getItem(dailyGameStateKey)) {
    localStorage.setItem(dailyGameStateKey, JSON.stringify(defaultState))
  }

  if (!localStorage.getItem(gameStateKey)) {
    localStorage.setItem(gameStateKey, JSON.stringify(defaultState))
  }

  if (isDaily) {
    const key = isLatestGame ? dailyGameStateKey : archiveGameStateKey
    const stateString = localStorage.getItem(key)
    if (stateString) {
      const state = JSON.parse(stateString) as IStoredGameState
      const updatedState = { ...state, [wordLength]: gameState }
      localStorage.setItem(key, JSON.stringify(updatedState))
    }
  } else {
    const stateString = localStorage.getItem(gameStateKey)
    if (stateString) {
      const state = JSON.parse(stateString) as IStoredGameState
      const updatedState = { ...state, [wordLength]: gameState }
      localStorage.setItem(gameStateKey, JSON.stringify(updatedState))
    }
  }
}

export const loadGameStateFromLocalStorage = (
  isLatestGame: boolean,
  isDaily: boolean = true,
  wordLength: string = 'FIVE'
) => {
  if (isDaily) {
    const key = isLatestGame ? dailyGameStateKey : archiveGameStateKey
    const state = localStorage.getItem(key)
    return state ? (JSON.parse(state)[wordLength] as StoredGameState) : null
  } else {
    const state = localStorage.getItem(gameStateKey)
    return state ? (JSON.parse(state)[wordLength] as StoredGameState) : null
  }
}

const dailyGameStatKey = 'dailyGameStats'
const gameStatKey = 'gameStats'

export type GameStat = {
  winDistribution: number[]
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
}

export interface IGameStats {
  [key: string]: GameStat
}

export const saveStatsToLocalStorage = (
  gameStats: IGameStats,
  isDaily: boolean = true
) => {
  localStorage.setItem(
    isDaily ? dailyGameStatKey : gameStatKey,
    JSON.stringify(gameStats)
  )
}

export const loadStatsFromLocalStorage = (isDaily: boolean = true) => {
  const stats = localStorage.getItem(isDaily ? dailyGameStatKey : gameStatKey)
  return stats ? (JSON.parse(stats) as IGameStats) : null
}

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1')
  } else {
    localStorage.removeItem(highContrastKey)
  }
}

export const setStoredSwapEnterAndDelete = (swapEnterAndDelete: boolean) => {
  if (swapEnterAndDelete) {
    localStorage.setItem(swapEnterAndDeleteKey, '1')
  } else {
    localStorage.removeItem(swapEnterAndDeleteKey)
  }
}

export const setStoredIsConfettiEnabled = (isEnabled: boolean) => {
  if (isEnabled) {
    localStorage.setItem(confettiEnabledKey, 'true')
  } else {
    localStorage.removeItem(confettiEnabledKey)
  }
}

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey)
  return highContrast === '1'
}

export const getStoredSwapEnterAndDelete = () => {
  const swapEnterAndDelete = localStorage.getItem(swapEnterAndDeleteKey)
  return swapEnterAndDelete === '1'
}

export const setStoredWordLength = (wordLength: string) => {
  localStorage.setItem(wordLengthKey, wordLength)
}

export const getStoredWordLength = () => {
  const wordLength = localStorage.getItem(wordLengthKey)
  return wordLength || 'FIVE'
}
