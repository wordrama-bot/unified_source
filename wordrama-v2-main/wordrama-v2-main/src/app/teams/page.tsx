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
  const serrchParams = useSearchParams();
  const { data: leaderboard, isLoading, isError } = useGetTeamLeaderboardQuery(Number(serrchParams.get('page') || 1));

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
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Teams</h1>
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
  )
}
