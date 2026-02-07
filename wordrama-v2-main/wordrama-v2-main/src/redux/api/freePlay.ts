// Import necessary functions and types from RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from '@/lib/config';

// Setting up the API Slice
export const freePlayApi = createApi({
  reducerPath: "freePlayApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: [
    'WordleWoTD',
    'WordPack',
    'WordPacks',
    'Wordle',
    'CustomWordle'
  ],
  endpoints: (builder) => ({
    getWordleWordPack: builder.query<PlayerResponse, string>({
      query: (wordPack) => {
        return {
          url: `/api/v3/free-play/word-pack/${wordPack}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      },
      providesTags: ['WordPack']
    }),
    getWordleWoTD: builder.query<PlayerResponse, string>({
      query: (wordPack) => {
        return {
          url: `/api/v3/free-play/word-pack/${wordPack}/todays-word`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }        }
      },
      providesTags: ['WordleWoTD']
    }),
    getCustomWorlde: builder.query<PlayerResponse, string>({
      query: (shareCode) => {
        return {
          url: `/api/v3/free-play/custom/${shareCode}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }        }
      },
      providesTags: ['Wordle', 'CustomWordle']
    }),
  }),
});

// Exporting the auto-generated hook for the endpoint
export const {
  useGetWordleWordPackQuery,
  useGetWordleWoTDQuery,
  useGetCustomWorldeQuery,
} = freePlayApi;
