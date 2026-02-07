import {
  type GameState,
  type InitialState,
  ISetGameStateAction
} from "./types"

import { initialState, gameDefaultState } from './defaultStates';

const wordPackLengthMap: { [key: number]: string } = {
  5: 'FIVE_LETTER',
  6: 'SIX_LETTER',
  7: 'SEVEN_LETTER',
  8: 'EIGHT_LETTER',
  9: 'NINE_LETTER',
  10: 'TEN_LETTER',
  11: 'ELEVEN_LETTER'
}

function freePlayReducer(state: InitialState = initialState, { type, payload }: ISetGameStateAction) {
  switch (type) {
    case "INIT":
      state = { ...state, isLoading: false, ...payload }
      break;
    case "SET_GAME_MODE":
      state = { ...state, gameMode: payload.gameMode }
      break;
    case "SET_WORD_LENGTH":
      //if (state.gameMode !== 'CUSTOM') {
      //  state = { ...state, wordPack: wordPackLengthMap[payload.wordLength], wordLength: payload.wordLength  }
      //}
      state = { ...state, wordLength: payload.wordLength }
      break;
    case "SET_WORD_PACK":
      state = { ...state, wordPack: payload.wordPack }
      break;
    case "RESET_GAME_STATE":
      state = {
        ...state,
        modes: {
          ...state.modes,
          [state.gameMode]: {
            ...state.modes[state.gameMode],
            [state.wordLength]: {
              ...gameDefaultState
            }
          }
        }
      }
      break;
    case "SET_GAME_STATE":
      if (state.gameMode === 'CUSTOM') {
        state = {
          ...state,
          custom: {
            ...state.custom,
            ...payload.updatedState
          }
        }
        break;
      }
      state = {
        ...state,
        modes: {
          ...state.modes,
          [state.gameMode]: {
            ...state.modes[state.gameMode],
            [state.wordPack]: {
              ...state.modes[state.gameMode][state.wordPack],
              ...payload.updatedState
            }
          }
        }
      }
      break;
    case "SETUP_CUSTOM_GAME":
      state = {
        ...state,
        gameMode: 'CUSTOM',
        wordPack: payload.wordPack || 'CUSTOM',
        wordLength: payload.solution.length,
        custom: {
          ...gameDefaultState,
          joinCode: payload.joinCode,
          solution: payload.solution
        }
      }
      break;
  }
  return state;
};

export default freePlayReducer;
