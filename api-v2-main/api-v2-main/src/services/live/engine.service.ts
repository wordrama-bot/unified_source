import type {
  DetermineMatchResultInput,
  EvaluateGuessInput,
  LiveGuessEvaluationCell,
  LiveMatchPlayer,
  LiveMatchResult,
  LivePlayerId,
  MatchResultDecision,
  ValidateGuessInput,
  ValidateGuessResult,
} from './types.js';

export const LIVE_WORDLE_DEFAULT_MAX_ATTEMPTS = 6;

export type LiveWordleCharStatus = 'absent' | 'present' | 'correct';

export type LivePlayerTerminalState = {
  isSolved: boolean;
  isFailed: boolean;
  isTerminal: boolean;
  guessCount: number;
};

export interface EngineService {
  validateGuess(input: ValidateGuessInput): Promise<ValidateGuessResult>;
  evaluateGuess(input: EvaluateGuessInput): Promise<LiveGuessEvaluationCell[]>;
  determineMatchResult(input: DetermineMatchResultInput): Promise<MatchResultDecision>;
}

export function normalizeGuess(guess: string): string {
  return guess.trim().toUpperCase();
}

export function unicodeSplit(word: string = ''): string[] {
  return Array.from(word);
}

export function unicodeLength(word: string): number {
  return unicodeSplit(word).length;
}

export function isGuessLengthValid(
  guess: string,
  solutionOrLength: string | number,
): boolean {
  const requiredLength =
    typeof solutionOrLength === 'number'
      ? solutionOrLength
      : unicodeLength(solutionOrLength);

  return unicodeLength(guess) === requiredLength;
}

export function getGuessStatuses(
  solution: string,
  guess: string,
): LiveWordleCharStatus[] {
  const splitSolution = unicodeSplit(normalizeGuess(solution));
  const splitGuess = unicodeSplit(normalizeGuess(guess));
  const solutionCharsTaken = splitSolution.map(() => false);
  const statuses: LiveWordleCharStatus[] = Array.from(Array(splitGuess.length));

  splitGuess.forEach((letter, index) => {
    if (letter === splitSolution[index]) {
      statuses[index] = 'correct';
      solutionCharsTaken[index] = true;
    }
  });

  splitGuess.forEach((letter, index) => {
    if (statuses[index]) return;

    if (!splitSolution.includes(letter)) {
      statuses[index] = 'absent';
      return;
    }

    const indexOfPresentChar = splitSolution.findIndex(
      (solutionLetter, solutionIndex) =>
        solutionLetter === letter && !solutionCharsTaken[solutionIndex],
    );

    if (indexOfPresentChar > -1) {
      statuses[index] = 'present';
      solutionCharsTaken[indexOfPresentChar] = true;
      return;
    }

    statuses[index] = 'absent';
  });

  return statuses;
}

export function evaluateGuess(
  input: EvaluateGuessInput,
): LiveGuessEvaluationCell[] {
  const normalizedGuess = normalizeGuess(input.guess);
  const statuses = getGuessStatuses(input.solution, normalizedGuess);
  const letters = unicodeSplit(normalizedGuess);

  return letters.map((letter, index) => ({
    letter,
    status: statuses[index],
  }));
}

export function isWinningGuess(solution: string, guess: string): boolean {
  return normalizeGuess(solution) === normalizeGuess(guess);
}

export function hasAttemptsRemaining(
  guessCount: number,
  maxAttempts: number = LIVE_WORDLE_DEFAULT_MAX_ATTEMPTS,
): boolean {
  return guessCount < maxAttempts;
}

export function getPlayerTerminalStateAfterGuess({
  solution,
  guess,
  previousGuessCount,
  maxAttempts = LIVE_WORDLE_DEFAULT_MAX_ATTEMPTS,
}: {
  solution: string;
  guess: string;
  previousGuessCount: number;
  maxAttempts?: number;
}): LivePlayerTerminalState {
  const guessCount = previousGuessCount + 1;
  const isSolved = isWinningGuess(solution, guess);
  const isFailed = !isSolved && guessCount >= maxAttempts;

  return {
    isSolved,
    isFailed,
    isTerminal: isSolved || isFailed,
    guessCount,
  };
}

export function validateGuess(input: ValidateGuessInput): ValidateGuessResult {
  const guess = normalizeGuess(input.guess ?? '');

  if (!guess) {
    return {
      valid: false,
      error: 'Guess is required.',
    };
  }

  return {
    valid: true,
  };
}

function elapsedFromMatchStart(
  matchStartedAt: string | null | undefined,
  playerSolvedAt: string | null | undefined,
): number | null {
  if (!matchStartedAt || !playerSolvedAt) return null;

  const startedAt = Date.parse(matchStartedAt);
  const solvedAt = Date.parse(playerSolvedAt);

  if (Number.isNaN(startedAt) || Number.isNaN(solvedAt)) return null;

  return solvedAt - startedAt;
}

function getPlayerResult(
  player: LiveMatchPlayer,
  winnerPlayerId: LivePlayerId | null,
  isDraw: boolean,
): LiveMatchResult {
  if (player.status === 'FORFEITED') return 'FORFEIT';
  if (isDraw) return 'DRAW';
  if (winnerPlayerId && player.playerId === winnerPlayerId) return 'WIN';
  return 'LOSS';
}

export function determineMatchResult(
  input: DetermineMatchResultInput,
): MatchResultDecision {
  const players = input.players.filter(
    (player) => player.status !== 'DISCONNECTED',
  );

  if (players.length === 0) {
    return {
      winnerPlayerId: null,
      winnerReason: null,
      playerResults: [],
    };
  }

  const solvedPlayers = players.filter((player) => Boolean(player.solvedAt));
  const failedPlayers = players.filter((player) => Boolean(player.failedAt));
  const forfeitedPlayers = players.filter(
    (player) => player.status === 'FORFEITED',
  );
  const terminalPlayers = players.filter(
    (player) =>
      Boolean(player.solvedAt) ||
      Boolean(player.failedAt) ||
      player.status === 'FORFEITED' ||
      player.status === 'FINISHED',
  );

  if (terminalPlayers.length < players.length) {
    return {
      winnerPlayerId: null,
      winnerReason: null,
      playerResults: [],
    };
  }

  let winnerPlayerId: LivePlayerId | null = null;
  let winnerReason: MatchResultDecision['winnerReason'] = 'NO_WINNER';

  if (forfeitedPlayers.length === 1 && players.length === 2) {
    const winner = players.find(
      (player) => player.playerId !== forfeitedPlayers[0].playerId,
    );

    winnerPlayerId = winner?.playerId ?? null;
    winnerReason = winnerPlayerId ? 'OPPONENT_FORFEITED' : 'NO_WINNER';
  } else if (solvedPlayers.length === 1 && failedPlayers.length > 0) {
    winnerPlayerId = solvedPlayers[0].playerId;
    winnerReason = 'OPPONENT_FAILED';
  } else if (solvedPlayers.length > 1) {
    const sortedByGuesses = [...solvedPlayers].sort(
      (left, right) => left.guessCount - right.guessCount,
    );
    const fewestGuesses = sortedByGuesses[0].guessCount;
    const fewestGuessPlayers = sortedByGuesses.filter(
      (player) => player.guessCount === fewestGuesses,
    );

    if (fewestGuessPlayers.length === 1) {
      winnerPlayerId = fewestGuessPlayers[0].playerId;
      winnerReason = 'FEWEST_GUESSES';
    } else {
      const sortedByElapsed = [...fewestGuessPlayers].sort((left, right) => {
        const leftElapsed =
          elapsedFromMatchStart(input.match.startedAt, left.solvedAt) ??
          Number.POSITIVE_INFINITY;
        const rightElapsed =
          elapsedFromMatchStart(input.match.startedAt, right.solvedAt) ??
          Number.POSITIVE_INFINITY;

        return leftElapsed - rightElapsed;
      });
      const fastestElapsed = elapsedFromMatchStart(
        input.match.startedAt,
        sortedByElapsed[0].solvedAt,
      );
      const fastestPlayers = sortedByElapsed.filter(
        (player) =>
          elapsedFromMatchStart(input.match.startedAt, player.solvedAt) ===
          fastestElapsed,
      );

      if (fastestElapsed !== null && fastestPlayers.length === 1) {
        winnerPlayerId = fastestPlayers[0].playerId;
        winnerReason = 'FASTEST_SOLVE';
      }
    }
  }

  const isDraw = !winnerPlayerId;

  return {
    winnerPlayerId,
    winnerReason,
    playerResults: players.map((player) => ({
      playerId: player.playerId,
      result: getPlayerResult(player, winnerPlayerId, isDraw),
    })),
  };
}

export const LIVE_WORDLE_ENGINE_FIXTURES = [
  {
    name: 'duplicate letters only mark available solution letters present',
    solution: 'APPLE',
    guess: 'ALLEY',
    statuses: ['correct', 'present', 'absent', 'present', 'absent'],
  },
  {
    name: 'extra duplicate letters become absent after exact matches are taken',
    solution: 'BANAL',
    guess: 'LLAMA',
    statuses: ['present', 'absent', 'present', 'absent', 'present'],
  },
  {
    name: 'all correct letters win',
    solution: 'CRANE',
    guess: 'CRANE',
    statuses: ['correct', 'correct', 'correct', 'correct', 'correct'],
  },
] as const;
