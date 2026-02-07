import { InitialState, WordleLeaderboardUiState, WordleGameUiState } from './types';

export const wordleLeaderboardUiDefaultState: WordleLeaderboardUiState = {
  showAll: true, // Deprecated
  hideProfileImages: false,
  hideUsernames: false,
  hideLevel: false,
  showAllModes: true,
  showByWordLength: false,
  showByGameMode: false,
  showByWonIn: false
};

export const wordleGameUiDefaultState: WordleGameUiState = {
  boardColour: undefined,
  keyboardColour: undefined,
  swapDeleteAndEnter: false,
  confettiEnabled: true,
  speedRunModeEnabled: false,
  streamerModeEnabled: false,
  gameSoundEnabled: true
};

export const initialState: InitialState = {
  leaderboard: {
    WORDLE: {
      ...wordleLeaderboardUiDefaultState
    }
  },
  wordleGame: {
    ...wordleGameUiDefaultState
  }
};
