import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export function SettingsNav() {
  const { role } = useAuth();
  const path = usePathname();
  return (
    <nav
      className="grid gap-4 text-sm text-text dark:text-darkText text-muted-foreground" x-chunk="dashboard-04-chunk-0"
    >
      <Link
        href="/settings"
        className={path === '/settings' ? 'text-primary font-semibold' : ''}
      >
        Account
      </Link>
      <Link
        href="/settings/profile"
        className={path === '/settings/profile' ? 'text-primary font-semibold' : ''}
      >
        Profile
      </Link>
      {
      // <Link
      //   href="/settings/game"
      //   className={path === '/settings/game' ? 'text-primary font-semibold' : ''}
      // >
      //   Game
      // </Link>
      }
      {(role !== 'PLAYER') && (
        <Link
          href="/settings/billing"
          className={path === '/settings/billing' ? 'text-primary font-semibold' : ''}
        >
          Billing
        </Link>
      )}
      { role === 'STREAMER' && (
        <Link
          href="/settings/streamer"
          className={path === '/settings/streamer' ? 'text-primary font-semibold' : ''}
        >
          Streamer
        </Link>
      )}
    </nav>
  );
}
