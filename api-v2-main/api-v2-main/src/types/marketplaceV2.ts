export interface CatalogItem {
  catalogItemId: string
  sku: string
  itemType: string
  itemName: string

  priceCoins: number
  priceUsdCents?: number
  stripePriceEnvVar?: string

  entitlementKey: string
  entitlementType: string

  isPurchasable: boolean
  isStripePurchasable?: boolean
}
