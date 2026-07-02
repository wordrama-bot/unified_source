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
  appearanceThemeId: 'theme.default',
  keyboardStyleId: 'keyboard-style.flat',
  swapDeleteAndEnter: false,
  confettiEnabled: true,
  speedRunModeEnabled: false,
  streamerModeEnabled: false,
  gameSoundEnabled: true,
  colorblindMode: false
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
