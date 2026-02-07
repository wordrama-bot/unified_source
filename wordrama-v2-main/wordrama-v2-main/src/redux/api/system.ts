// Import necessary functions and types from RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from '@/lib/config';

// Setting up the API Slice
export const systemApi = createApi({
  reducerPath: "systemApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: [],
  endpoints: (builder) => ({
    getReadiness: builder.query<void, void>({
      query: () => {
        return {
          url: `/health`,
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
  useGetReadinessQuery
} = systemApi;
