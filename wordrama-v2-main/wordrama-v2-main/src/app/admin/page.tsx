"use client";

import { useMemo, useState } from "react";
import {
  useGetAdminMeQuery,
  useGetAdminOverviewQuery,
  useSearchAdminPlayersQuery,
  useGetSuspiciousGameplayQuery,
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

  const {
    data: suspiciousGameplayData,
    isLoading: isLoadingSuspiciousGameplay,
  } = useGetSuspiciousGameplayQuery();

  const suspiciousGameplayRows =
    suspiciousGameplayData?.data ?? [];

  const suspiciousGameplayCount =
    suspiciousGameplayRows.length;

  const flagLabels: Record<string, string> = {
    ONE_GUESS_24H: "Multiple 1-Guess Wins",
    ONE_GUESS_RATE: "High 1-Guess Rate",
    TEN_PLUS_GAMES_60S: "10+ Games in 60s",
    CONSISTENT_SUB_10S: "Consistent Sub-10s",
  };

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
          value={
            isLoadingSuspiciousGameplay
              ? "..."
              : suspiciousGameplayCount
          }
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

      <section className="mt-6">
        <div className="rounded-lg border border-yellow-700 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-yellow-300">
                Gameplay Review Queue
              </h2>
              <p className="text-sm text-zinc-400">
                Flags accounts for extreme one-minute bursts, sustained
                sub-10-second play, or unusual one-guess patterns.
              </p>
            </div>

            <div className="text-2xl font-bold text-yellow-300">
              {suspiciousGameplayCount}
            </div>
          </div>

          <div className="mb-4 rounded-md border border-zinc-800 bg-zinc-950/50 p-3 text-xs text-zinc-400">
            <div className="mb-2 font-semibold text-zinc-300">
              How to interpret this table
            </div>

            <ul className="space-y-1">
              <li>
                <strong>Games</strong> — Total Wordle games completed by the player.
              </li>

              <li>
                <strong>1 Guess</strong> — Total games solved in a single guess.
              </li>

              <li>
                <strong>1 Guess %</strong> — Percentage of all completed games solved in one guess.
              </li>

              <li>
                <strong>24h 1 Guess</strong> — Number of one-guess solves completed during the last 24 hours.
              </li>

              <li>
                <strong>Max / 60s</strong> — Highest number of completed games within any rolling 60-second period during the last 30 days.
              </li>

              <li>
                <strong>Fast Session</strong> — Number of games in the player's fastest qualifying play session (minimum 30 games).
              </li>

              <li>
                <strong>Median Gap</strong> — Median time between completed games during the fastest session. Lower values indicate more consistently rapid play.
              </li>

              <li>
                <strong>Sub-10%</strong> — Percentage of completed games in the fastest session that occurred within 10 seconds of the previous completed game.
              </li>

              <li>
                <strong>10+ Games in 60s</strong> — The player completed at least 10 games within a rolling 60-second period, indicating an unusually rapid burst of gameplay.
              </li>

              <li>
                <strong>Consistent Sub-10s</strong> — The player completed a qualifying session (30+ games) with a median completion gap of 10 seconds or less and at least 75% of game transitions occurring within 10 seconds.
              </li>

              <li>
                <strong>High 1-Guess Rate</strong> — The player's overall percentage of one-guess solves exceeds the review threshold.
              </li>

              <li>
                <strong>Multiple 1-Guess Wins</strong> — The player recorded multiple one-guess solves within the last 24 hours.
              </li>
            </ul>

            <p className="mt-3 border-t border-zinc-800 pt-3 text-zinc-500">
              <strong>Note:</strong> These metrics are designed to identify accounts
              that may warrant moderator review. A flag does not, by itself, indicate
              cheating or misuse.
            </p>
          </div>

          {isLoadingSuspiciousGameplay ? (
            <p className="text-sm text-zinc-400">
              Loading review queue...
            </p>
          ) : suspiciousGameplayRows.length > 0 ? (
            <div className="max-h-[500px] overflow-x-auto overflow-y-auto rounded-lg border border-zinc-800">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="sticky top-0 bg-zinc-900 text-zinc-400">
                  <tr>
                    <th className="px-3 py-2">Player</th>
                    <th className="px-3 py-2">Games</th>
                    <th className="px-3 py-2">1 Guess</th>
                    <th className="px-3 py-2">1 Guess %</th>
                    <th className="px-3 py-2">24h 1 Guess</th>
                    <th className="px-3 py-2">Max / 60s</th>
                    <th className="px-3 py-2">Fast Session</th>
                    <th className="px-3 py-2">Median Gap</th>
                    <th className="px-3 py-2">Sub-10%</th>
                    <th className="px-3 py-2">Flags</th>
                  </tr>
                </thead>

                <tbody>
                  {suspiciousGameplayRows.map((row: any) => (
                    <tr
                      key={row.playerId}
                      className="border-t border-zinc-800"
                    >
                      <td className="px-3 py-2">
                        <a
                          href={`/admin/players/${row.playerId}`}
                          className="font-medium text-blue-300 hover:underline"
                        >
                          {row.displayName ||
                            row.username ||
                            row.email ||
                            row.playerId}
                        </a>

                        <div className="text-xs text-zinc-500">
                          {row.email}
                        </div>
                      </td>

                      <td className="px-3 py-2">
                        {row.totalGames}
                      </td>

                      <td className="px-3 py-2">
                        {row.oneGuessWins}
                      </td>

                      <td className="px-3 py-2">
                        {row.oneGuessRate}%
                      </td>

                      <td className="px-3 py-2">
                        {row.oneGuessLast24h}
                      </td>

                      <td className="px-3 py-2">
                        {row.maxGamesInRolling60Seconds}
                      </td>

                      <td className="px-3 py-2">
                        {row.fastestSessionGames || "—"}
                      </td>

                      <td className="px-3 py-2">
                        {row.fastestSessionMedianGapSeconds === null ||
                        row.fastestSessionMedianGapSeconds === undefined
                          ? "—"
                          : `${Number(
                              row.fastestSessionMedianGapSeconds,
                            ).toFixed(2)}s`}
                      </td>

                      <td className="px-3 py-2">
                        {row.fastestSessionSub10Rate === null ||
                        row.fastestSessionSub10Rate === undefined
                          ? "—"
                          : `${Number(
                              row.fastestSessionSub10Rate,
                            ).toFixed(2)}%`}
                      </td>

                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {row.flags.map((flag: string) => (
                            <span
                              key={flag}
                              className="rounded bg-yellow-900 px-2 py-1 text-xs text-yellow-200"
                            >
                              {flagLabels[flag] ?? flag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-green-400">
              No suspicious gameplay currently flagged.
            </p>
          )}
        </div>
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
