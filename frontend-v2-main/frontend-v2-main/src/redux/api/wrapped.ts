// Import necessary functions and types from RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from '@/lib/config';

// Setting up the API Slice
export const wrappedApi = createApi({
  reducerPath: "wrappedApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: [
    'Wrapped',
  ],
  endpoints: (builder) => ({
    getMyWrapped: builder.query<any, void>({
      query: () => {
        return {
          url: `/api/v3/wrapped/me`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      },
      providesTags: ['Wrapped']
    }),
  }),
});

// Exporting the auto-generated hook for the endpoint
export const {
  useGetMyWrappedQuery,
} = wrappedApi;
