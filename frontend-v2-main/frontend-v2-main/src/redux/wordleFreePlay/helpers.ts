import { useDispatch, useSelector } from 'react-redux';
import { InitialState as WordleGameState, GameState } from './types';
import { setWordPack, setGameState, setWordLength, setGameMode} from './actions';

function getWordleState(): WordleGameState {
  return useSelector(({ freePlayGameState }: { freePlayGameState: WordleGameState }) => freePlayGameState);
}

function getCurrentWordLength(): number {
  const state = getWordleState();
  return state.wordLength;
}

function getCurrentGameMode(): string {
  const state = getWordleState();
  return state.gameMode;
}

function getSelectedWordPack(): string {
  const state = getWordleState();
  return state.wordPack;
}

function getCurrentGameState(): GameState {
  const state = getWordleState();
  return state.modes[state.gameMode][state.wordLength];
}

export {
  getWordleState,
  getCurrentGameMode,
  getSelectedWordPack,
  getCurrentWordLength,
  getCurrentGameState
}
