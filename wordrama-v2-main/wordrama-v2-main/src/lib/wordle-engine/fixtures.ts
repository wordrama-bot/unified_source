import type { CharStatus } from './index';

type GuessStatusFixture = {
  name: string;
  solution: string;
  guess: string;
  expected: CharStatus[];
};

type GameResultFixture = {
  name: string;
  solution: string;
  previousGuesses: string[];
  guess: string;
  maxAttempts: number;
  expected: {
    guesses: string[];
    isGameWon: boolean;
    isGameLost: boolean;
  };
};

export const guessStatusFixtures: GuessStatusFixture[] = [
  {
    name: 'all correct letters are marked correct',
    solution: 'CRANE',
    guess: 'CRANE',
    expected: ['correct', 'correct', 'correct', 'correct', 'correct'],
  },
  {
    name: 'present letters are marked after exact matches are consumed',
    solution: 'CRANE',
    guess: 'REACT',
    expected: ['present', 'present', 'present', 'absent', 'absent'],
  },
  {
    name: 'duplicate guesses do not over-credit a single solution letter',
    solution: 'BANAL',
    guess: 'ALARM',
    expected: ['present', 'present', 'absent', 'absent', 'absent'],
  },
  {
    name: 'duplicate solution letters can both be credited',
    solution: 'LEVEL',
    guess: 'EELLY',
    expected: ['present', 'present', 'present', 'present', 'absent'],
  },
];

export const gameResultFixtures: GameResultFixture[] = [
  {
    name: 'winning guess ends as won and not lost',
    solution: 'CRANE',
    previousGuesses: ['SLATE'],
    guess: 'CRANE',
    maxAttempts: 6,
    expected: {
      guesses: ['SLATE', 'CRANE'],
      isGameWon: true,
      isGameLost: false,
    },
  },
  {
    name: 'last incorrect attempt ends as lost',
    solution: 'CRANE',
    previousGuesses: ['SLATE', 'BRICK', 'MOUND', 'WHIRL', 'PLANT'],
    guess: 'GHOST',
    maxAttempts: 6,
    expected: {
      guesses: ['SLATE', 'BRICK', 'MOUND', 'WHIRL', 'PLANT', 'GHOST'],
      isGameWon: false,
      isGameLost: true,
    },
  },
];

export const randomWordFixtures = {
  firstWord: {
    wordList: ['crane', 'slate', 'ghost'],
    randomValue: 0,
    expected: 'CRANE',
  },
  lastWord: {
    wordList: ['crane', 'slate', 'ghost'],
    randomValue: 0.999,
    expected: 'GHOST',
  },
};
