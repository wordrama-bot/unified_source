export type WordleLeaderboardUiState = {
  showAll?: boolean; // Deprecated
  hideProfileImages?: boolean;
  hideUsernames?: boolean;
  hideLevel?: boolean;
  showAllModes?: boolean;
  showByWordLength?: boolean;
  showByGameMode?: boolean;
  showByWonIn?: boolean;
};

export type WordleGameUiState = {
    boardColour?: string,
    keyboardColour?: string,
    swapDeleteAndEnter?: boolean,
    confettiEnabled?: boolean,
    speedRunModeEnabled?: boolean,
    streamerModeEnabled?: boolean,
    gameSoundEnabled?: boolean
};

export type InitialState  = {
  leaderboard: {
    WORDLE: WordleLeaderboardUiState;
  },
  wordleGame: WordleGameUiState;
}

export interface IAction {
    type: string
}

export interface ISetUiStateAction extends IAction {
  payload: {
    updatedState: InitialState
  }
}
