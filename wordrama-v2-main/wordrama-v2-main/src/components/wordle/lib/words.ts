import { default as GraphemeSplitter } from 'grapheme-splitter'
import { NOT_CONTAINED_MESSAGE, WRONG_SPOT_MESSAGE } from '../constants/strings'
import { getGuessStatuses } from './statuses'

export const isWordInWordList = (guess: string, validGuesses: string[], gameMode: string): boolean => {
  if (gameMode === 'CUSTOM') return true;
  return validGuesses.includes(guess.toLowerCase());
}

export const isWinningWord = (solution: string, word: string): boolean => {
  return solution === word;
}

// build a set of previously revealed letters - present and correct
// guess must use correct letters in that space and any other revealed letters
// also check if all revealed instances of a letter are used (i.e. two C's)
export const findFirstUnusedReveal = (
  solution: string,
  word: string,
  guesses: string[]
) => {
  if (guesses.length === 0) return false;
  const lettersLeftArray = new Array<string>();
  const guess = guesses[guesses.length - 1];
  const statuses = getGuessStatuses(solution, guess);
  const splitWord = unicodeSplit(word);
  const splitGuess = unicodeSplit(guess);

  for (let i = 0; i < splitGuess.length; i++) {
    if (statuses[i] === 'correct' || statuses[i] === 'present') {
      lettersLeftArray.push(splitGuess[i])
    }
    if (statuses[i] === 'correct' && splitWord[i] !== splitGuess[i]) {
      return WRONG_SPOT_MESSAGE(splitGuess[i], i + 1)
    }
  }

  // check for the first unused letter, taking duplicate letters
  // into account - see issue #198
  let n
  for (const letter of splitWord) {
    n = lettersLeftArray.indexOf(letter)
    if (n !== -1) {
      lettersLeftArray.splice(n, 1)
    }
  }

  if (lettersLeftArray.length > 0) {
    return NOT_CONTAINED_MESSAGE(lettersLeftArray[0])
  }
  return false
}

export const unicodeSplit = (word: string = '') => {
  return new GraphemeSplitter().splitGraphemes(word) || []
}

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length
}

export const localeAwareLowerCase = (text: string) => {
  return text.toLowerCase()
}

export const localeAwareUpperCase = (text: string) => {
  return text.toUpperCase()
}

export const getRandomWord = (wordList: string[]) => {
  const randomIndex = Math.floor(Math.random() * wordList.length) - 1
  if (randomIndex < 0) throw new Error('Invalid index');

  return localeAwareUpperCase(wordList[randomIndex % wordList.length])
}
