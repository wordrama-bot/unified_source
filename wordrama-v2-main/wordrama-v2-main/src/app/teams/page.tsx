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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TeamNav } from "@/components/navbar/team";
import { useGetTeamLeaderboardQuery } from "@/redux/api/teams";
import { redirect, useSearchParams } from 'next/navigation';
import Loader from '@/sections/loading';

import PublicNav from "@/components/navbar/public-nav";
import Footer from "@/sections/footer";
import NavBar from "@/components/navbar/h-nav";
import { useAuth } from "@/providers/auth-provider";
import GoogleAd from "@/components/GoogleAd";

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

export default function TeamLeaderboardPage() {
  //getAppInsights().trackPageView({ name: 'Team Leaderboard' });
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const { user, session } = useAuth();
  const isAuthenticated = !!user || !!session;

  const { data: leaderboard, isLoading, isError } = useGetTeamLeaderboardQuery(
    { page, limit: 10 },
    { skip: !isAuthenticated }
  );

  function LeaderboardPagination() {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="text-text dark:text-darkText"
              href={`/teams?page=${leaderboard?.metadata?.previousPage}`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="text-text dark:text-darkText" href={`/teams?page=${leaderboard?.metadata?.currentPage}`}>{ leaderboard?.metadata?.currentPage }</PaginationLink>
          </PaginationItem>
          { leaderboard?.metadata?.currentPage < leaderboard?.metadata?.totalPages && (
            <>
            <PaginationItem className="text-white">
              <PaginationEllipsis className="text-text dark:text-darkText" />
            </PaginationItem>
              <PaginationItem>
                <PaginationLink className="text-text dark:text-darkText" href={`/teams?page=${leaderboard?.metadata?.totalPages}`}>{ leaderboard?.metadata?.totalPages }</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className="text-text dark:text-darkText"
                  href={`/teams?page=${leaderboard?.metadata?.nextPage}`}
                />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    )
  }

  if (isLoading) return (<Loader />);

  if (!isAuthenticated) {
    if (isLoading) return <Loader />;

    return (
      <div className="flex min-h-screen w-full flex-col bg-bg text-text dark:bg-darkBg dark:text-darkText">
        <PublicNav
          links={[
            { href: "/free-play", text: "Quick Play" },
            { href: "/marketplace", text: "Marketplace" },
            { href: "/achievements", text: "Achievements" },
            { href: "/teams", text: "Teams" },
            { href: "/about", text: "About" },
            { href: "/signup", text: "Sign Up / In" },
          ]}
        />

        <main className="w-full flex-1 bg-bg text-text dark:bg-darkBg dark:text-darkText">
          <header className="inset-0 flex min-h-[30dvh] w-full flex-col items-center justify-center bg-bg text-text dark:bg-darkBg dark:text-darkText bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
            <div className="mx-auto w-container max-w-full px-5 text-center">
              <h1 className="px-5 text-center text-3xl font-heading md:text-4xl lg:text-5xl">
                Wordrama Teams
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-lg">
                Browse Wordrama communities, see active teams, and discover where
                players are competing together.
              </p>
            </div>
          </header>

          <section className="mx-auto max-w-5xl px-5 py-12">
            <div className="rounded-lg border border-border bg-bg/80 p-6 shadow-light dark:border-darkBorder dark:bg-darkBg/80 dark:shadow-dark">
              <h2 className="text-2xl font-bold">What are Wordrama Teams?</h2>
              <p className="mt-4">
                Teams let registered Wordrama players join communities, compete
                together, and climb the team leaderboard. Streamers, friend groups,
                and word game fans can use teams to build community around daily
                games and leaderboard competition.
              </p>
              <p className="mt-4">
                Quick Play users can browse teams, but you’ll need a free account
                to join a team, save your stats, and contribute to team progress.
              </p>
            </div>

            <section className="mt-10 rounded-lg border border-border bg-bg/80 p-6 text-center shadow-light dark:border-darkBorder dark:bg-darkBg/80 dark:shadow-dark">
              <h2 className="text-2xl font-bold">Want to join a team?</h2>
              <p className="mx-auto mt-4 max-w-3xl">
                Create a free Wordrama account to join a team, track your stats,
                earn coins, compete on leaderboards, and save your progress.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg">Create a Free Account</Button>
                </Link>
                <Link href="/free-play">
                  <Button size="lg" variant="neutral">
                    Quick Play
                  </Button>
                </Link>
              </div>

              <div className="mt-10">
                <GoogleAd
                  client="ca-pub-8970369628667981"
                  slot="8219203779"
                  minHeight={280}
                />
              </div>
            </section>
          </section>
        </main>

        <Footer />
      </div>
    );
    }

    return (
      <div className="flex min-h-screen w-full flex-col border:border bg-bg text-text dark:border-darkBorder dark:bg-darkBg dark:text-darkText">
        <NavBar
          links={[
            { href: "/games", text: "Games" },
            { href: "/leaderboard", text: "Leaderboard" },
            { href: "/marketplace", text: "Marketplace" },
            { href: "/achievements", text: "Achievements" },
            { href: "/teams", text: "Teams" },
          ]}
        />

        <main className="w-full flex-1 bg-bg text-text dark:bg-darkBg dark:text-darkText">
          <header className="inset-0 flex min-h-[30dvh] w-full flex-col items-center justify-center border-b-2 border-black bg-bg text-text dark:bg-darkBg dark:text-darkText bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
            <div className="mx-auto w-container max-w-full px-5 text-center">
              <h1 className="px-5 text-center text-3xl font-heading md:text-4xl lg:text-5xl">
                Teams
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-lg">
                Teams let Wordrama players join communities, compete together, and climb the team leaderboard.
              </p>
            </div>
          </header>

          <section className="mx-auto grid w-full max-w-6xl items-start gap-6 px-5 py-12 md:grid-cols-[180px_1fr] lg:grid-cols-[150px_1fr]">
            <TeamNav />

            <Card className="bg-bg p-4 text-text shadow-light dark:bg-darkBg dark:text-darkText dark:shadow-dark">
              <CardHeader>Teams</CardHeader>
              <CardContent>
                <Table
                  data={(!isLoading && !isError && leaderboard?.data) || []}
                  columns={[
                    columnHelper.accessor("overallRank", {
                      header: "Rank",
                      cell: (info) => info.getValue(),
                    }),
                    columnHelper.accessor("teamName", {
                      header: "Team Name",
                      cell: (info) => (
                        <Link
                          id={info.row.original.teamId}
                          href={`/teams/${info.row.original.teamId}`}
                        >
                          {info.getValue()}
                        </Link>
                      ),
                    }),
                  ]}
                />
              </CardContent>

              {leaderboard?.metadata?.totalPages > 1 && (
                <CardFooter>
                  <LeaderboardPagination />
                </CardFooter>
              )}
            </Card>
          </section>

          <div className="mx-auto mt-6 mb-6 flex w-full max-w-4xl justify-center">
            <GoogleAd
              client="ca-pub-8970369628667981"
              slot="8219203779"
              format="auto"
              responsive="true"
              minHeight={120}
            />
          </div>
        </main>

        <Footer />
      </div>
    );
  }
