import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMyEntitlementsQuery } from "@/redux/api/wordrama";
import { hasEntitlement } from "@/lib/entitlements";
import { FEATURES } from "@/config/features";

export function TeamNav() {
  const path = usePathname();
  const { data: entitlements } = useGetMyEntitlementsQuery();
  const canCreateTeam = hasEntitlement(entitlements, FEATURES.TEAMS_CREATE);

  return (
    <nav className="grid gap-4 text-sm text-text dark:text-darkText text-muted-foreground">
      <Link
        href="/teams"
        className={path === "/teams" ? "text-primary font-semibold" : ""}
      >
        Teams
      </Link>

      <Link
        href="/teams/my-team"
        className={path === "/teams/my-team" ? "text-primary font-semibold" : ""}
      >
        My Teams
      </Link>

      <Link
        href="/teams/join"
        className={path === "/teams/join" ? "text-primary font-semibold" : ""}
      >
        Join a Team
      </Link>

      {canCreateTeam && (
        <Link
          href="/teams/create"
          className={path === "/teams/create" ? "text-primary font-semibold" : ""}
        >
          Create Team
        </Link>
      )}
    </nav>
  );
}
