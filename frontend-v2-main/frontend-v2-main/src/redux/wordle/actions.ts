import { InitialState, type GameState } from './types';

export function setInitialState(state: InitialState) {
  return {
    type: "INIT",
    payload: state
  }
}

export function setGameState(
  updatedState: GameState
) {
    return {
        type: "SET_GAME_STATE",
        payload: {
          updatedState
        }
    };
}

export function setGameMode(gameMode: string) {
    return {
        type: "SET_GAME_MODE",
        payload: {
          gameMode
        }
    };
}

export function setupCustomGame(joinCode: string, solution: string, hint: string) {
    return {
        type: "SETUP_CUSTOM_GAME",
        payload: {
          solution,
          joinCode,
          hint
        }
    };
}

export function resetCustomGame() {
    return {
        type: "RESET_CUSTOM_GAME",
        payload: {}
    };
}

export function setWordPack(
  wordPack: string,
) {
    return {
        type: "SET_WORD_PACK",
        payload: {
          wordPack
        }
    };
}

export function setWordLength(
  wordLength: number,
) {
    return {
        type: "SET_WORD_LENGTH",
        payload: {
          wordLength
        }
    };
}

export function resetGameState(
  gameMode: string,
  wordLength: number
) {
    return {
        type: "RESET_GAME_STATE",
        payload: {}
    };
}
