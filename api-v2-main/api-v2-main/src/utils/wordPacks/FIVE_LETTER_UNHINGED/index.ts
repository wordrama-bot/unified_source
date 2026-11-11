import UNHINGED_GUESSES from './validGuesses.json';
import WORD_LIST from './wordList.json';
import DAILY_WORD_LIST from './dailyWordList.json';
import FIVE_LETTER from '../FIVE_LETTER';

// Accept every regular 5-letter guess plus every Unhinged answer.
// Only the 524 curated Unhinged words can ever be solutions.
const VALID_GUESSES = Array.from(new Set([
  ...FIVE_LETTER.VALID_GUESSES,
  ...UNHINGED_GUESSES,
]));

export default {
  VALID_GUESSES,
  VALID_GUESSES_LENGTH: VALID_GUESSES.length,
  WORD_LIST,
  WORD_LIST_LENGTH: WORD_LIST.length,
  DAILY_WORD_LIST,
  DAILY_WORD_LIST_LENGTH: DAILY_WORD_LIST.length,
};
