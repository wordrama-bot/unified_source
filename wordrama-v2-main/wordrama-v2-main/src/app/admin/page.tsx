"use client";

import { useMemo, useState } from "react";
import {
  useGetAdminMeQuery,
  useGetAdminOverviewQuery,
  useSearchAdminPlayersQuery,
} from "@/redux/api/wordrama";

export default function AdminDashboardPage() {
  const [search, setSearch] = useState("");

  const {
    data: adminMe,
    isLoading: adminLoading,
    error: adminError,
  } = useGetAdminMeQuery();

  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError,
  } = useGetAdminOverviewQuery();

  const shouldSearch = search.trim().length >= 2;

  const {
    data: searchResults,
    isFetching: searchLoading,
    error: searchError,
  } = useSearchAdminPlayersQuery(search.trim(), {
    skip: !shouldSearch,
  });

  const overviewData = overview?.data;
  const players = useMemo(() => searchResults?.data ?? [], [searchResults]);

  if (adminLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </main>
    );
  }

  if (adminError) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-4 text-red-500">
          Unable to verify admin access.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Wordrama Admin
        </p>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Signed in as {adminMe?.data?.role ?? "Admin"}
        </p>
      </div>

      {overviewError && (
        <div className="mb-6 rounded-lg border border-red-500/40 p-4 text-red-500">
          Unable to load dashboard overview.
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Total Players"
          value={overviewLoading ? "..." : overviewData?.totalPlayers ?? 0}
        />
        <AdminStatCard
          label="Games Today"
          value={overviewLoading ? "..." : overviewData?.gamesToday ?? 0}
        />
        <AdminStatCard
          label="Games This Hour"
          value={overviewLoading ? "..." : overviewData?.gamesThisHour ?? 0}
        />
        <AdminStatCard
          label="Registrations Today"
          value={overviewLoading ? "..." : overviewData?.dailyRegistrations ?? 0}
        />
        <AdminStatCard
          label="Active Subscriptions"
          value={overviewLoading ? "..." : overviewData?.stripeSubscriptions ?? 0}
        />
        <AdminStatCard
          label="Suspicious Accounts"
          value={overviewLoading ? "..." : overviewData?.suspiciousAccounts ?? 0}
        />
        <AdminStatCard
          label="Errors Requiring Review"
          value={overviewLoading ? "..." : overviewData?.errorsRequiringReview ?? 0}
        />
        <AdminStatCard
          label="Players Online"
          value={overviewLoading ? "..." : overviewData?.playersOnline ?? "N/A"}
        />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-xl font-semibold">Player Search</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search by username, display name, or player ID.
          </p>

          <input
            className="mt-4 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            placeholder="Search players..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="mt-4 space-y-3">
            {search.length > 0 && !shouldSearch && (
              <p className="text-sm text-muted-foreground">
                Type at least 2 characters.
              </p>
            )}

            {searchLoading && (
              <p className="text-sm text-muted-foreground">Searching...</p>
            )}

            {searchError && (
              <p className="text-sm text-red-500">
                Player search failed.
              </p>
            )}

            {shouldSearch && !searchLoading && players.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No players found.
              </p>
            )}

            {players.map((player: any) => (
              <a
                key={player.id}
                href={`/admin/players/${player.id}`}
                className="block rounded-lg border p-4 transition hover:bg-muted"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {player.display_name || player.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{player.username}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {player.id}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-xl font-semibold">Recent Bans</h2>

          <div className="mt-4 space-y-3">
            {(overviewData?.recentBans ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No recent bans.
              </p>
            )}

            {(overviewData?.recentBans ?? []).map((ban: any) => (
              <div key={ban.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{ban.ban_type}</p>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">
                    {ban.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 break-all text-sm text-muted-foreground">
                  {ban.ban_value}
                </p>
                <p className="mt-2 text-sm">{ban.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function AdminStatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
