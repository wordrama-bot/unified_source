// Both 3-letter packs share one cleaned master dictionary.
// Populate THREE_LETTER/validGuesses.json with the master list.
// Regular solutions live in THREE_LETTER/wordList.json.
// Crazy solutions and daily answers use the entire master list.
import MASTER_WORDS from '../THREE_LETTER/validGuesses.json';

export default {
  VALID_GUESSES: MASTER_WORDS,
  VALID_GUESSES_LENGTH: MASTER_WORDS.length,
  WORD_LIST: MASTER_WORDS,
  WORD_LIST_LENGTH: MASTER_WORDS.length,
  DAILY_WORD_LIST: MASTER_WORDS,
  DAILY_WORD_LIST_LENGTH: MASTER_WORDS.length,
};
