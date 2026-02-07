import { GameState, Mode, InitialState, CustomGameState } from './types';

export const gameDefaultState: GameState = {
  solution: '',
  guesses: [],
  isGameInProgress: false,
  isGameWon: false,
  isGameLost: false,
  resultSave: false
};

export const customGameDefaultState: CustomGameState = {
  joinCode: '',
  ...gameDefaultState
};

export const wordleDefaultState: Mode = {
  'FIVE_LETTER': { ...gameDefaultState },
  'SIX_LETTER': { ...gameDefaultState },
  'SEVEN_LETTER': { ...gameDefaultState },
  'EIGHT_LETTER': { ...gameDefaultState },
  'NINE_LETTER': { ...gameDefaultState },
  'TEN_LETTER': { ...gameDefaultState },
  'ELEVEN_LETTER': { ...gameDefaultState }
};

export const initialState: InitialState = {
  isLoading: false,
  gameMode: 'INFINITE',
  wordLength: 5,
  wordPack: 'FIVE_LETTER',
  custom: { ...customGameDefaultState },
  modes: {
    "DAILY": { ...wordleDefaultState },
    "INFINITE": { ...wordleDefaultState }
  }
};
