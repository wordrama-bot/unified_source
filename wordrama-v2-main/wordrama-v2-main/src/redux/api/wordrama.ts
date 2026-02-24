// Import necessary functions and types from RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/config";

// Setting up the API Slice
export const wordramaApiV3 = createApi({
  reducerPath: "wordramaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      try {
        // Supabase project ref (yours)
        const projectRef = "qflfxxbnhwaxkxsygjqu";

        // Supabase stores the session JSON in localStorage under this key
        const raw = localStorage.getItem(`sb-${projectRef}-auth-token`);

        if (raw) {
          const session = JSON.parse(raw);

          // session can be { access_token, token_type, ... } depending on Supabase version
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

    getPublicPlayer: builder.query<any, string>({
      query: (playerId) => ({
        url: `/api/v3/players/by-playerid/${playerId}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["PublicProfile"],
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
  useGetPublicPlayerByUsernameQuery,
  useGetMyAccountQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useSubmitWordleResultMutation,
  useSubmitSpellbeeResultMutation,
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