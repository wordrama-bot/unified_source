import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '@/lib/config'

type BalanceResponse = {
  success: boolean
  data: {
    id: string
    player_id: string
    currency_code: string
    available_balance: number
    pending_balance?: number
    updated_at?: string
  }
}

type Entitlement = {
  id: string
  player_id: string
  catalog_item_id: string
  entitlement_type?: string
  status?: string
  created_at?: string
}

type EntitlementsResponse = {
  success: boolean
  data: Entitlement[]
}

type CheckoutCoinsRequest = {
  items: {
    catalogItemId: string
  }[]
  idempotencyKey: string
}

type CheckoutCoinsResponse = {
  success: boolean
  data?: {
    order_id?: string
    entitlement_id?: string
    balance_after?: number
    catalog_item_id?: string
  }
  error?: {
    code?: string
    message?: string
  }
}

export const marketplaceV2Api = createApi({
  reducerPath: 'marketplaceV2Api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/v3/marketplace-v2`,
    credentials: "include",
    prepareHeaders: (headers) => {
      try {
        const projectRef = "qflfxxbnhwaxkxsygjqu";
        const raw = localStorage.getItem(`sb-${projectRef}-auth-token`);

        if (raw) {
          const session = JSON.parse(raw);

          const accessToken =
            session?.access_token ||
            session?.currentSession?.access_token ||
            session?.data?.session?.access_token;

          if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`);
          }
        }
      } catch (e) {
        // ignore parse errors
      }

      return headers;
    },
  }),
  tagTypes: ['MarketplaceBalance', 'MarketplaceEntitlements'],
  endpoints: builder => ({
    getMarketplaceBalance: builder.query<BalanceResponse, void>({
      query: () => ({
        url: '/balance',
        method: 'GET',
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ['MarketplaceBalance']
    }),

    getMarketplaceEntitlements: builder.query<EntitlementsResponse, void>({
      query: () => ({
        url: '/entitlements',
        method: 'GET',
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ['MarketplaceEntitlements']
    }),

    checkoutMarketplaceCoins: builder.mutation<
      CheckoutCoinsResponse,
      CheckoutCoinsRequest
    >({
      query: body => ({
        url: '/checkout/coins',
        method: 'POST',
        body,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      invalidatesTags: ['MarketplaceBalance', 'MarketplaceEntitlements']
    })
  })
})

export const {
  useGetMarketplaceBalanceQuery,
  useGetMarketplaceEntitlementsQuery,
  useCheckoutMarketplaceCoinsMutation
} = marketplaceV2Api