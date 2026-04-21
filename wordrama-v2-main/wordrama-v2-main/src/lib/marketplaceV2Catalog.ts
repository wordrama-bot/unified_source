export type MarketplaceV2CatalogItem = {
  id: string
  label: string
  price: number
  type: 'WORD_PACK' | 'COSMETIC' | 'GAME_MODE'
}

export const marketplaceV2Catalog: MarketplaceV2CatalogItem[] = [
  { id: 'ba8671aa-7481-43e5-a1ac-f2b73433a315', label: '4 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: 'b1b96d0e-5b1a-403e-80be-88f3d2bae873', label: '11 Letter Expansion', price: 1000, type: 'WORD_PACK' },
  { id: '7f06b10e-d52a-4ae3-b77f-a7e9a7c5e5fb', label: '12 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: 'b8c73f14-79ad-4495-9fd9-a4be65d5fcbc', label: '13 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: '3159552d-8c96-4bb5-aafa-ebf36aa5a2c2', label: '14 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: 'fef67eba-96db-4f5e-8b25-81487a1dbc9d', label: '15 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: '1ee2de50-072f-4718-b8ac-7663f3069f2e', label: '16 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: '80e197a9-0829-4074-8e85-a88e6e8b7ea0', label: '17 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: '425c96ab-beff-40ef-9774-feb6db135644', label: '18 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: '1d348c05-c51e-4ea3-a888-d4823436704f', label: '19 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: '6e66a620-8e17-4f75-aa0b-1c282aafb9d8', label: '20 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: '72215e5b-6638-4388-84bc-55dcd36c0e05', label: '21 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: 'db526774-11da-47de-b410-5b47a4168db8', label: '22 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: 'ab14511c-f2ac-4b16-a8ef-7cb8ed61a2cc', label: '23 Letter Pack', price: 1000, type: 'WORD_PACK' },
  { id: '3d3ff93b-65c1-4d36-902e-3a889c71ac86', label: '12–23 Letter Mega Pack', price: 10000, type: 'WORD_PACK' },
]