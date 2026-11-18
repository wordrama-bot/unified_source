import { describe, expect, it } from 'bun:test';
import { gameDefaultState, initialState, wordleDefaultState } from '../src/redux/wordle/defaultStates.ts';

describe('new pack board isolation', () => {
  it('reserves a fresh board for each new pack in both modes', () => {
    for (const mode of ['DAILY', 'INFINITE']) {
      for (const pack of ['THREE_LETTER', 'FIVE_LETTER_UNHINGED']) {
        expect(initialState.modes[mode][pack]).toEqual(gameDefaultState);
        expect(initialState.modes[mode][pack].guesses).toEqual([]);
      }
    }
  });

  it('preserves the existing default pack and modes', () => {
    expect(initialState.wordPack).toBe('FIVE_LETTER');
    expect(initialState.gameMode).toBe('INFINITE');
    expect(wordleDefaultState.FIVE_LETTER).toEqual(gameDefaultState);
    expect(wordleDefaultState.FIVE_LETTER_CRAZY).toEqual(gameDefaultState);
  });
});
