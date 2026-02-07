import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useGetMyTeamQuery } from "@/redux/api/teams";

export function TeamNav() {
  const { data: team, isLoading: teamIsLoading, isError } = useGetMyTeamQuery();
  const { user, role } = useAuth();
  const path = usePathname();

  if (teamIsLoading) return <div>Loading...</div>;
  return (
    <nav
      className="grid gap-4 text-sm text-text dark:text-darkText text-muted-foreground" x-chunk="dashboard-04-chunk-0"
    >
      <Link
        href="/teams"
        className={path === '/teams' ? 'text-primary font-semibold' : ''}
      >
        Teams
      </Link>
      
      {/* Always show Create Team option for any authenticated user */}
      <Link
        href="/teams/create"
        className={path === '/teams/create' ? 'text-primary font-semibold' : ''}
      >
        Create Team
      </Link>

      {/* Always show Join Team option */}
      <Link
        href="/teams/join"
        className={path === '/teams/join' ? 'text-primary font-semibold' : ''}
      >
        Join a Team
      </Link>

      {/* Show My Team if user is already in a team */}
      { !teamIsLoading && !isError && team && team?.data?.vTeams?.teamId && (
        <Link
          href="/teams/my-team"
          className={path === '/teams/my-team' ? 'text-primary font-semibold' : ''}
        >
          My Team ({team?.data?.vTeams?.teamName})
        </Link>
      )}
    </nav>
  );
}
