export type MarketplaceItemType =
  | 'WORD_PACK'
  | 'THEME'
  | 'AVATAR';

export type EntitlementType =
  | 'WORD_PACK'
  | 'THEME'
  | 'AVATAR'
  | 'FEATURE';

export interface CatalogItem {
  catalogItemId: string
  sku: string
  itemType: MarketplaceItemType
  itemName: string

  priceCoins: number
  priceUsdCents?: number
  stripePriceEnvVar?: string

  entitlementKey: string
  entitlementType: EntitlementType

  isPurchasable: boolean
  isStripePurchasable?: boolean
}
