import { describe, expect, test } from 'bun:test';
import { SUBSCRIPTION_ENTITLEMENTS } from '../src/config/subscriptionEntitlements';
import { CATALOG } from '../src/services/marketplaceV2/catalog';
import {
  PLANNED_WORD_PACKS,
  canPlannedPackBeSubscriptionUnlocked,
  isPlannedPackChannelAllowed,
  isPlannedPackEntitlementGrantAllowed,
} from '../src/services/marketplaceV2/plannedWordPackPolicy';

describe('new word pack channel rules', () => {
  test('allows only the intended channels and subscriptions', () => {
    for (const pack of ['THREE_LETTER', 'THREE_LETTER_CRAZY'] as const) {
      expect(isPlannedPackChannelAllowed(pack, 'COINS')).toBe(true);
      expect(isPlannedPackChannelAllowed(pack, 'STRIPE')).toBe(true);
      expect(isPlannedPackChannelAllowed(pack, 'SUBSCRIPTION')).toBe(false);
      expect(canPlannedPackBeSubscriptionUnlocked(pack, 'PLUS')).toBe(true);
      expect(canPlannedPackBeSubscriptionUnlocked(pack, 'CREATOR')).toBe(true);
      expect(canPlannedPackBeSubscriptionUnlocked(pack, 'FREE')).toBe(false);
    }
    expect(isPlannedPackChannelAllowed('FIVE_LETTER_UNHINGED', 'COINS')).toBe(false);
    expect(isPlannedPackChannelAllowed('FIVE_LETTER_UNHINGED', 'STRIPE')).toBe(true);
    expect(isPlannedPackChannelAllowed('FIVE_LETTER_UNHINGED', 'SUBSCRIPTION')).toBe(false);
    expect(canPlannedPackBeSubscriptionUnlocked('FIVE_LETTER_UNHINGED', 'PLUS')).toBe(false);
    expect(canPlannedPackBeSubscriptionUnlocked('FIVE_LETTER_UNHINGED', 'CREATOR')).toBe(false);
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


describe('planned pack entitlement grant gate', () => {
  test('allows enabled pack entitlements without blocking existing packs', () => {
    for (const pack of Object.values(PLANNED_WORD_PACKS)) {
      expect(isPlannedPackEntitlementGrantAllowed(pack.entitlementKey)).toBe(true);
    }
    expect(isPlannedPackEntitlementGrantAllowed('WORD_PACK:FOUR_LETTER')).toBe(true);
    expect(isPlannedPackEntitlementGrantAllowed('THEME:ICE')).toBe(true);
  });
});


describe('subscription pack release safety', () => {
  test('PLUS and CREATOR include both three-letter packs but never Unhinged', () => {
    for (const plan of ['PLUS', 'CREATOR'] as const) {
      const keys: readonly string[] = SUBSCRIPTION_ENTITLEMENTS[plan];
      expect(keys).toContain('WORD_PACK:THREE_LETTER');
      expect(keys).toContain('WORD_PACK:THREE_LETTER_CRAZY');
      expect(keys).not.toContain('WORD_PACK:FIVE_LETTER_UNHINGED');
      expect(keys.filter(isPlannedPackEntitlementGrantAllowed)).toContain('WORD_PACK:THREE_LETTER');
      expect(keys.filter(isPlannedPackEntitlementGrantAllowed)).toContain('WORD_PACK:THREE_LETTER_CRAZY');
    }
  });
});
