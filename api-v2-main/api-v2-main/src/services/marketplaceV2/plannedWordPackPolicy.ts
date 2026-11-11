/**
 * Future word-pack rules. Not connected to billing, grants, or gameplay yet.
 * A fail-closed rollout gate prevents accidental sales before content and
 * database/API support are available.
 */
export const PLANNED_WORD_PACKS = {
  THREE_LETTER: {
    entitlementKey: 'WORD_PACK:THREE_LETTER',
    wordLength: 3,
    usdCents: 99,
    coins: 1000,
    subscriptionAccess: ['PLUS', 'CREATOR'],
    purchaseChannels: ['COINS', 'STRIPE'],
    enabled: false,
  },
  THREE_LETTER_CRAZY: {
    entitlementKey: 'WORD_PACK:THREE_LETTER_CRAZY',
    wordLength: 3,
    usdCents: 99,
    coins: 1000,
    subscriptionAccess: ['PLUS', 'CREATOR'],
    purchaseChannels: ['COINS', 'STRIPE'],
    enabled: false,
  },
  FIVE_LETTER_UNHINGED: {
    entitlementKey: 'WORD_PACK:FIVE_LETTER_UNHINGED',
    wordLength: 5,
    usdCents: 299,
    coins: null,
    subscriptionAccess: [],
    purchaseChannels: ['STRIPE'],
    enabled: false,
  },
} as const;

export type PlannedPack = keyof typeof PLANNED_WORD_PACKS;
export type PackPurchaseChannel = 'COINS' | 'STRIPE' | 'SUBSCRIPTION';

/** Deny access until enabled; never use this in place of verifying payment ownership. */
export function isPlannedPackChannelAllowed(
  pack: PlannedPack,
  channel: PackPurchaseChannel,
): boolean {
  const config = PLANNED_WORD_PACKS[pack];
  return config.enabled &&
    (config.purchaseChannels as readonly string[]).includes(channel);
}

export function canPlannedPackBeSubscriptionUnlocked(
  pack: PlannedPack,
  subscription: string,
): boolean {
  const config = PLANNED_WORD_PACKS[pack];
  return config.enabled &&
    (config.subscriptionAccess as readonly string[]).includes(subscription);
}

/** Deny entitlement grants for planned packs until their release gate opens. */
export function isPlannedPackEntitlementGrantAllowed(entitlementKey: string): boolean {
  const planned = Object.values(PLANNED_WORD_PACKS).find(
    pack => pack.entitlementKey === entitlementKey,
  );
  return !planned || planned.enabled;
}
