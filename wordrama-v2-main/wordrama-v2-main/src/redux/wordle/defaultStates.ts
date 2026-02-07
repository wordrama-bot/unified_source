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
  hint: '',
  ...gameDefaultState
};

export const wordleDefaultState: Mode = {
  'FOUR_LETTER': { ...gameDefaultState },
  'FIVE_LETTER': { ...gameDefaultState },
  'SIX_LETTER': { ...gameDefaultState },
  'SEVEN_LETTER': { ...gameDefaultState },
  'EIGHT_LETTER': { ...gameDefaultState },
  'NINE_LETTER': { ...gameDefaultState },
  'TEN_LETTER': { ...gameDefaultState },
  'ELEVEN_LETTER': { ...gameDefaultState },
  'ELEVEN_LETTER_EXTENDED': { ...gameDefaultState },
  'TWELVE_LETTER': { ...gameDefaultState },
  'THIRTEEN_LETTER': { ...gameDefaultState },
  'FOURTEEN_LETTER': { ...gameDefaultState },
  'FIFTEEN_LETTER': { ...gameDefaultState },
  'SIXTEEN_LETTER': { ...gameDefaultState },
  'SEVENTEEN_LETTER': { ...gameDefaultState },
  'EIGHTEEN_LETTER': { ...gameDefaultState },
  'NINETEEN_LETTER': { ...gameDefaultState },
  'TWENTY_LETTER': { ...gameDefaultState },
  'TWENTYONE_LETTER': { ...gameDefaultState },
  'TWENTYTWO_LETTER': { ...gameDefaultState },
  'TWENTYTHREE_LETTER': { ...gameDefaultState }
};

export const initialState: InitialState = {
  isLoading: true,
  gameMode: 'DAILY',
  wordLength: 5,
  wordPack: 'FIVE_LETTER',
  custom: { ...customGameDefaultState },
  modes: {
    "DAILY": { ...wordleDefaultState },
    "INFINITE": { ...wordleDefaultState }
  }
};
