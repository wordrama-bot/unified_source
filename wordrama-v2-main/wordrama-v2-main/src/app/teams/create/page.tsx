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
import { useAuth } from "@/providers/auth-provider";
import { redirect } from "next/navigation";
import { useGetTeamByNameQuery, useCreateTeamMutation } from "@/redux/api/teams";

export default function CreateTeamPage() {
  //getAppInsights().trackPageView({ name: 'Create Team' });
  const { user } = useAuth();
  const { toast } = useToast();
  const [teamName, setTeamName] = useState('');
  const [teamCreated, setTeamCreated] = useState(false);
  const { data: team, isError } = useGetTeamByNameQuery(teamName);
  const [createTeam] = useCreateTeamMutation();

  async function handleCreateTeam() {
    if (team?.data?.teamId) return toast({
      title: 'Whoops',
      description: 'Team name already in use',
    });

    const { data, error } = await createTeam(team?.data?.teamName);

    if (error) {
      setTeamCreated(false);
      return toast({
        title: 'Whoops',
        description: 'Failed to create team',
      });
    }

    if (data) {
      toast({
        title: 'Success',
        description: 'Team Created',
      });
      setTeamName('');
      setTeamCreated(true);
      return;
    }
  }

  if (user?.user_metadata?.role !== 'STREAMER') return redirect('/teams');
    else if (teamCreated) return redirect('/teams');
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Create a team</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <TeamNav />
          <Card className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2">
            <CardHeader>
              <CardTitle>Create a team</CardTitle>
              <CardDescription>
                Create a team for your follwers to join
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
                disabled={teamName.length < 3 || teamName.length > 15}
                onClick={e => {
                  e.preventDefault();
                  handleCreateTeam();
                }}
              >
                Create
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
