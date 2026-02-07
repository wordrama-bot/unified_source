"use client"
import { orderBy } from 'lodash';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
//import { getAppInsights } from '@/utils/appInsights';
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TeamNav } from "@/components/navbar/team";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  useGetMyTeamQuery,
  useGetTeamMembersQuery,
  useGetTeamLeaderboardQuery,
  useLeaveTeamMutation,
  useGetTeamByIdQuery
} from "@/redux/api/teams";
import { redirect, useParams, useSearchParams } from 'next/navigation';
import Loader, { Loading } from '@/sections/loading';

const columnHelper = createColumnHelper();

const Table = ({ data, columns }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <table className="min-w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="border-b-2 p-4 text-left"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-4 border-b">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function TeamPage() {
  //getAppInsights().trackPageView({ name: 'Team Page' });
  const [ page, setPage ] = useState(1);
  const params = useParams();
  const teamId = params?.teamId as string || '';
  const { data: myTeam, isLoading, isError } = useGetTeamByIdQuery(teamId);
  const {
    data: teamMembers,
    isLoading: isLoadingTeamMembers,
    isError: isErrorTeamMembers
  } = useGetTeamMembersQuery({ teamId: teamId || '', page: page });

  function MemberPagination() {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="text-text dark:text-darkText"
              href=''
              onClick={(e) => {
                e.preventDefault();
                setPage(teamMembers?.metadata?.previousPage)
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className="text-text dark:text-darkText"
              href=''
              onClick={(e) => {
                e.preventDefault();
                setPage(teamMembers?.metadata?.currentPage)
              }}
            >
              { teamMembers?.metadata?.currentPage }
            </PaginationLink>
          </PaginationItem>
          { teamMembers?.metadata?.currentPage < teamMembers?.metadata?.totalPages && (
            <>
            <PaginationItem className="text-white">
              <PaginationEllipsis className="text-text dark:text-darkText" />
            </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  className="text-text dark:text-darkText"
                  href=''
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(teamMembers?.metadata?.totalPages)
                  }}
                >
                  { teamMembers?.metadata?.totalPages }
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className="text-text dark:text-darkText"
                  href=''
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(teamMembers?.metadata?.nextPage)
                  }}
                />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    )
  }

  if (isLoading || isLoadingTeamMembers) return <Loader />;
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Team { myTeam?.data?.teamName }</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <TeamNav />
          <Tabs defaultValue="TEAM_STATS" className="">
            <TabsList className='col-span-7 place-items-end'>
              <TabsTrigger value="TEAM_MEMBERS">🎮 Members</TabsTrigger>
              <TabsTrigger value="TEAM_STATS">👥 Team Stats</TabsTrigger>
              <TabsTrigger value="ALL_TIME_STATS">🏆 All Time Stats</TabsTrigger>
              <TabsTrigger value="DAILY_STATS">📆 Daily Stats</TabsTrigger>
              <TabsTrigger value="WEEKLY_STATS">🕹️ Weekly Stats</TabsTrigger>
              <TabsTrigger value="MONTHLY_STATS">📈 Monthly Stats</TabsTrigger>
              <TabsTrigger value="YEARLY_STATS">🏅 Yearly Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="TEAM_STATS">
              <Card className="p-4 bg-bg">
                <CardHeader>📈 Team Stats</CardHeader>
                <CardContent>
                  <div id="fullWidthTabContent" className="p-4 border-gray-200 dark:border-gray-600 text-center">
                    <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                        <dl className="grid grid-cols-2 p-4 mx-auto text-gray-900 sm:grid-cols-2 xl:grid-cols-4 gap-8 max-w-screen-xl dark:text-white sm:p-8">
                            <div className="flex flex-col items-center justify-center">
                          <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.averageLevel }</dt>
                                <dd className="text-gray-500 dark:text-gray-400">🕹️ Average Level</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">
                                  {
                                    myTeam?.data?.totalCoins > 1000000 ?
                                    `${Math.floor(myTeam?.data?.totalCoins / 1000000)}M` :
                                    myTeam?.data?.totalCoins > 1000 ?
                                    `${Math.floor(myTeam?.data?.totalCoins / 1000)}K` :
                                    myTeam?.data?.totalCoins
                                  }
                                </dt>
                                <dd className="text-gray-500 dark:text-gray-400">💰 Total Coins</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">
                                  {
                                    myTeam?.data?.alltimeGamesWon > 1000000 ?
                                    `${(myTeam?.data?.alltimeGamesWon / 1000000).toFixed(2)}M` :
                                    myTeam?.data?.alltimeGamesWon > 1000 ?
                                    `${(myTeam?.data?.alltimeGamesWon / 1000).toFixed(2)}K` :
                                    myTeam?.data?.alltimeGamesWon
                                  }
                                </dt>
                                <dd className="text-gray-500 dark:text-gray-400">🔥 Games Won</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ Math.floor(((myTeam?.data?.alltimeGamesWon || 0) / (myTeam?.data?.alltimeGamesPlayed || 0)) * 100) || 0}%</dt>
                                <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                            </div>
                        </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="TEAM_MEMBERS">
              <Card className="p-4 bg-bg">
                <CardHeader>🎮 Team Members ({ teamMembers?.metadata?.totalItems || 0 })</CardHeader>
                  <CardContent>
                    <Table data={!isLoadingTeamMembers && !isErrorTeamMembers && orderBy(teamMembers?.data.map(({ players }) => ({...players, ...players.levels})) || [], 'level', 'desc')} columns={[
                      columnHelper.accessor('displayName', {
                        header: 'Player',
                        cell: info => (
                          <Link id={info.row.original.id} href={`/player/${info.row.original.id}`}>
                            { info.getValue() }
                            { info.row.original.id === myTeam?.data?.teamLeader && (
                              <Badge className="ml-2">Team Leader</Badge>
                            )}
                          </Link>
                        ),
                      }),
                      columnHelper.accessor('level', {
                        header: 'Level',
                        cell: info => info.getValue(),
                      })
                    ]} />
                  </CardContent>
                  <CardFooter>
                    { teamMembers?.metadata?.totalPages > 1 && (
                      <MemberPagination />
                    )}
                  </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="ALL_TIME_STATS">
              <Card className="p-4 bg-bg">
                <CardHeader>🏆 All Time Stats</CardHeader>
                <CardContent>
                  <div id="fullWidthTabContent" className="p-4 border-gray-200 dark:border-gray-600 text-center">
                    <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                        <dl className="grid grid-cols-2 p-4 mx-auto text-gray-900 sm:grid-cols-2 xl:grid-cols-4 gap-8 max-w-screen-xl dark:text-white sm:p-8">
                            <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.alltimeGamesPlayed }</dt>
                                <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">
                                  { myTeam?.data?.alltimeGamesWon }
                                </dt>
                                <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">
                                  { myTeam?.data?.alltimeGamesLost || 0 }
                                </dt>
                                <dd className="text-gray-500 dark:text-gray-400">😬 Games Lost</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ Math.floor(((myTeam?.data?.alltimeGamesWon || 0) / (myTeam?.data?.alltimeGamesPlayed || 0)) * 100) || 0}%</dt>
                                <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.alltimeGamesWonIn_1 || 0}</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Won in 1️⃣</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.alltimeGamesWonIn_2 || 0}</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Won in 2️⃣</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.alltimeGamesWonIn_3 || 0}</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Won in 3️⃣</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.alltimeGamesWonIn_4 || 0}</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Won in 4️⃣</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.alltimeGamesWonIn_5 || 0}</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Won in 5️⃣</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.alltimeGamesWonIn_6 || 0}</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Won in 6️⃣</dd>
                            </div>
                        </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="DAILY_STATS">
              <Card className="p-4 bg-bg">
                <CardHeader>📆 Daily Stats</CardHeader>
                <CardContent>
                  <div id="fullWidthTabContent" className="p-4 border-gray-200 dark:border-gray-600 text-center">
                    <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                        <dl className="grid grid-cols-2 p-4 mx-auto text-gray-900 sm:grid-cols-2 xl:grid-cols-4 gap-8 max-w-screen-xl dark:text-white sm:p-8">
                          <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.dailyGamesPlayed || 0 }</dt>
                              <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">
                                { myTeam?.data?.dailyGamesWon || 0 }
                              </dt>
                              <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">
                                { myTeam?.data?.dailyGamesLost || 0 }
                              </dt>
                              <dd className="text-gray-500 dark:text-gray-400">😬 Games Lost</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ Math.floor(((myTeam?.data?.dailyGamesWon || 0) / (myTeam?.data?.dailyGamesPlayed || 0)) * 100) || 0}%</dt>
                              <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.dailyGamesWonIn_1 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 1️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.dailyGamesWonIn_2 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 2️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.dailyGamesWonIn_3 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 3️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.dailyGamesWonIn_4 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 4️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.dailyGamesWonIn_5 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 5️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.dailyGamesWonIn_6 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 6️⃣</dd>
                          </div>
                        </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="WEEKLY_STATS">
              <Card className="p-4 bg-bg">
                <CardHeader>🕹️ Weekly Stats</CardHeader>
                <CardContent>
                  <div id="fullWidthTabContent" className="p-4 border-gray-200 dark:border-gray-600 text-center">
                    <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                        <dl className="grid grid-cols-2 p-4 mx-auto text-gray-900 sm:grid-cols-2 xl:grid-cols-4 gap-8 max-w-screen-xl dark:text-white sm:p-8">
                          <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.weeklyGamesPlayed || 0 }</dt>
                              <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">
                                { myTeam?.data?.weeklyGamesWon || 0 }
                              </dt>
                              <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">
                                { myTeam?.data?.weeklyGamesLost || 0 }
                              </dt>
                              <dd className="text-gray-500 dark:text-gray-400">😬 Games Lost</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ Math.floor(((myTeam?.data?.weeklyGamesWon || 0) / (myTeam?.data?.weeklyGamesPlayed || 0)) * 100) || 0}%</dt>
                              <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.weeklyGamesWonIn_1 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 1️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.weeklyGamesWonIn_2 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 2️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.weeklyGamesWonIn_3 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 3️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.weeklyGamesWonIn_4 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 4️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.weeklyGamesWonIn_5 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 5️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.weeklyGamesWonIn_6 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 6️⃣</dd>
                          </div>
                        </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="MONTHLY_STATS">
              <Card className="p-4 bg-bg">
                <CardHeader>📈 Monthly Stats</CardHeader>
                <CardContent>
                  <div id="fullWidthTabContent" className="p-4 border-gray-200 dark:border-gray-600 text-center">
                    <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                        <dl className="grid grid-cols-2 p-4 mx-auto text-gray-900 sm:grid-cols-2 xl:grid-cols-4 gap-8 max-w-screen-xl dark:text-white sm:p-8">
                          <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.monthlyGamesPlayed || 0 }</dt>
                              <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">
                                { myTeam?.data?.monthlyGamesWon || 0 }
                              </dt>
                              <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">
                                { myTeam?.data?.monthlyGamesLost || 0 }
                              </dt>
                              <dd className="text-gray-500 dark:text-gray-400">😬 Games Lost</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ Math.floor(((myTeam?.data?.monthlyGamesWon || 0) / (myTeam?.data?.monthlyGamesPlayed || 0)) * 100) || 0}%</dt>
                              <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.monthlyGamesWonIn_1 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 1️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.monthlyGamesWonIn_2 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 2️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.monthlyGamesWonIn_3 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 3️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.monthlyGamesWonIn_4 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 4️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.monthlyGamesWonIn_5 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 5️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.monthlyGamesWonIn_6 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 6️⃣</dd>
                          </div>
                        </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="YEARLY_STATS">
            <Card className="p-4 bg-bg">
              <CardHeader>🏅 Yearly Stats</CardHeader>
              <CardContent>
                <div id="fullWidthTabContent" className="p-4 border-gray-200 dark:border-gray-600 text-center">
                  <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                      <dl className="grid grid-cols-2 p-4 mx-auto text-gray-900 sm:grid-cols-2 xl:grid-cols-4 gap-8 max-w-screen-xl dark:text-white sm:p-8">
                        <div className="flex flex-col items-center justify-center">
                          <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.yearlyGamesPlayed || 0 }</dt>
                            <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">
                              { myTeam?.data?.yearlyGamesWon || 0 }
                            </dt>
                            <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">
                              { myTeam?.data?.yearlyGamesLost || 0 }
                            </dt>
                            <dd className="text-gray-500 dark:text-gray-400">😬 Games Lost</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ Math.floor(((myTeam?.data?.yearlyGamesWon || 0) / (myTeam?.data?.yearlyGamesPlayed || 0)) * 100) || 0}%</dt>
                            <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.yearlyGamesWonIn_1 || 0}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Won in 1️⃣</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.yearlyGamesWonIn_2 || 0}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Won in 2️⃣</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.yearlyGamesWonIn_3 || 0}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Won in 3️⃣</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.yearlyGamesWonIn_4 || 0}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Won in 4️⃣</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.yearlyGamesWonIn_5 || 0}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Won in 5️⃣</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.yearlyGamesWonIn_6 || 0}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Won in 6️⃣</dd>
                        </div>
                      </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
