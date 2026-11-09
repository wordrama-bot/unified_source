import { describe, expect, test } from 'bun:test';
import THREE_LETTER from '../src/utils/wordPacks/THREE_LETTER';
import FIVE_LETTER_UNHINGED from '../src/utils/wordPacks/FIVE_LETTER_UNHINGED';

const packs = [
  { name: 'THREE_LETTER', length: 3, data: THREE_LETTER },
  { name: 'FIVE_LETTER_UNHINGED', length: 5, data: FIVE_LETTER_UNHINGED },
];

describe('planned dictionary files', () => {
  for (const { name, length, data } of packs) {
    test(name + ' has valid word arrays and consistent metadata', () => {
      const entries = [data.WORD_LIST, data.VALID_GUESSES, data.DAILY_WORD_LIST];
      for (const words of entries) {
        expect(Array.isArray(words)).toBe(true);
        expect(new Set(words).size).toBe(words.length);
        for (const word of words) {
          expect(typeof word).toBe('string');
          expect(word).toMatch(new RegExp('^[a-z]{' + length + '}$'));
        }
      }
      expect(data.WORD_LIST_LENGTH).toBe(data.WORD_LIST.length);
      expect(data.VALID_GUESSES_LENGTH).toBe(data.VALID_GUESSES.length);
      expect(data.DAILY_WORD_LIST_LENGTH).toBe(data.DAILY_WORD_LIST.length);
      for (const word of data.DAILY_WORD_LIST) {
        expect(data.WORD_LIST).toContain(word);
      }
      for (const word of data.WORD_LIST) {
        expect(data.VALID_GUESSES).toContain(word);
      }
    });
  }
});
