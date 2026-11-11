import { describe, expect, test } from 'bun:test';
import { CATALOG } from '../src/services/marketplaceV2/catalog';
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


describe('planned marketplace catalog entries', () => {
  test('each planned pack has unique metadata and remains unavailable for purchase', () => {
    const expectations = [
      ['WORD_PACK:THREE_LETTER', 1000, 99],
      ['WORD_PACK:THREE_LETTER_CRAZY', 1000, 99],
      ['WORD_PACK:FIVE_LETTER_UNHINGED', 0, 299],
    ] as const;
    const ids = new Set(CATALOG.map(item => item.catalogItemId));
    expect(ids.size).toBe(CATALOG.length);
    for (const [key, coins, usd] of expectations) {
      const items = CATALOG.filter(item => item.entitlementKey === key);
      expect(items).toHaveLength(1);
      const item = items[0];
      expect(item.itemType).toBe('WORD_PACK');
      expect(item.priceCoins).toBe(coins);
      expect(item.priceUsdCents).toBe(usd);
      expect(item.isPurchasable).toBe(false);
      expect(item.isStripePurchasable).toBe(false);
    }
  });
});
