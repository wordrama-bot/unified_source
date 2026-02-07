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
import { redirect, useRouter } from "next/navigation";
import { useGetTeamByNameQuery, useCreateTeamMutation, useGetMyTeamQuery } from "@/redux/api/teams";

export default function CreateTeamPage() {
  //getAppInsights().trackPageView({ name: 'Create Team' });
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [teamCreated, setTeamCreated] = useState(false);
  const { data: team, isError } = useGetTeamByNameQuery(teamName);
  const { refetch: refetchMyTeam } = useGetMyTeamQuery();
  const [createTeam] = useCreateTeamMutation();

  async function handleCreateTeam() {
    if (team?.data?.teamId) return toast({
      title: 'Whoops',
      description: 'Team name already in use',
    });

    const { data, error } = await createTeam(teamName);

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
      
      // Robust retry mechanism to ensure team data is available before navigation
      const waitForTeamData = async (retries = 10, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
          try {
            const teamData = await refetchMyTeam();
            
            // Check if team data is actually available
            if (teamData?.data?.data?.vTeams?.teamName) {
              // console.log('Team data confirmed, navigating...');
              router.push('/teams/my-team');
              return;
            }
            
            // console.log(`Attempt ${i + 1}: Team data not ready yet, retrying...`);
            
            // Wait before next attempt
            if (i < retries - 1) {
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
          }
        }
        
        // If all retries failed, navigate anyway and let user refresh if needed
        // console.log('Max retries reached, navigating anyway...');
        router.push('/teams/my-team');
      };
      
      // Start the retry process
      waitForTeamData();
      return;
    }
  }

  // Allow any authenticated user to create teams
  // if (user?.user_metadata?.role !== 'STREAMER') return redirect('/teams');
  if (teamCreated) return redirect('/teams');
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
                Create a team for your followers to join
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
                disabled={teamName.length < 4 || teamName.length > 23}
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
