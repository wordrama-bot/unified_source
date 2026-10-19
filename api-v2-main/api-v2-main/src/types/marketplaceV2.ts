export type MarketplaceItemType =
  | 'WORD_PACK'
  | 'THEME'
  | 'AVATAR'
  | 'BUNDLE';

export type EntitlementType =
  | 'WORD_PACK'
  | 'THEME'
  | 'AVATAR'
  | 'AVATAR_STYLE'
  | 'FEATURE';

export interface CatalogItem {
  catalogItemId: string
  sku: string
  itemType: MarketplaceItemType
  itemName: string
  image?: string

  priceCoins: number
  priceUsdCents?: number
  stripePriceEnvVar?: string

  entitlementKey: string
  entitlementType: EntitlementType

  isPurchasable: boolean
  isStripePurchasable?: boolean
}
