import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMyTeamQuery } from "@/redux/api/teams";
import { useGetMyEntitlementsQuery } from "@/redux/api/wordrama";
import { hasEntitlement } from "@/lib/entitlements";
import { FEATURES } from "@/config/features";

export function TeamNav() {
  const { data: team, isLoading: teamIsLoading, isError } = useGetMyTeamQuery();
  const path = usePathname();
  const { data: entitlements } = useGetMyEntitlementsQuery();
  const canCreateTeam = hasEntitlement(entitlements, FEATURES.TEAMS_CREATE);

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
      { !teamIsLoading && !isError && team && team?.data?.vTeams?.teamId ? (
        <Link
          href="/teams/my-team"
          className={path === '/teams/my-team' ? 'text-primary font-semibold' : ''}
        >
          Team {team?.data?.vTeams?.teamName}
        </Link>
      ) : (
        <Link
          href="/teams/join"
          className={path === '/teams/join' ? 'text-primary font-semibold' : ''}
        >
          Join a team
        </Link>
      )}
      {
        /* !teamIsLoading && team && team?.data?.teamLeader === user?.id && (
        <Link
          href="/teams/manage"
          className={path === '/teams/manage' ? 'text-primary font-semibold' : ''}
        >
          Manage Team
        </Link>
      )*/
      }
      {!teamIsLoading && canCreateTeam && !team?.data?.vTeams?.teamId && (
        <Link
          href="/teams/create"
          className={path === '/teams/create' ? 'text-primary font-semibold' : ''}
        >
          Create Team
        </Link>
      )}
    </nav>
  );
}
