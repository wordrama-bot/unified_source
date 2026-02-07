import { useSelector } from 'react-redux';
import { InitialState as UiState, WordleLeaderboardUiState } from './types';


function getUiState() {
  return useSelector(({ uiState }: { uiState: UiState }) => uiState);
}

function getLeaderboardUiState() {
  return useSelector(({ uiState }: { uiState: UiState }) => uiState.leaderboard);
}

function getWordleLeaderboardUiState() {
  return useSelector(({ uiState }: { uiState: UiState }) => uiState.leaderboard.WORDLE);
}

function getWordleGameUiState() {
  return useSelector(({ uiState }: { uiState: UiState }) => uiState.wordleGame);
}

export {
  getUiState,
  getLeaderboardUiState,
  getWordleLeaderboardUiState,
  getWordleGameUiState
}
