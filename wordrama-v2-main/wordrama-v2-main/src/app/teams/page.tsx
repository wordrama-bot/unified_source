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
      <>
        <PublicNav
          links={[
            { href: "/", text: "Home" },
            { href: "/free-play", text: "Quick Play" },
            { href: "/marketplace", text: "Marketplace" },
            { href: "/achievements", text: "Achievements" },
            { href: "/teams", text: "Teams" },
            { href: "/about", text: "About" },
            { href: "/signup", text: "Sign Up / In" },
          ]}
        />

        <main className="min-h-screen w-full bg-darkBg text-white">
          <header className="inset-0 flex min-h-[30dvh] w-full flex-col items-center justify-center bg-darkBg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
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
            <div className="rounded-lg border border-darkBorder bg-darkBg/80 p-6 shadow-dark">
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

            <section className="mt-10 rounded-lg border border-darkBorder bg-darkBg/80 p-6 text-center shadow-dark">
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
            </section>
          </section>
        </main>

        <Footer />
      </>
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

      <div className="flex min-h-screen w-full flex-col">
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl text-text dark:text-darkText font-semibold">Teams</h1>
              <p className="max-w-3xl text-sm text-muted-foreground">
                Teams let Wordrama players join communities, compete together, and climb the
                team leaderboard. Browse active teams below, open a team page to view members
                and stats, or join a team if you have a registered account.
              </p>
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <TeamNav />
            <Card className="p-4 bg-bg">
              <CardHeader>Teams</CardHeader>
                <CardContent>
                  <Table data={!isLoading && !isError && leaderboard?.data || []} columns={[
                    columnHelper.accessor('overallRank', {
                      header: 'Rank',
                      cell: info => info.getValue(),
                    }),
                    columnHelper.accessor('teamName', {
                      header: 'Team Name',
                      cell: info => (
                        <Link id={info.row.original.teamId} href={`/teams/${info.row.original.teamId}`}>
                          { info.getValue() }
                        </Link>
                      ),
                    })
                  ]} />
                </CardContent>
                { leaderboard?.metadata?.totalPages > 1 && (
                  <CardFooter>
                    <LeaderboardPagination />
                  </CardFooter>
                )}
              </Card>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
