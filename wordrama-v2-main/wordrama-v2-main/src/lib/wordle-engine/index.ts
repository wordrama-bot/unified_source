import GraphemeSplitter from 'grapheme-splitter';

export const DEFAULT_MAX_ATTEMPTS = 6;

export type CharStatus = 'absent' | 'present' | 'correct';

export type WordleGameResult = {
  guesses: string[];
  isGameWon: boolean;
  isGameLost: boolean;
};

const splitter = new GraphemeSplitter();

export function unicodeSplit(word: string = ''): string[] {
  return splitter.splitGraphemes(word) || [];
}

export function unicodeLength(word: string): number {
  return unicodeSplit(word).length;
}

export function isWinningWord(solution: string, word: string): boolean {
  return solution === word;
}

export function isWordInWordList(
  guess: string,
  validGuesses: string[],
  gameMode?: string,
): boolean {
  if (gameMode === 'CUSTOM') return true;
  return validGuesses.includes(guess.toLowerCase());
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

export function hasAttemptsRemaining(
  guesses: string[],
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS,
): boolean {
  return guesses.length < maxAttempts;
}

export function isMaxAttemptsReached(
  guesses: string[],
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS,
): boolean {
  return guesses.length >= maxAttempts;
}

export function getStatuses(
  solution: string,
  guesses: string[],
): { [key: string]: CharStatus } {
  const charObj: { [key: string]: CharStatus } = {};
  const splitSolution = unicodeSplit(solution);

  guesses.forEach((word) => {
    unicodeSplit(word).forEach((letter, i) => {
      if (!splitSolution.includes(letter)) {
        charObj[letter] = 'absent';
        return;
      }

      if (letter === splitSolution[i]) {
        charObj[letter] = 'correct';
        return;
      }

      if (charObj[letter] !== 'correct') {
        charObj[letter] = 'present';
      }
    });
  });

  return charObj;
}

export function getGuessStatuses(
  solution: string,
  guess: string,
): CharStatus[] {
  const splitSolution = unicodeSplit(solution);
  const splitGuess = unicodeSplit(guess);
  const solutionCharsTaken = splitSolution.map(() => false);
  const statuses: CharStatus[] = Array.from(Array(splitGuess.length));

  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = 'correct';
      solutionCharsTaken[i] = true;
    }
  });

  splitGuess.forEach((letter, i) => {
    if (statuses[i]) return;

    if (!splitSolution.includes(letter)) {
      statuses[i] = 'absent';
      return;
    }

    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index],
    );

    if (indexOfPresentChar > -1) {
      statuses[i] = 'present';
      solutionCharsTaken[indexOfPresentChar] = true;
      return;
    }

    statuses[i] = 'absent';
  });

  return statuses;
}

export function getRandomWord(
  wordList?: string[],
  random: () => number = Math.random,
): string {
  if (!wordList || wordList.length === 0) return '';

  const randomIndex = Math.floor(random() * wordList.length);
  return wordList[randomIndex].toUpperCase();
}

export function getGameResultAfterGuess({
  solution,
  previousGuesses,
  guess,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
}: {
  solution: string;
  previousGuesses: string[];
  guess: string;
  maxAttempts?: number;
}): WordleGameResult {
  const guesses = [...previousGuesses, guess];
  const isGameWon = isWinningWord(solution, guess);
  const isGameLost = !isGameWon && guesses.length >= maxAttempts;

  return {
    guesses,
    isGameWon,
    isGameLost,
  };
}
