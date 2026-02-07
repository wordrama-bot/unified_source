import {
  type InitialState,
  ISetUiStateAction
} from "./types"

import { initialState } from './defaultStates';

function uiReducer(state: InitialState = initialState, { type, payload }: ISetUiStateAction) {
  switch (type) {
    case "SET_WORDLE_LEADERBOARD_UI_STATE":
      state = {
        ...state,
        leaderboard: {
          WORDLE: {
            ...state.leaderboard.WORDLE,
            ...payload?.updatedState
          }
        }
      }
      break;
    case "SET_WORDLE_GAME_UI_STATE":
      state = {
        ...state,
        wordleGame: {
          ...state.wordleGame,
          ...payload?.updatedState
        }
      }
      break;
  }

  return state;
};

export default uiReducer;
