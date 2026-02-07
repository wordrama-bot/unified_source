"use client"
//import { getAppInsights } from "@/utils/appInsights";
import { useState, useRef, useEffect } from "react";
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
import { useGetTeamByNameQuery, useGetMyTeamQuery, useJoinTeamMutation, useJoinTeamByInviteCodeMutation } from "@/redux/api/teams";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JoinTeamPage() {
  //getAppInsights().trackPageView({ name: 'Join Team' });
  const { toast } = useToast();
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [teamJoined, setTeamJoined] = useState(false);
  const { data: myTeam, isLoading: myTeamIsLoading, isError: myTeamIsError, refetch: refetchMyTeam } = useGetMyTeamQuery();
  const { data: team, isError, refetch } = useGetTeamByNameQuery(teamName);
  const [joinTeam] = useJoinTeamMutation();
  const [joinTeamByInviteCode] = useJoinTeamByInviteCodeMutation();

  // Force fresh data check when component mounts
  useEffect(() => {
    refetchMyTeam();
  }, [refetchMyTeam]);

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

  async function handleJoinByInviteCode() {
    if (!inviteCode) return toast({
      title: 'Whoops',
      description: 'Please enter an invite code',
    });

    const { data, error } = await joinTeamByInviteCode(inviteCode);

    if (error) {
      setTeamJoined(false);
      return toast({
        title: 'Whoops',
        description: 'Invalid invite code or failed to join team',
      });
    }

    if (data) {
      toast({
        title: 'Success',
        description: 'Team Joined',
      });
      setInviteCode('');
      setTeamJoined(true);
      return;
    }
  }

  if (teamJoined) return redirect('/teams/my-team');
  else if (!myTeamIsLoading && myTeam?.data?.vTeams?.teamName) return redirect('/teams/my-team');

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
                Join a team by name or invite code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="name" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="name">By Team Name</TabsTrigger>
                  <TabsTrigger value="invite">By Invite Code</TabsTrigger>
                </TabsList>
                <TabsContent value="name" className="space-y-4">
                  <div>
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input 
                      id="teamName"
                      placeholder="Enter team name" 
                      value={teamName} 
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  <Button
                    disabled={teamName.length < 4}
                    onClick={e => {
                      e.preventDefault();
                      handleJoinTeam();
                    }}
                    className="w-full"
                  >
                    Join Team
                  </Button>
                </TabsContent>
                <TabsContent value="invite" className="space-y-4">
                  <div>
                    <Label htmlFor="inviteCode">Invite Code</Label>
                    <Input 
                      id="inviteCode"
                      placeholder="Enter 6-character invite code" 
                      value={inviteCode} 
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      maxLength={6}
                    />
                  </div>
                  <Button
                    disabled={inviteCode.length !== 6}
                    onClick={e => {
                      e.preventDefault();
                      handleJoinByInviteCode();
                    }}
                    className="w-full"
                  >
                    Join by Code
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
