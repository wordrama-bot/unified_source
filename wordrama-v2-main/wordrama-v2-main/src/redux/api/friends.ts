// Import necessary functions and types from RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from '@/lib/config';

// Setting up the API Slice
export const friendsApi = createApi({
  reducerPath: "friendsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: [
    'Friends',
    'FriendRequests',
    'FriendRequestsSent',
    'FriendRequestsReceived',
  ],
  endpoints: (builder) => ({
    inviteFriend: builder.mutation<any, string>({
      query: (friendId) => {
        return {
          url: `/api/v3/player/friend-requests/${friendId}/add`,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        };
      },
      invalidatesTags: [
        'Friends',
        'FriendRequests',
        'FriendRequestsSent',
        'FriendRequestsReceived'
      ],
    }),
    acceptFriendRequest: builder.mutation<any, string>({
      query: (requestId) => {
        return {
          url: `/api/v3/player/friend-requests/${requestId}/accept`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        };
      },
      invalidatesTags: [
        'Friends',
        'FriendRequests',
        'FriendRequestsSent',
        'FriendRequestsReceived'
      ],
    }),
    declineFriendRequest: builder.mutation<any, string>({
      query: (requestId) => {
        return {
          url: `/api/v3/player/friend-requests/${requestId}/decline`,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        };
      },
      invalidatesTags: [
        'Friends',
        'FriendRequests',
        'FriendRequestsSent',
        'FriendRequestsReceived'
      ],
    }),
    cancelFriendRequest: builder.mutation<any, string>({
      query: (requestId) => {
        return {
          url: `/api/v3/player/friend-requests/${requestId}/cancel`,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        };
      },
      invalidatesTags: [
        'Friends',
        'FriendRequests',
        'FriendRequestsSent',
        'FriendRequestsReceived'
      ],
    }),
    removeFriend: builder.mutation<any, string>({
      query: (friendId) => {
        return {
          url: `/api/v3/player/friends/${friendId}/remove`,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        };
      },
      invalidatesTags: [
        'Friends',
        'FriendRequests',
        'FriendRequestsSent',
        'FriendRequestsReceived'
      ],
    }),
    getMyFriends: builder.query<any, void>({
      query: () => {
        return {
          url: `/api/v3/player/friends`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      },
      providesTags: ['Friends']
    }),
    getMyFriendRequests: builder.query<any, string>({
      query: (direction = 'received') => {
        return {
          url: `/api/v3/player/friend-requests?direction=${direction}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      },
      providesTags: ['FriendRequests']
    }),
    getSentFriendRequests: builder.query<any, void>({
      query: () => {
        return {
          url: `/api/v3/player/friend-requests/sent`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      },
      providesTags: ['FriendRequestsSent']
    }),
    getReceivedFriendRequests: builder.query<any, void>({
      query: () => {
        return {
          url: `/api/v3/player/friend-requests/recieved`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      },
      providesTags: ['FriendRequestsReceived']
    })
  }),
});

// Exporting the auto-generated hook for the endpoint
export const {
  useGetMyFriendsQuery,
  useGetMyFriendRequestsQuery,
  useGetSentFriendRequestsQuery,
  useGetReceivedFriendRequestsQuery,
  useInviteFriendMutation,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useCancelFriendRequestMutation,
  useRemoveFriendMutation,
} = friendsApi;
