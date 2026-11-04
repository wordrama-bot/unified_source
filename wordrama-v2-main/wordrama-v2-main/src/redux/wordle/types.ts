export type GameState = {
  gameInstanceId?: string;
  solution: string;
  guesses: string[];
  isGameInProgress: boolean;
  isGameWon: boolean;
  isGameLost: boolean;
  resultSave: boolean;
};

export type WordleBoardTarget = {
  gameMode: string;
  wordPack: string;
  gameInstanceId?: string;
  solution: string;
};

export type CustomGameState = {
  joinCode: string;
  hint: string;
  solution: string;
  guesses: string[];
  isGameInProgress: boolean;
  isGameWon: boolean;
  isGameLost: boolean;
};

export type Mode = {
  [key: string]: GameState
};


export type InitialState  = {
  isLoading: boolean;
  gameMode: string;
  wordLength: number;
  wordPack: string;
  custom: CustomGameState;
  modes: {
    [key: string]: Mode
  }
}

export interface IAction {
    type: string
}

export interface ISetGameStateAction extends IAction {
  payload: {
    gameMode: string,
    wordLength: number,
    wordPack: string,
    updatedState: GameState,
    target?: WordleBoardTarget,
    hint: string,
    joinCode: string,
    solution: string,
    guess: string
  }
}
