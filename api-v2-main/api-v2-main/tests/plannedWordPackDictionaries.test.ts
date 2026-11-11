import { describe, expect, test } from 'bun:test';
import THREE_LETTER from '../src/utils/wordPacks/THREE_LETTER';
import THREE_LETTER_CRAZY from '../src/utils/wordPacks/THREE_LETTER_CRAZY';
import FIVE_LETTER_UNHINGED from '../src/utils/wordPacks/FIVE_LETTER_UNHINGED';

const packs = [
  { name: 'THREE_LETTER', length: 3, data: THREE_LETTER },
  { name: 'THREE_LETTER_CRAZY', length: 3, data: THREE_LETTER_CRAZY },
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


describe('5 Letter Unhinged source-list contract', () => {
  test('uses the curated five-letter solution list and accepts every regular five-letter guess', async () => {
    const FIVE_LETTER = (await import('../src/utils/wordPacks/FIVE_LETTER')).default;
    expect(FIVE_LETTER_UNHINGED.WORD_LIST.length).toBeGreaterThan(0);
    expect(FIVE_LETTER_UNHINGED.DAILY_WORD_LIST).toHaveLength(FIVE_LETTER_UNHINGED.WORD_LIST.length);
    for (const word of FIVE_LETTER.VALID_GUESSES) {
      expect(FIVE_LETTER_UNHINGED.VALID_GUESSES).toContain(word);
    }
  });
});


describe('new pack boundaries', () => {
  test('regular 3-letter solutions are a subset of Crazy solutions', () => {
    for (const word of THREE_LETTER.WORD_LIST) {
      expect(THREE_LETTER_CRAZY.WORD_LIST).toContain(word);
    }
    expect(THREE_LETTER_CRAZY.WORD_LIST).toEqual(THREE_LETTER.VALID_GUESSES);
  });

  test('daily answers are permutations of their pack solution lists', () => {
    for (const pack of [THREE_LETTER, THREE_LETTER_CRAZY, FIVE_LETTER_UNHINGED]) {
      expect([...pack.DAILY_WORD_LIST].sort()).toEqual([...pack.WORD_LIST].sort());
    }
  });
});
