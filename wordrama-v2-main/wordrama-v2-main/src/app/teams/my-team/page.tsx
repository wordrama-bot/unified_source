"use client"
import { orderBy } from 'lodash';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TeamNav } from "@/components/navbar/team";
import {
  useGetMyTeamQuery,
  useGetTeamMembersQuery,
  useGetTeamLeaderboardQuery,
  useLeaveTeamMutation
} from "@/redux/api/teams";
import { redirect, useSearchParams } from 'next/navigation';

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
  //getAppInsights().trackPageView({ name: 'My Team' });
  const { toast } = useToast();
  const [ page, setPage ] = useState(1);
  const { data: myTeam, isLoading, isError } = useGetMyTeamQuery();
  const [ teamName, setTeamName ] = useState(myTeam?.data?.vTeams?.teamName || '');
  const {
    data: teamMembers,
    isLoading: isLoadingTeamMembers,
    isError: isErrorTeamMembers
  } = useGetTeamMembersQuery({ teamId: myTeam?.data?.vTeams?.teamId || '', page});
  const [leaveTeam] = useLeaveTeamMutation();
  const [teamLeft, setTeamLeft] = useState(false);

  async function handleLeaveTeam() {
    const { data, error } = await leaveTeam();

    if (data) {
      toast({
        title: 'Removed',
        description: `You have left team ${teamName}`,
      });
      setTeamName('');
      setTeamLeft(true);
    }

    if (error) {
      toast({
        title: 'Error',
        description: `An error occured leaving the team`,
      });
      setTeamName('');
    }
  }

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

  if (teamLeft) return redirect('/teams');
  else if (!myTeam?.data?.vTeams?.teamName || isError) return redirect('/teams');
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Team { myTeam?.data?.vTeams?.teamName }</h1>
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
                          <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.averageLevel }</dt>
                                <dd className="text-gray-500 dark:text-gray-400">🕹️ Average Level</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">
                                  {
                                    myTeam?.data?.vTeams?.totalCoins > 1000000 ?
                                    `${Math.floor(myTeam?.data?.vTeams?.totalCoins / 1000000)}M` :
                                    myTeam?.data?.vTeams?.totalCoins > 1000 ?
                                    `${Math.floor(myTeam?.data?.vTeams?.totalCoins / 1000)}K` :
                                    myTeam?.data?.vTeams?.totalCoins
                                  }
                                </dt>
                                <dd className="text-gray-500 dark:text-gray-400">💰 Total Coins</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">
                                  {
                                    myTeam?.data?.vTeams?.alltimeGamesWon > 1000000 ?
                                    `${(myTeam?.data?.vTeams?.alltimeGamesWon / 1000000).toFixed(2)}M` :
                                    myTeam?.data?.vTeams?.alltimeGamesWon > 1000 ?
                                    `${(myTeam?.data?.vTeams?.alltimeGamesWon / 1000).toFixed(2)}K` :
                                    myTeam?.data?.vTeams?.alltimeGamesWon
                                  }
                                </dt>
                                <dd className="text-gray-500 dark:text-gray-400">🔥 Games Won</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ Math.floor(((myTeam?.data?.vTeams?.alltimeGamesWon || 0) / (myTeam?.data?.vTeams?.alltimeGamesPlayed || 0)) * 100) || 0}%</dt>
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
                            { info.row.original.id === myTeam?.data?.vTeams?.teamLeader && (
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
                    <Button onClick={(e) => { e.preventDefault(); handleLeaveTeam(); }} variant="default">Leave Team</Button>
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
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.alltimeGamesPlayed }</dt>
                                <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">
                                  { myTeam?.data?.vTeams?.alltimeGamesWon }
                                </dt>
                                <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">
                                  { myTeam?.data?.vTeams?.alltimeGamesLost || 0 }
                                </dt>
                                <dd className="text-gray-500 dark:text-gray-400">😬 Games Lost</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ Math.floor(((myTeam?.data?.vTeams?.alltimeGamesWon || 0) / (myTeam?.data?.vTeams?.alltimeGamesPlayed || 0)) * 100) || 0}%</dt>
                                <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.alltimeGamesWonIn_1 || 0}</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Won in 1️⃣</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.alltimeGamesWonIn_2 || 0}</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Won in 2️⃣</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.alltimeGamesWonIn_3 || 0}</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Won in 3️⃣</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.alltimeGamesWonIn_4 || 0}</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Won in 4️⃣</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.alltimeGamesWonIn_5 || 0}</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Won in 5️⃣</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.alltimeGamesWonIn_6 || 0}</dt>
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
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.dailyGamesPlayed || 0 }</dt>
                              <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">
                                { myTeam?.data?.vTeams?.dailyGamesWon || 0 }
                              </dt>
                              <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">
                                { myTeam?.data?.vTeams?.dailyGamesLost || 0 }
                              </dt>
                              <dd className="text-gray-500 dark:text-gray-400">😬 Games Lost</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ Math.floor(((myTeam?.data?.vTeams?.dailyGamesWon || 0) / (myTeam?.data?.vTeams?.dailyGamesPlayed || 0)) * 100) || 0}%</dt>
                              <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.dailyGamesWonIn_1 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 1️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.dailyGamesWonIn_2 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 2️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.dailyGamesWonIn_3 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 3️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.dailyGamesWonIn_4 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 4️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.dailyGamesWonIn_5 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 5️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.dailyGamesWonIn_6 || 0}</dt>
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
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.weeklyGamesPlayed || 0 }</dt>
                              <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">
                                { myTeam?.data?.vTeams?.weeklyGamesWon || 0 }
                              </dt>
                              <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">
                                { myTeam?.data?.vTeams?.weeklyGamesLost || 0 }
                              </dt>
                              <dd className="text-gray-500 dark:text-gray-400">😬 Games Lost</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ Math.floor(((myTeam?.data?.vTeams?.weeklyGamesWon || 0) / (myTeam?.data?.vTeams?.weeklyGamesPlayed || 0)) * 100) || 0}%</dt>
                              <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.weeklyGamesWonIn_1 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 1️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.weeklyGamesWonIn_2 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 2️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.weeklyGamesWonIn_3 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 3️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.weeklyGamesWonIn_4 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 4️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.weeklyGamesWonIn_5 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 5️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.weeklyGamesWonIn_6 || 0}</dt>
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
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.monthlyGamesPlayed || 0 }</dt>
                              <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">
                                { myTeam?.data?.vTeams?.monthlyGamesWon || 0 }
                              </dt>
                              <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">
                                { myTeam?.data?.vTeams?.monthlyGamesLost || 0 }
                              </dt>
                              <dd className="text-gray-500 dark:text-gray-400">😬 Games Lost</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ Math.floor(((myTeam?.data?.vTeams?.monthlyGamesWon || 0) / (myTeam?.data?.vTeams?.monthlyGamesPlayed || 0)) * 100) || 0}%</dt>
                              <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.monthlyGamesWonIn_1 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 1️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.monthlyGamesWonIn_2 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 2️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.monthlyGamesWonIn_3 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 3️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.monthlyGamesWonIn_4 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 4️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.monthlyGamesWonIn_5 || 0}</dt>
                              <dd className="text-gray-500 dark:text-gray-400">Won in 5️⃣</dd>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.monthlyGamesWonIn_6 || 0}</dt>
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
                          <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.yearlyGamesPlayed || 0 }</dt>
                            <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">
                              { myTeam?.data?.vTeams?.yearlyGamesWon || 0 }
                            </dt>
                            <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">
                              { myTeam?.data?.vTeams?.yearlyGamesLost || 0 }
                            </dt>
                            <dd className="text-gray-500 dark:text-gray-400">😬 Games Lost</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ Math.floor(((myTeam?.data?.vTeams?.yearlyGamesWon || 0) / (myTeam?.data?.vTeams?.yearlyGamesPlayed || 0)) * 100) || 0}%</dt>
                            <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.yearlyGamesWonIn_1 || 0}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Won in 1️⃣</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.yearlyGamesWonIn_2 || 0}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Won in 2️⃣</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.yearlyGamesWonIn_3 || 0}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Won in 3️⃣</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.yearlyGamesWonIn_4 || 0}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Won in 4️⃣</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.yearlyGamesWonIn_5 || 0}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Won in 5️⃣</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">{ myTeam?.data?.vTeams?.yearlyGamesWonIn_6 || 0}</dt>
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
