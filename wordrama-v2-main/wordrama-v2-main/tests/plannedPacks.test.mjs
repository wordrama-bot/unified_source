import { describe, expect, it } from 'bun:test';
import { isPlannedPackAvailable, plannedWordPacks } from '../src/lib/wordle/plannedPacks.ts';

describe('planned word pack release gates', () => {
  it('keeps both packs disabled until dictionaries and backend checks are ready', () => {
    expect(plannedWordPacks.THREE_LETTER.enabled).toBe(false);
    expect(plannedWordPacks.FIVE_LETTER_UNHINGED.enabled).toBe(false);
    expect(isPlannedPackAvailable('THREE_LETTER', { owned: true })).toBe(false);
    expect(isPlannedPackAvailable('FIVE_LETTER_UNHINGED', { owned: true })).toBe(false);
  });

  it('records the requested prices and purchase channels', () => {
    expect(plannedWordPacks.THREE_LETTER.usdPriceCents).toBe(99);
    expect(plannedWordPacks.THREE_LETTER.coinPrice).toBe(1000);
    expect(plannedWordPacks.THREE_LETTER.includedSubscriptions).toEqual(['PLUS', 'CREATOR']);
    expect(plannedWordPacks.FIVE_LETTER_UNHINGED.usdPriceCents).toBe(299);
    expect(plannedWordPacks.FIVE_LETTER_UNHINGED.allowCoinPurchase).toBe(false);
    expect(plannedWordPacks.FIVE_LETTER_UNHINGED.includedSubscriptions).toEqual([]);
  });
});
