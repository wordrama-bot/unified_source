import FOUR_LETTER from './wordPacks/FOUR_LETTER/wordList.json';
import FIVE_LETTER from './wordPacks/FIVE_LETTER/wordList.json';
import SIX_LETTER from './wordPacks/SIX_LETTER/wordList.json';
import SEVEN_LETTER from './wordPacks/SEVEN_LETTER/wordList.json';
import EIGHT_LETTER from './wordPacks/EIGHT_LETTER/wordList.json';
import NINE_LETTER from './wordPacks/NINE_LETTER/wordList.json';
import TEN_LETTER from './wordPacks/TEN_LETTER/wordList.json';
import ELEVEN_LETTER from './wordPacks/ELEVEN_LETTER/wordList.json';

const wordLists: { [key: string]: string[] } = {
  'FOUR_LETTER': FOUR_LETTER,
  'FIVE_LETTER': FIVE_LETTER,
  'SIX_LETTER': SIX_LETTER,
  'SEVEN_LETTER': SEVEN_LETTER,
  'EIGHT_LETTER': EIGHT_LETTER,
  'NINE_LETTER': NINE_LETTER,
  'TEN_LETTER': TEN_LETTER,
  'ELEVEN_LETTER': ELEVEN_LETTER,
}

export function getWordList(wordPack: string) {
  return wordLists[wordPack]
}

export const WORDS = getWordList('FIVE_LETTER')
