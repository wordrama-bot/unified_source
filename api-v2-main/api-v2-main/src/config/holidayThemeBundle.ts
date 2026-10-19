/**
 * Wordrama 2026 Fall/Winter Holiday Themes
 *
 * Seven individual Stripe purchases ($0.99 each)
 * or one complete Stripe bundle ($3.99).
 *
 * Permanent ownership, independent of subscriptions.
 */

export const HOLIDAY_THEME_BUNDLE = {
  catalogItemId: 'd9730def-c114-405d-9395-9dd1345de763',
  sku: 'BUNDLE-FALL-WINTER-2026',
  name: '2026 Fall/Winter Holiday Themes',
  entitlementKey: 'BUNDLE:FALL_WINTER_2026',
  priceUsdCents: 399,

  themes: [
    {
      catalogItemId: '1372a7b8-9445-437d-8852-1f4bcb7366c9',
      sku: 'THEME-HAUNTED-HOLLOW',
      entitlementKey: 'THEME:HAUNTED_HOLLOW',
    },
    {
      catalogItemId: 'a5b473b5-5c42-4073-aa8f-f17c762f37db',
      sku: 'THEME-PUMPKIN-FRIGHT',
      entitlementKey: 'THEME:PUMPKIN_FRIGHT',
    },
    {
      catalogItemId: '43af0984-2268-4ab6-93e3-7e5299d63657',
      sku: 'THEME-HARVEST-HEARTH',
      entitlementKey: 'THEME:HARVEST_HEARTH',
    },
    {
      catalogItemId: '8ceef83c-50aa-44af-bc4f-8769e681d0e7',
      sku: 'THEME-EVERGREEN-NOEL',
      entitlementKey: 'THEME:EVERGREEN_NOEL',
    },
    {
      catalogItemId: '92627593-4806-40fd-a664-37bf93912e95',
      sku: 'THEME-WINTER-WONDERLAND',
      entitlementKey: 'THEME:WINTER_WONDERLAND',
    },
    {
      catalogItemId: 'b42950a2-c2ce-4a75-9fcf-110335c464af',
      sku: 'THEME-FESTIVAL-OF-LIGHTS',
      entitlementKey: 'THEME:FESTIVAL_OF_LIGHTS',
    },
    {
      catalogItemId: 'f13e3c3d-6b78-48c0-91ab-da28e1d27314',
      sku: 'THEME-UMOJA',
      entitlementKey: 'THEME:UMOJA',
    },
  ],
} as const;
