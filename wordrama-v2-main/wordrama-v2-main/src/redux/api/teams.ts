// Import necessary functions and types from RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from '@/lib/config';

// Setting up the API Slice
export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: [
    'TeamLeaderboard',
    'TeamMembers',
    'MyTeam',
    'Team',
    'Teams',
  ],
  endpoints: (builder) => ({
    getTeamLeaderboard: builder.query<any, number>({
      query: (page = 1) => {
        return {
          url: `/api/v3/team/leaderboard?page=${page}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        }
      },
      providesTags: ['TeamLeaderboard']
    }),
    getTeamMembers: builder.query<any, { teamId: string, page: number }>({
      query: ({ teamId, page }) => {
        return {
          url: `/api/v3/team/members/${teamId}?page=${page || 1}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        }
      },
      providesTags: ['TeamMembers']
    }),
    getTeams: builder.query<any, number>({
      query: (page = 1) => {
        return {
          url: `/api/v3/team/teams?page=${page}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        }
      },
      providesTags: ['Teams']
    }),
    getMyTeam: builder.query<any, void>({
      query: () => {
        return {
          url: `/api/v3/team/me`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        }
      },
      providesTags: ['MyTeam']
    }),
    getTeamByName: builder.query<any, string>({
      query: (teamName) => {
        return {
          url: `/api/v3/team?teamName=${teamName}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        }
      },
      providesTags: ['Team']
    }),
    getTeamById: builder.query<any, string>({
      query: (id) => {
        return {
          url: `/api/v3/team?teamId=${id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        }
      },
      providesTags: ['Team']
    }),
    getTeamByLeader: builder.query<any, string>({
      query: (id) => {
        return {
          url: `/api/v3/team?leader=${id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        }
      },
      providesTags: ['Team']
    }),
    joinTeam: builder.mutation<any, string>({
      query: (teamId) => {
        return {
          url: `/api/v3/team/join/${teamId}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        }
      },
      invalidatesTags: [
        'TeamLeaderboard',
        'TeamMembers',
        'MyTeam',
        'Team',
        'Teams'
      ]
    }),
    createTeam: builder.mutation<any, string>({
      query: (teamName) => {
        return {
          url: '/api/v3/team/',
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            teamName
          },
          credentials: "include",
        }
      },
      invalidatesTags: [
        'TeamLeaderboard',
        'TeamMembers',
        'MyTeam',
        'Team',
        'Teams'
      ]
    }),
    leaveTeam: builder.mutation<any, void>({
      query: () => {
        return {
          url: `/api/v3/team/leave`,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        }
      },
      invalidatesTags: [
        'TeamLeaderboard',
        'TeamMembers',
        'MyTeam',
        'Team',
        'Teams'
      ]
    }),
  }),
});

// Exporting the auto-generated hook for the endpoint
export const {
  useGetTeamsQuery,
  useGetTeamLeaderboardQuery,
  useGetTeamMembersQuery,
  useGetTeamByIdQuery,
  useGetTeamByNameQuery,
  useGetTeamByLeaderQuery,
  useGetMyTeamQuery,
  useCreateTeamMutation,
  useJoinTeamMutation,
  useLeaveTeamMutation,
} = teamApi;
