// Import necessary functions and types from RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/config";
import { supabase } from "@/utils/supabase/client";

const projectRef = "qflfxxbnhwaxkxsygjqu";

function getStoredSupabaseAccessToken() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(`sb-${projectRef}-auth-token`);
    if (!raw) return null;

    const session = JSON.parse(raw);

    return (
      session?.access_token ||
      session?.currentSession?.access_token ||
      session?.data?.session?.access_token ||
      null
    );
  } catch (e) {
    console.warn("[wordramaApi] Failed to parse stored Supabase token", e);
    return null;
  }
}

// Setting up the API Slice
export const wordramaApiV3 = createApi({
  reducerPath: "wordramaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: async (headers) => {
      try {
        const { data } = await supabase.auth.getSession();

        const accessToken =
          data?.session?.access_token ||
          getStoredSupabaseAccessToken();

        if (accessToken) {
          headers.set("authorization", `Bearer ${accessToken}`);
        }
      } catch (e) {
        const fallbackToken = getStoredSupabaseAccessToken();

        if (fallbackToken) {
          headers.set("authorization", `Bearer ${fallbackToken}`);
        }
      }

      return headers;
    },
  }),
  tagTypes: [
    "Player",
    "Stats",
    "WordleDailyStats",
    "WordleWeeklyStats",
    "WordleMonthlyStats",
    "WordleYearlyStats",
    "WordleAllTimeStats",
    "WordleWoTD",
    "WordleLast30",
    "WordPack",
    "WordPacks",
    "Settings",
    "Leaderboard",
    "LeaderboardDaily",
    "LeaderboardWeekly",
    "LeaderboardMonthly",
    "LeaderboardYearly",
    "LeaderboardAllTime",
    "Wordle",
    "CustomWordle",
    "WordleSavedState",
    "UiSavedState",
    "Spellbee",
    "WordleStreak",
    "StoreItems",
    "Purchases",
    "Challenges",
    "PublicProfile",
    "Admin",
  ],
  endpoints: (builder) => ({
    getWordleStreakByUserId: builder.query<
      any,
      { gameMode: string; wordPack: string; playerId: string }
    >({
      query: ({ gameMode, wordPack, playerId }) => ({
        url: `/api/v3/leaderboard/wordle/streak/${gameMode}/${wordPack}/${playerId}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
    }),

    getLast30Wordles: builder.query<any, string>({
      query: (wordPack) => ({
        url: `/api/v3/game/wordle/last-30/${wordPack}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["WordleLast30"],
    }),

    getWordleStreak: builder.query<any, { gameMode: string; wordPack: string }>({
      query: ({ gameMode, wordPack }) => ({
        url: `/api/v3/leaderboard/wordle/streak/${gameMode}/${wordPack}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["WordleStreak"],
    }),

    /**
     * ✅ FIXED: Challenges must be requested by playerId (service expects player_id)
     * This replaces the broken version that referenced `playerId` out of scope.
     */
    getMyChallenges: builder.query<
      any,
      { playerId: string; statusFilter: string }
    >({
      query: ({ playerId, statusFilter }) => ({
        url: `/api/v3/challenges/${playerId}?statusFilter=${statusFilter}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Challenges"],
    }),

    /**
     * Backwards-compatible alias so existing pages using useGetChallengesByUserIdQuery keep working.
     * Uses the same route as getMyChallenges.
     */
    getChallengesByUserId: builder.query<
      any,
      { playerId: string; filter: string }
    >({
      query: ({ playerId, filter }) => ({
        url: `/api/v3/challenges/${playerId}?statusFilter=${filter}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Challenges"],
    }),

    getStoreItems: builder.query<
      {
        id: string;
        coinPrice: number;
        realPrice: string;
        name: string;
        purchasableWithCoins: boolean;
        purchasableWithMoney: boolean;
        discontinued: boolean;
        marketplaceImage?: string;
        type: string;
        rarity: string;
        itemImage?: string;
      }[],
      {
        minCoinPrice: number;
        maxCoinPrice: number;
        gameFilter: string;
        itemTypeFilter: string;
        showPurchased: boolean;
        showUnavailable: boolean;
      }
    >({
      query: ({
        minCoinPrice,
        maxCoinPrice,
        gameFilter,
        itemTypeFilter,
        showPurchased,
        showUnavailable,
      }) => ({
        url: `/api/v3/store/items?minCoinPrice=${minCoinPrice}&maxCoinPrice=${maxCoinPrice}&gameFilter=${gameFilter}&itemTypeFilter=${itemTypeFilter}&showPurchased=${showPurchased}&showUnavailable=${showUnavailable}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["StoreItems"],
    }),

    purchaseItemsWithCoins: builder.mutation<any, string[]>({
      query: (items) => ({
        url: `/api/v3/store/purchase/with-coins`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: { items },
      }),
      invalidatesTags: ["Player", "StoreItems", "Purchases"],
    }),

    getPurchases: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/store/purchases`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Purchases"],
    }),

    getWordleWordPack: builder.query<any, string>({
      query: (wordPack) => ({
        url: `/api/v3/game/wordle/wordpack/${wordPack}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["WordPack"],
    }),

    getMyWordPacks: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/game/wordle/wordpacks`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["WordPacks"],
    }),

    getWordleWoTD: builder.query<any, string>({
      query: (wordPack) => ({
        url: `/api/v3/game/wordle/wordPack/${wordPack}/todays-word`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["WordleWoTD"],
    }),

    getWordleSavedState: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/game/wordle/game-state`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["WordleSavedState"],
    }),

    updateWordleSavedState: builder.mutation<any, any>({
      query: (gameState) => ({
        url: `/api/v3/game/wordle/game-state`,
        method: "POST",
        body: gameState,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      invalidatesTags: [
        "Player",
        "WordleLast30",
        "WordleSavedState",
        "WordleStreak",
        "Stats",
        "Leaderboard",
        "Wordle",
        "WordleDailyStats",
        "WordleWeeklyStats",
        "WordleMonthlyStats",
        "WordleYearlyStats",
        "WordleAllTimeStats",
      ],
    }),

    getUiSavedState: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/ui/state`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["UiSavedState"],
    }),

    updateUiSavedState: builder.mutation<any, any>({
      query: (uiState) => ({
        url: `/api/v3/ui/state`,
        method: "POST",
        body: uiState,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      invalidatesTags: ["UiSavedState"],
    }),

    getCustomWorlde: builder.query<any, string>({
      query: (shareCode) => ({
        url: `/api/v3/game/wordle/custom/${shareCode}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Wordle", "CustomWordle"],
    }),

    getMyDailyWordleStats: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/leaderboard/wordle/stats/today`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["WordleDailyStats"],
    }),

    getMyWeeklyWordleStats: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/leaderboard/wordle/stats/weekly`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["WordleWeeklyStats"],
    }),

    getMyMonthlyWordleStats: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/leaderboard/wordle/stats/monthly`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["WordleMonthlyStats"],
    }),

    getMyYearlyWordleStats: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/leaderboard/wordle/stats/yearly`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["WordleYearlyStats"],
    }),

    getMyAllTimeWordleStats: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/leaderboard/wordle/stats/all-time`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["WordleAllTimeStats"],
    }),

    getMyAllTimeWordleStatsByGameMode: builder.query<any, string>({
      query: (gameMode) => ({
        url: `/api/v3/leaderboard/wordle/stats/all-time/${gameMode}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["WordleAllTimeStats"],
    }),

    getDailyWordleLeaderboard: builder.query<any, { page: number; orderBy: string }>({
      query: ({ page, orderBy }) => ({
        url: `/api/v3/leaderboard/wordle/daily?page=${page || 1}&orderBy=${orderBy || "daily_rank"}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard", "LeaderboardDaily"],
    }),

    getWeeklyWordleLeaderboard: builder.query<any, { page: number; orderBy: string }>({
      query: ({ page, orderBy }) => ({
        url: `/api/v3/leaderboard/wordle/weekly?page=${page || 1}&orderBy=${orderBy || "weekly_rank"}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard", "LeaderboardWeekly"],
    }),

    getMonthlyWordleLeaderboard: builder.query<any, { page: number; orderBy: string }>({
      query: ({ page, orderBy }) => ({
        url: `/api/v3/leaderboard/wordle/monthly?page=${page || 1}&orderBy=${orderBy || "monthly_rank"}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard", "LeaderboardMonthly"],
    }),

    getYearlyWordleLeaderboard: builder.query<any, { page: number; orderBy: string }>({
      query: ({ page, orderBy }) => ({
        url: `/api/v3/leaderboard/wordle/yearly?page=${page}&orderBy=${orderBy || "yearly_rank"}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard", "LeaderboardYearly"],
    }),

    getAllTimeWordleLeaderboard: builder.query<any, { page: number; orderBy: string }>({
      query: ({ page, orderBy }) => ({
        url: `/api/v3/leaderboard/wordle/all-time?page=${page || 1}&orderBy=${orderBy || "alltime_rank"}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    getDailyWordleLeaderboardPostitionByUserId: builder.query<any, string>({
      query: (userId) => ({
        url: `/api/v3/leaderboard/wordle/position/daily/${userId}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    getWeeklyWordleLeaderboardPostitionByUserId: builder.query<any, string>({
      query: (userId) => ({
        url: `/api/v3/leaderboard/wordle/position/weekly/${userId}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    getMonthlyWordleLeaderboardPostitionByUserId: builder.query<any, string>({
      query: (userId) => ({
        url: `/api/v3/leaderboard/wordle/position/monthly/${userId}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    getYearlyWordleLeaderboardPostitionByUserId: builder.query<any, string>({
      query: (userId) => ({
        url: `/api/v3/leaderboard/wordle/position/yearly/${userId}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    getAllTimeWordleLeaderboardPostitionByUserId: builder.query<any, string>({
      query: (userId) => ({
        url: `/api/v3/leaderboard/wordle/position/all-time/${userId}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    getMyDailyWordleLeaderboardPostition: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/leaderboard/wordle/position/daily/me`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    getMyWeeklyWordleLeaderboardPostition: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/leaderboard/wordle/position/weekly/me`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    getMyMonthlyWordleLeaderboardPostition: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/leaderboard/wordle/position/monthly/me`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    getMyYearlyWordleLeaderboardPostition: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/leaderboard/wordle/position/yearly/me`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    getMyAllTImeWordleLeaderboardPostition: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/leaderboard/wordle/position/all-time/me`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    getTopPlayers: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/leaderboard`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    getMyAccount: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/player/me`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Player"],
    }),

    getMyEntitlements: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/player/me/entitlements`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Player"],
    }),

    getCurrentSubscription: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/billing/subscription`,
        method: "GET",
        credentials: "include",
      }),
    }),

    createCheckoutSession: builder.mutation<
      any,
      { subscriptionKey: "PLUS" | "CREATOR" }
    >({
      query: (body) => ({
        url: `/api/v3/billing/checkout`,
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
    }),

    changeSubscriptionPlan: builder.mutation<
      any,
      { subscriptionKey: "PLUS" | "CREATOR" }
    >({
      query: ({ subscriptionKey }) => ({
        url: "/api/v3/billing/change-plan",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          subscriptionKey,
        },
      }),
    }),

    createItemCheckoutSession: builder.mutation<
      any,
      { itemId: string }
    >({
      query: (body) => ({
        url: `/api/v3/billing/checkout/item`,
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
    }),

    createBillingPortalSession: builder.mutation<any, void>({
      query: () => ({
        url: `/api/v3/billing/portal`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
    }),
    
    getPublicPlayer: builder.query<any, string>({
      query: (playerId) => ({
        url: `/api/v3/players/by-playerid/${playerId}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["PublicProfile"],
    }),

    getPublicPlayerSummary: builder.query<any, string>({
      query: (playerId) => ({
        url: `/api/v3/players/by-playerid/${playerId}/summary`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["PublicProfile", "Stats", "Leaderboard", "Player"],
    }),

    getPublicPlayerByUsername: builder.query<any, string>({
      query: (username) => ({
        url: `/api/v3/players/by-username?username=${username}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
    }),

    createAccount: builder.mutation<any, any>({
      query: (body) => ({
        url: `/api/v3/player/me`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      }),
      invalidatesTags: ["Player", "Settings", "Stats"],
    }),

    updateAccount: builder.mutation<any, any>({
      query: (body) => ({
        url: `/api/v3/player/me`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      }),
      invalidatesTags: ["Player", "Settings", "Stats"],
    }),

    deleteAccount: builder.mutation<any, void>({
      query: () => ({
        url: `/api/v3/player/me`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      invalidatesTags: ["Player", "Settings", "Stats"],
    }),

    updateSettings: builder.mutation<any, any>({
      query: (body) => ({
        url: `/api/v3/player/me/settings`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      }),
      invalidatesTags: ["Player", "Settings", "Stats"],
    }),

    updateStreamerSettings: builder.mutation<any, any>({
      query: (body) => ({
        url: `/api/v3/streamer/settings`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      }),
      invalidatesTags: ["Player", "Settings", "Stats"],
    }),

    submitWordleResult: builder.mutation<void, any>({
      query: (body) => ({
        url: `/api/v3/game/wordle/result`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      }),
      invalidatesTags: [
        "Player",
        "Stats",
        "Leaderboard",
        "Wordle",
        "WordleDailyStats",
        "WordleWeeklyStats",
        "WordleMonthlyStats",
        "WordleYearlyStats",
      ],
    }),

    migration: builder.mutation<void, void>({
      query: () => ({
        url: `/api/v3/migrate/me`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      invalidatesTags: ["Player", "PublicProfile"],
    }),

    submitSpellbeeResult: builder.mutation<void, any>({
      query: (body) => ({
        url: `/api/v3/game/spellbee/result`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      }),
      invalidatesTags: ["Stats", "Leaderboard", "Spellbee"],
    }),

        getAdminMe: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/admin/me`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Admin"],
    }),

    getAdminOverview: builder.query<any, void>({
      query: () => ({
        url: `/api/v3/admin/overview`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Admin"],
    }),

    searchAdminPlayers: builder.query<any, string>({
      query: (q) => ({
        url: `/api/v3/admin/players/search?q=${encodeURIComponent(q)}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Admin"],
    }),

    getAdminPlayerProfile: builder.query<any, string>({
      query: (playerId) => ({
        url: `/api/v3/admin/players/${playerId}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Admin"],
    }),

    getAdminPlayerNotes: builder.query<any, string>({
      query: (playerId) => ({
        url: `/api/v3/admin/players/${playerId}/notes`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Admin"],
    }),

    addAdminPlayerNote: builder.mutation<
      any,
      { playerId: string; note: string }
    >({
      query: ({ playerId, note }) => ({
        url: `/api/v3/admin/players/${playerId}/notes`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: { note },
      }),
      invalidatesTags: ["Admin"],
    }),

    grantAdminPlayerCoins: builder.mutation<
      any,
      { playerId: string; amount: number; reason: string }
    >({
      query: ({ playerId, amount, reason }) => ({
        url: `/api/v3/admin/players/${playerId}/coins/grant`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: { amount, reason },
      }),
      invalidatesTags: ["Admin"],
    }),

    banAdminPlayer: builder.mutation<
      any,
      {
        playerId: string;
        reason: string;
        notes?: string;
        expiresAt?: string | null;
        banTargets?: { banType: string; banValue: string }[];
      }
    >({
      query: ({ playerId, reason, notes, expiresAt, banTargets }) => ({
        url: `/api/v3/admin/players/${playerId}/ban`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: { reason, notes, expiresAt, banTargets },
      }),
      invalidatesTags: ["Admin"],
    }),

    unbanAdminPlayer: builder.mutation<
      any,
      { playerId: string; reason: string }
    >({
      query: ({ playerId, reason }) => ({
        url: `/api/v3/admin/players/${playerId}/unban`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: { reason },
      }),
      invalidatesTags: ["Admin"],
    }),

    createCustomWorlde: builder.mutation<void, any>({
      query: (body) => ({
        url: `/api/v3/game/wordle/custom`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      }),
      invalidatesTags: ["CustomWordle", "Wordle"],
    }),
  }),
});

// Exporting the auto-generated hook for the endpoint
export const {
  useGetLast30WordlesQuery,
  useGetWordleStreakQuery,
  useGetMyWordPacksQuery,
  useGetWordleWordPackQuery,
  useGetWordleWoTDQuery,
  useGetMyDailyWordleStatsQuery,
  useGetMyWeeklyWordleStatsQuery,
  useGetMyMonthlyWordleStatsQuery,
  useGetMyYearlyWordleStatsQuery,
  useGetDailyWordleLeaderboardQuery,
  useGetWeeklyWordleLeaderboardQuery,
  useGetMonthlyWordleLeaderboardQuery,
  useGetYearlyWordleLeaderboardQuery,
  useGetAllTimeWordleLeaderboardQuery,
  useGetDailyWordleLeaderboardPostitionByUserIdQuery,
  useGetWeeklyWordleLeaderboardPostitionByUserIdQuery,
  useGetMonthlyWordleLeaderboardPostitionByUserIdQuery,
  useGetYearlyWordleLeaderboardPostitionByUserIdQuery,
  useGetAllTimeWordleLeaderboardPostitionByUserIdQuery,
  useGetMyDailyWordleLeaderboardPostitionQuery,
  useGetMyWeeklyWordleLeaderboardPostitionQuery,
  useGetMyMonthlyWordleLeaderboardPostitionQuery,
  useGetMyYearlyWordleLeaderboardPostitionQuery,
  useGetMyAllTImeWordleLeaderboardPostitionQuery,
  useGetCustomWorldeQuery,
  useGetTopPlayersQuery,
  useGetPublicPlayerQuery,
  useGetPublicPlayerSummaryQuery,
  useGetPublicPlayerByUsernameQuery,
  useGetMyAccountQuery,
  useGetMyEntitlementsQuery,
  useGetCurrentSubscriptionQuery,
  useCreateCheckoutSessionMutation,
  useChangeSubscriptionPlanMutation,
  useCreateItemCheckoutSessionMutation,
  useCreateBillingPortalSessionMutation,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useUpdateSettingsMutation,
  useUpdateStreamerSettingsMutation,
  useDeleteAccountMutation,
  useSubmitWordleResultMutation,
  useSubmitSpellbeeResultMutation,
  useGetAdminMeQuery,
  useGetAdminOverviewQuery,
  useSearchAdminPlayersQuery,
  useGetAdminPlayerNotesQuery,
  useAddAdminPlayerNoteMutation,
  useGrantAdminPlayerCoinsMutation,
  useBanAdminPlayerMutation,
  useUnbanAdminPlayerMutation,
  useGetAdminPlayerProfileQuery,
  useCreateCustomWorldeMutation,
  useGetWordleSavedStateQuery,
  useUpdateWordleSavedStateMutation,
  useGetUiSavedStateQuery,
  useUpdateUiSavedStateMutation,
  useGetStoreItemsQuery,
  useGetPurchasesQuery,
  usePurchaseItemsWithCoinsMutation,
  useGetMyChallengesQuery,
  useGetMyAllTimeWordleStatsQuery,
  useGetMyAllTimeWordleStatsByGameModeQuery,
  useGetWordleStreakByUserIdQuery,
  useGetChallengesByUserIdQuery,
  useMigrationMutation,
} = wordramaApiV3;