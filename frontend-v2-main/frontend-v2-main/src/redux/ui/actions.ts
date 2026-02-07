import { InitialState, type WordleLeaderboardUiState, type WordleGameUiState } from './types';

export function setInitialState(state: InitialState) {
  return {
    type: "INIT",
    payload: state
  }
}

export function setWordleLeaderboardUiState(
  updatedState: WordleLeaderboardUiState
) {
    return {
        type: "SET_WORDLE_LEADERBOARD_UI_STATE",
        payload: {
          updatedState
        }
    };
}

export function setWordleGameUiState(
  updatedState: WordleGameUiState
) {
    return {
        type: "SET_WORDLE_GAME_UI_STATE",
        payload: {
          updatedState
        }
    };
}
