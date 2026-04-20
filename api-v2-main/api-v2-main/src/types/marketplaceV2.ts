export type MarketplaceV2ItemType =
  | 'WORD_PACK'
  | 'THEME'
  | 'SUBSCRIPTION'
  | 'FEATURE'

export type CheckoutCartItemInput = {
  catalogItemId: string
  quantity?: number
}

export type CheckoutWithCoinsBody = {
  items: CheckoutCartItemInput[]
  idempotencyKey: string
}

export type CatalogItem = {
  catalogItemId: string
  sku?: string
  itemType: MarketplaceV2ItemType
  itemName: string
  priceCoins: number
  entitlementKey?: string
  entitlementType?: string
  isPurchasable: boolean
}