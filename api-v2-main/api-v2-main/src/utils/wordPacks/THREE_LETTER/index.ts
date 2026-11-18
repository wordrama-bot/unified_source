import VALID_GUESSES from './validGuesses.json';
import WORD_LIST from './wordList.json';
import DAILY_WORD_LIST from './dailyWordList.json';
import { threeLetterDailyOrder } from '../threeLetterDailyOrder';

export default {
  VALID_GUESSES,
  VALID_GUESSES_LENGTH: VALID_GUESSES.length,
  WORD_LIST,
  WORD_LIST_LENGTH: WORD_LIST.length,
  DAILY_WORD_LIST: threeLetterDailyOrder(DAILY_WORD_LIST, 31032026),
  DAILY_WORD_LIST_LENGTH: DAILY_WORD_LIST.length,
};
