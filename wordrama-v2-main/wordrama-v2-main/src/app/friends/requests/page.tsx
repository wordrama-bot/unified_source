"use client"
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
//import { getAppInsights } from '@/utils/appInsights';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FriendsNav } from "@/components/navbar/friends";
import { useGetReceivedFriendRequestsQuery, useAcceptFriendRequestMutation, useDeclineFriendRequestMutation } from "@/redux/api/friends";
import { useToast } from '@/components/ui/use-toast';
import { el } from 'date-fns/locale';

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

export default function FriendRequestsPage() {
  //getAppInsights().trackPageView({ name: 'Friend Requests' });
  const { toast } = useToast();
  const { data: friendRequestsRecieved, isError } = useGetReceivedFriendRequestsQuery();
  const [ acceptFriend ] = useAcceptFriendRequestMutation();
  const [ declineFriend ] = useDeclineFriendRequestMutation();

  async function handleAcceptFriend(requestId: string, displayName: string) {
    const resp = await acceptFriend(requestId);
    if (resp?.data) {
      toast({ title: `You are now friends with ${displayName}` });
    } else {
      toast({ title: 'Whoops', description: 'An error occured while processing your request' });
    }
  }

  async function handleDeclineFriend(requestId: string, displayName: string) {
    const resp = await declineFriend(requestId);
    if (resp?.data || resp?.data?.requestId) {
      toast({ title: `The friend request from ${displayName} has been declined` });
    } else {
      toast({ title: 'Whoops', description: 'An error occured while processing your request' });
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Friend Requets</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <FriendsNav />
          <Card className="p-4 bg-bg">
            <CardHeader>Friend Requests</CardHeader>
              <CardContent>
              { !isError && friendRequestsRecieved && friendRequestsRecieved?.data && friendRequestsRecieved?.data.length > 0 ? (
                <Table data={friendRequestsRecieved?.data.map(({ id, players }) => ({...players, requestId: id, ...players.levels})) || []} columns={[
                  columnHelper.accessor('displayName', {
                    header: 'Player',
                    cell: info => (
                      <Link id={info.row.original.id} href={`/player/${info.row.original.id}`}>
                        { info.getValue() }
                      </Link>
                    ),
                  }),
                  // columnHelper.accessor('profileImage', {
                  //   header: '',
                  //   cell: info => {
                  //     const value = info.getValue();
                  //     return (
                  //       <Link
                  //         href={`/profile/${info.row.original.player}`}
                  //       >
                  //         <Avatar>
                  //           {value ? <AvatarImage src={value} /> : <AvatarFallback></AvatarFallback>}
                  //         </Avatar>
                  //       </Link>
                  //     );
                  //   },
                  // }),
                  columnHelper.accessor('level', {
                    header: 'Level',
                    cell: info => info.getValue(),
                  }),
                  columnHelper.accessor('id', {
                    header: '',
                    cell: info => (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAcceptFriend(info.row.original.requestId, info.row.original.displayName);
                        }}
                      >
                        Accept
                      </Button>
                    ),
                  }),
                  columnHelper.accessor('id', {
                    header: '',
                    cell: info => (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeclineFriend(info.row.original.requestId, info.row.original.displayName);
                        }}
                      >
                        Decline
                      </Button>
                    ),
                  })
                ]} />
              ) : (
                <div className='text-sm'>
                  You have no friend requests, Click <Link className='font-semibold underline' href="/friends/add">here</Link> to send an invite
                </div>
              ) }
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
