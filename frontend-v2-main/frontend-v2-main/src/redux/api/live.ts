// Import necessary functions and types from RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from '@/lib/config';

// Setting up the API Slice
export const liveApi = createApi({
  reducerPath: "liveApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: [],
  endpoints: (builder) => ({
    getLiveCreators: builder.query<any, void>({
      query: () => {
        return {
          url: `/api/v3/streamers/live`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      }
    }),
  }),
});

// Exporting the auto-generated hook for the endpoint
export const {
  useGetLiveCreatorsQuery,
} = liveApi;
