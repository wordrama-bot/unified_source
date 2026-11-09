/**
 * Planned word packs. Not wired into the active game, store, or entitlement flow.
 * Keep these disabled until backend validation, SQL migrations, and word lists are ready.
 */
export const plannedWordPacks = {
  THREE_LETTER: {
    id: 'THREE_LETTER',
    length: 3,
    coinPrice: 1000,
    usdPriceCents: 99,
    includedSubscriptions: ['PLUS', 'CREATOR'],
    allowCoinPurchase: true,
    allowStripePurchase: true,
    enabled: false,
  },
  FIVE_LETTER_UNHINGED: {
    id: 'FIVE_LETTER_UNHINGED',
    length: 5,
    coinPrice: null,
    usdPriceCents: 299,
    includedSubscriptions: [],
    allowCoinPurchase: false,
    allowStripePurchase: true,
    enabled: false,
  },
} as const;

export type PlannedWordPackId = keyof typeof plannedWordPacks;

/** Only use for UI display; backend must enforce the same policy independently. */
export function isPlannedPackAvailable(
  packId: PlannedWordPackId,
  options: { owned: boolean; subscription?: string | null },
): boolean {
  const pack = plannedWordPacks[packId];
  if (!pack.enabled) return false;
  if (options.owned) return true;
  return (pack.includedSubscriptions as readonly string[]).includes(options.subscription ?? '');
}
