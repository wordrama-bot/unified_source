import type { CatalogItem } from '../../types/marketplaceV2'

const CATALOG: CatalogItem[] = [
  {
    catalogItemId: 'wordpack_4_letter',
    sku: 'WP-4',
    itemType: 'WORD_PACK',
    itemName: '4 Letter Pack',
    priceCoins: 500,
    entitlementKey: 'WORD_PACK:FOUR_LETTER',
    entitlementType: 'WORD_PACK',
    isPurchasable: true,
  },
  {
    catalogItemId: 'wordpack_12_letter',
    sku: 'WP-12',
    itemType: 'WORD_PACK',
    itemName: '12 Letter Pack',
    priceCoins: 1200,
    entitlementKey: 'WORD_PACK:TWELVE_LETTER',
    entitlementType: 'WORD_PACK',
    isPurchasable: true,
  },
]

export function getCatalogItemsByIds(ids: string[]): CatalogItem[] {
  const map = new Map(CATALOG.map(item => [item.catalogItemId, item]))
  return ids.map(id => map.get(id)).filter(Boolean) as CatalogItem[]
}