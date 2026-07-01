"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetAdminPlayerProfileQuery } from "@/redux/api/wordrama";

export default function AdminPlayerProfilePage() {
  const params = useParams();
  const playerId = String(params.playerId);

  const { data, isLoading, error } = useGetAdminPlayerProfileQuery(playerId, {
    skip: !playerId,
  });

  const profile = data?.data;

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-muted-foreground">Loading player profile...</p>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Link href="/admin" className="text-sm text-muted-foreground hover:underline">
          ← Back to Admin
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Player Not Found</h1>
      </main>
    );
  }

  const identity = profile.identity;
  const gameplay = profile.gameplaySummary;
  const visibleStreaks = (profile.streaks ?? []).filter(
    (streak: any) =>
      Number(streak.current_streak) > 0 ||
      Number(streak.best_streak) > 0
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <Link href="/admin" className="text-sm text-muted-foreground hover:underline">
        ← Back to Admin
      </Link>

      <section className="mt-6 rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            {identity.profile_image ? (
              <img
                src={identity.profile_image}
                alt={`${identity.display_name || identity.username} avatar`}
                className="h-16 w-16 rounded-full border object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border text-xl font-bold">
                {(identity.display_name || identity.username || "?").charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-sm uppercase tracking-wide text-muted-foreground">
                Player Profile
              </p>
              <h1 className="mt-1 text-3xl font-bold">
                {identity.display_name || identity.username}
              </h1>
              <a
                href={`https://wordrama.io/player/${identity.id}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-muted-foreground hover:underline"
              >
                @{identity.username}
              </a>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="break-all text-xs text-muted-foreground">{identity.id}</p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(identity.id)}
                  className="rounded border px-2 py-1 text-xs hover:bg-muted"
                >
                  Copy ID
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-3 text-sm">
            <p>
              <span className="text-muted-foreground">Created:</span>{" "}
              {formatDate(identity.created_at)}
            </p>
            <p>
              <span className="text-muted-foreground">Discord:</span>{" "}
              {identity.discord_connected ? "🟣 Connected" : "⚪ Not connected"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Games Played" value={gameplay.gamesPlayed} />
        <StatCard label="Wins" value={gameplay.wins} />
        <StatCard label="Losses" value={gameplay.losses} />
        <StatCard label="Win %" value={`${gameplay.winPercentage}%`} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Discord">
          <KeyValue label="Username" value={identity._discord_link?.[0]?.username ?? "N/A"} />
          <KeyValue label="Discord ID" value={identity._discord_link?.[0]?.user_id ?? "N/A"} />
          <KeyValue label="Linked At" value={formatDate(identity._discord_link?.[0]?.created_at)} />
        </Panel>

        <Panel title="Coins">
          {(profile.coinBalance ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">✓ No coin balance found.</p>
          ) : (
            profile.coinBalance.map((row: any) => (
              <div key={row.id} className="rounded-lg border p-3">
                <KeyValue label="Currency" value={row.currency_code} />
                <KeyValue label="Available" value={row.available_balance.toLocaleString()} />
                <KeyValue label="Lifetime Earned" value={row.lifetime_earned.toLocaleString()} />
                <KeyValue label="Lifetime Spent" value={row.lifetime_spent.toLocaleString()} />
              </div>
            ))
          )}
        </Panel>

        <Panel title="Streaks">
          {visibleStreaks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No streak records.</p>
          ) : (
            <div className="space-y-3">
              {visibleStreaks.map((streak: any) => (
                <div key={streak.id} className="rounded-lg border p-3">
                  <div className="mb-3">
                    <p className="text-lg font-bold">{prettyName(streak.word_pack)}</p>
                    <p className="text-xs uppercase text-muted-foreground">
                      {prettyName(streak.type)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded border p-3">
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="text-2xl font-bold">{Number(streak.current_streak).toLocaleString()}</p>
                    </div>
                    <div className="rounded border p-3">
                      <p className="text-xs text-muted-foreground">Best</p>
                      <p className="text-2xl font-bold">{Number(streak.best_streak).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Active Bans">
          {(profile.activeBans ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">✓ No active player bans.</p>
          ) : (
            <div className="space-y-3">
              {profile.activeBans.map((ban: any) => (
                <div key={ban.id} className="rounded-lg border p-3">
                  <KeyValue label="Type" value={ban.ban_type} />
                  <KeyValue label="Reason" value={ban.reason} />
                  <KeyValue label="Expires" value={formatDate(ban.expires_at)} />
                </div>
              ))}
            </div>
          )}
        </Panel>
      </section>

      <section className="mt-6 grid gap-6">
        <Panel title="Recent Games">
          <SimpleTable
            rows={profile.recentGames ?? []}
            columns={[
              ["created_at", "Date"],
              ["type", "Type"],
              ["word_pack", "Pack"],
              ["solution", "Solution"],
              ["guess_count", "Guesses"],
              ["game_was_won", "Won"],
            ]}
          />
        </Panel>

        <Panel title="Entitlements">
          <SimpleTable
            rows={profile.entitlements ?? []}
            columns={[
              ["entitlement_key", "Key"],
              ["entitlement_type", "Type"],
              ["source_type", "Source"],
              ["status", "Status"],
              ["created_at", "Created"],
              ["expires_at", "Expires"],
            ]}
          />
        </Panel>

        <Panel title="Subscriptions">
          <SimpleTable
            rows={profile.subscriptions ?? []}
            columns={[
              ["subscription_key", "Key"],
              ["provider", "Provider"],
              ["status", "Status"],
              ["provider_subscription_id", "Stripe Sub ID"],
              ["current_period_end", "Period End"],
            ]}
          />
        </Panel>

        <Panel title="Moderation Actions">
          <SimpleTable
            rows={profile.moderationActions ?? []}
            columns={[
              ["performed_at", "Date"],
              ["action_type", "Action"],
              ["reason", "Reason"],
              ["performed_by", "Moderator"],
            ]}
          />
        </Panel>

        <Panel title="Recent Audit History">
          <SimpleTable
            rows={profile.auditHistory ?? []}
            columns={[
              ["created_at", "Date"],
              ["ip", "IP"],
              ["type", "Type"],
              ["path", "Path"],
            ]}
          />
        </Panel>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  const displayValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{displayValue}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function KeyValue({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-4 border-b py-1 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="break-all text-right">{String(value ?? "N/A")}</span>
    </div>
  );
}

function entitlementIcon(type: any) {
  const t = String(type ?? "").toUpperCase();

  if (t === "WORD_PACK") return "📚";
  if (t === "THEME") return "🎨";
  if (t === "FEATURE") return "⭐";
  if (t === "AVATAR") return "🧑";

  return "•";
}

function StatusBadge({ status }: { status: string }) {
  const s = String(status).toUpperCase();

  const classes =
    s === "ACTIVE"
      ? "bg-green-600/20 text-green-400 border-green-500"
      : s === "EXPIRED"
      ? "bg-gray-600/20 text-gray-300 border-gray-500"
      : s === "REVOKED"
      ? "bg-red-600/20 text-red-400 border-red-500"
      : s === "FAILED"
      ? "bg-red-600/20 text-red-400 border-red-500"
      : "bg-blue-600/20 text-blue-300 border-blue-500";

  return (
    <span className={`rounded-full border px-2 py-1 text-xs ${classes}`}>
      {prettyName(status)}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const s = String(source ?? "").toUpperCase();

  const classes =
    s === "ADMIN"
      ? "bg-purple-600/20 text-purple-300 border-purple-500"
      : s === "ORDER_ITEM"
      ? "bg-green-600/20 text-green-300 border-green-500"
      : s === "SUBSCRIPTION"
      ? "bg-blue-600/20 text-blue-300 border-blue-500"
      : s === "PROMO"
      ? "bg-yellow-600/20 text-yellow-300 border-yellow-500"
      : "bg-muted text-muted-foreground border-border";

  return (
    <span className={`rounded-full border px-2 py-1 text-xs ${classes}`}>
      {formatCell(source)}
    </span>
  );
}

function SimpleTable({
  rows,
  columns,
}: {
  rows: any[];
  columns: [string, string][];
}) {
  if (!rows.length) {
    return <p className="text-sm text-muted-foreground">✓ No records found.</p>;
  }

  return (
    <div className="max-h-[500px] overflow-auto">
      <table className="w-full min-w-[700px] text-sm">
        <thead className="sticky top-0 bg-card">
          <tr className="border-b text-left">
            {columns.map(([key, label]) => (
              <th key={key} className="px-2 py-2 font-medium text-muted-foreground">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id ?? index} className="border-b last:border-b-0">
              {columns.map(([key]) => (
                <td key={key} className="max-w-[240px] truncate px-2 py-2">
                  {key === "status" ? (
                    <StatusBadge status={row[key]} />
                  ) : key === "source_type" || key === "provider" ? (
                    <SourceBadge source={row[key]} />
                  ) : key === "solution" ? (
                    <span className="font-bold">{formatCell(row[key])}</span>
                  ) : key === "entitlement_type" ? (
                    <span>{entitlementIcon(row[key])} {formatCell(row[key])}</span>
                  ) : (
                    formatCell(row[key])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function prettyName(value: any) {
  if (!value || typeof value !== "string") return value ?? "N/A";

  return value
    .replace(/^WORD_PACK:/, "")
    .replace(/^FEATURE:/, "")
    .replace(/^THEME:/, "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatCell(value: any) {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString();

  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T/.test(value)
  ) {
    return formatDate(value);
  }

  if (
    typeof value === "string" &&
    (
      value.includes("_") ||
      value.startsWith("WORD_PACK:") ||
      value.startsWith("FEATURE:") ||
      value.startsWith("THEME:")
    )
  ) {
    return prettyName(value);
  }

  return String(value);
}

function formatDate(value: any) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}
