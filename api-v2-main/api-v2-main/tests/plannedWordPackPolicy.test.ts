import { describe, expect, test } from 'bun:test';
import {
  PLANNED_WORD_PACKS,
  canPlannedPackBeSubscriptionUnlocked,
  isPlannedPackChannelAllowed,
} from '../src/services/marketplaceV2/plannedWordPackPolicy';

describe('future word pack backend release gates', () => {
  test('both packs fail closed on every purchase channel', () => {
    for (const pack of ['THREE_LETTER', 'THREE_LETTER_CRAZY', 'FIVE_LETTER_UNHINGED'] as const) {
      for (const channel of ['COINS', 'STRIPE', 'SUBSCRIPTION'] as const) {
        expect(isPlannedPackChannelAllowed(pack, channel)).toBe(false);
      }
      expect(canPlannedPackBeSubscriptionUnlocked(pack, 'PLUS')).toBe(false);
      expect(canPlannedPackBeSubscriptionUnlocked(pack, 'CREATOR')).toBe(false);
    }
  });

  test('captures permanent pricing and subscription requirements', () => {
    expect(PLANNED_WORD_PACKS.THREE_LETTER.usdCents).toBe(99);
    expect(PLANNED_WORD_PACKS.THREE_LETTER.coins).toBe(1000);
    expect(PLANNED_WORD_PACKS.THREE_LETTER.subscriptionAccess).toEqual(['PLUS', 'CREATOR']);
    expect(PLANNED_WORD_PACKS.THREE_LETTER_CRAZY.usdCents).toBe(99);
    expect(PLANNED_WORD_PACKS.THREE_LETTER_CRAZY.coins).toBe(1000);
    expect(PLANNED_WORD_PACKS.THREE_LETTER_CRAZY.subscriptionAccess).toEqual(['PLUS', 'CREATOR']);
    expect(PLANNED_WORD_PACKS.FIVE_LETTER_UNHINGED.usdCents).toBe(299);
    expect(PLANNED_WORD_PACKS.FIVE_LETTER_UNHINGED.coins).toBeNull();
    expect(PLANNED_WORD_PACKS.FIVE_LETTER_UNHINGED.purchaseChannels).toEqual(['STRIPE']);
    expect(PLANNED_WORD_PACKS.FIVE_LETTER_UNHINGED.subscriptionAccess).toEqual([]);
  });
});
