"use client"
import { useAuth } from '@/providers/auth-provider';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
//import { getAppInsights } from '@/utils/appInsights';
import { useToast } from "@/components/ui/use-toast";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Loader from '@/sections/loading';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamNav } from "@/components/navbar/team";
import NavBar from "@/components/navbar/h-nav";
import Footer from "@/sections/footer";
import {
  useGetMyTeamsQuery,
  useLeaveTeamMutation
} from "@/redux/api/teams";

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
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: myTeams, isLoading, isError } = useGetMyTeamsQuery();
  const teams = myTeams?.data?.teams || [];
  const [leaveTeam] = useLeaveTeamMutation();
  const [teamLeft, setTeamLeft] = useState(false);

  async function handleLeaveTeam(teamId: string, teamName: string) {
    const { data, error } = await leaveTeam(teamId);

    if (data) {
      toast({
        title: 'Removed',
        description: `You have left team ${teamName}`,
      });
      setTeamLeft(true);
    }

    if (error) {
      toast({
        title: 'Error',
        description: `An error occurred leaving the team`,
      });
    }
  }

  useEffect(() => {
    if (isLoading) return;

    if (teamLeft) {
      router.replace('/teams');
      return;
    }
  }, [isLoading, teamLeft, router]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg text-text dark:bg-darkBg dark:text-darkText">
      <NavBar
        links={[
          { href: "/games", text: "Games" },
          { href: "/leaderboard", text: "Leaderboard" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          { href: "/teams", text: "Teams" },
        ]}
      />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl">
          <TeamNav />

          <h1 className="mb-6 text-3xl font-bold">My Teams</h1>

          {teams.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No teams yet</CardTitle>
                <CardDescription>
                  Join a team or create one if you have Creator access.
                </CardDescription>
              </CardHeader>
              <CardFooter className="gap-3">
                <Button onClick={() => router.push('/teams/join')}>
                  Join Team
                </Button>
                <Button onClick={() => router.push('/teams/create')}>
                  Create Team
                </Button>
              </CardFooter>
            </Card>
          )}

          {teams.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teams.map((team: any) => (
                <Card key={team.teamId}>
                  <CardHeader>
                    <CardTitle>{team.teamName}</CardTitle>
                    <CardDescription>
                      {team.leader === user?.id ? 'Owner' : 'Member'}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="gap-3">
                    <Button onClick={() => router.push(`/teams/${team.teamId}`)}>
                      View Team
                    </Button>
                    <Button
                      variant="default"
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={() => handleLeaveTeam(team.teamId, team.teamName)}
                    >
                      Leave Team
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
