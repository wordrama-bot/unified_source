import FOUR_LETTER from './wordPacks/FOUR_LETTER/validGuesses.json';
import FIVE_LETTER from './wordPacks/FIVE_LETTER/validGuesses.json';
import SIX_LETTER from './wordPacks/SIX_LETTER/validGuesses.json';
import SEVEN_LETTER from './wordPacks/SEVEN_LETTER/validGuesses.json';
import EIGHT_LETTER from './wordPacks/EIGHT_LETTER/validGuesses.json';
import NINE_LETTER from './wordPacks/NINE_LETTER/validGuesses.json';
import TEN_LETTER from './wordPacks/TEN_LETTER/validGuesses.json';
import ELEVEN_LETTER from './wordPacks/ELEVEN_LETTER/validGuesses.json';

const validGuessLists: { [key: string]: string[] } = {
  'FOUR_LETTER': FOUR_LETTER,
  'FIVE_LETTER': FIVE_LETTER,
  'SIX_LETTER': SIX_LETTER,
  'SEVEN_LETTER': SEVEN_LETTER,
  'EIGHT_LETTER': EIGHT_LETTER,
  'NINE_LETTER': NINE_LETTER,
  'TEN_LETTER': TEN_LETTER,
  'ELEVEN_LETTER': ELEVEN_LETTER
}

export function getValidGuesses(wordList: string) {
  return validGuessLists[wordList]
}

export const VALID_GUESSES = getValidGuesses('FIVE_LETTER');
