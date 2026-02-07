"use client"
//import { getAppInsights } from "@/utils/appInsights";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TeamNav } from "@/components/navbar/team";
import { redirect } from "next/navigation";
import { useGetTeamByNameQuery, useGetMyTeamQuery, useJoinTeamMutation } from "@/redux/api/teams";

export default function JoinTeamPage() {
  //getAppInsights().trackPageView({ name: 'Join Team' });
  const { toast } = useToast();
  const [teamName, setTeamName] = useState('');
  const [teamJoined, setTeamJoined] = useState(false);
  const { data: myTeam, isLoading: myTeamIsLoading, isError: myTeamIsError } = useGetMyTeamQuery();
  const { data: team, isError, refetch } = useGetTeamByNameQuery(teamName);
  const [joinTeam] = useJoinTeamMutation();

  async function handleJoinTeam() {
    refetch();
    if (!team?.data?.teamId || isError) return toast({
      title: 'Whoops',
      description: 'Team not found',
    });

    const { data, error } = await joinTeam(team?.data?.teamName);

    if (error) {
      setTeamJoined(false);
      return toast({
        title: 'Whoops',
        description: 'Failed to join team',
      });
    }

    if (data) {
      toast({
        title: 'Success',
        description: 'Team Joined',
      });
      setTeamName('');
      setTeamJoined(true);
      return;
    }
  }

  if (teamJoined) return redirect('/teams/my-team');
  else if (!myTeamIsLoading && myTeam) return redirect('/teams/my-team');

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Join a team</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <TeamNav />
          <Card className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2">
            <CardHeader>
              <CardTitle>Join a team</CardTitle>
              <CardDescription>
                Enter the name of the team you want to join
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <Input placeholder="Team Name" value={teamName} onChange={(e) => {
                  setTeamName(e.target.value);
                }} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                disabled={teamName.length < 3}
                onClick={e => {
                  e.preventDefault();
                  handleJoinTeam();
                }}
              >
                Send
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
