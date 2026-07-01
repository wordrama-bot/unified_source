"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useAddAdminPlayerNoteMutation,
  useGetAdminPlayerNotesQuery,
  useGetAdminPlayerProfileQuery,
  useGrantAdminPlayerCoinsMutation,
} from "@/redux/api/wordrama";

export default function AdminPlayerProfilePage() {
  const params = useParams();
  const playerId = String(params.playerId);
  const [note, setNote] = useState("");
  const [showGrantCoins, setShowGrantCoins] = useState(false);
  const [coinAmount, setCoinAmount] = useState(100);
  const [coinReason, setCoinReason] = useState("");
  const [grantCoins, { isLoading: grantingCoins }] =
    useGrantAdminPlayerCoinsMutation();

  const { data, isLoading, error } = useGetAdminPlayerProfileQuery(playerId, {
    skip: !playerId,
  });

  const {
    data: notesData,
    isFetching: notesLoading,
  } = useGetAdminPlayerNotesQuery(playerId, {
    skip: !playerId,
  });

  const [addNote, { isLoading: addingNote }] = useAddAdminPlayerNoteMutation();

  const notes = notesData?.data ?? [];

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

  async function handleAddNote(event: React.FormEvent) {
    event.preventDefault();

    const cleanNote = note.trim();
    if (!cleanNote) return;

    await addNote({
      playerId,
      note: cleanNote,
    }).unwrap();

    setNote("");
  }

  async function handleGrantCoins(event: React.FormEvent) {
    event.preventDefault();

    const cleanReason = coinReason.trim();

    if (!coinAmount || coinAmount <= 0 || !cleanReason) return;

    await grantCoins({
      playerId,
      amount: Number(coinAmount),
      reason: cleanReason,
    }).unwrap();

    setShowGrantCoins(false);
    setCoinAmount(100);
    setCoinReason("");
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <Link href="/admin" className="text-sm text-muted-foreground hover:underline">
        ← Back to Admin
      </Link>

      <div className="space-y-6">
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
      </div>

      <div className="mt-6 space-y-4">
        <Panel title="Quick Actions">
          <div className="grid gap-3 sm:grid-cols-2">
            <ActionButton label="Grant Coins" onClick={() => setShowGrantCoins(true)} />
            <ActionButton label="Grant Entitlement" disabled />
            <ActionButton label="Ban Player" disabled />
            <ActionButton label="Unban Player" disabled />
            <ActionButton label="Reset Streak" disabled />
            <ActionButton label="Copy Player JSON" onClick={() => copyPlayerJson(profile)} />
            <ActionButton label="Copy Player ID" onClick={() => navigator.clipboard.writeText(identity.id)} />
            <ActionButton label="Refresh Player" onClick={() => window.location.reload()} />
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Write actions are intentionally disabled until their backend audit logging is implemented.
          </p>
        </Panel>

        <Panel title="Moderator Notes">
          <form onSubmit={handleAddNote} className="space-y-3">
            <textarea
              className="min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Add an internal moderator note..."
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />

            <button
              type="submit"
              disabled={addingNote || !note.trim()}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addingNote ? "Adding..." : "Add Note"}
            </button>
          </form>

          <div className="mt-5 space-y-3">
            {notesLoading && (
              <p className="text-sm text-muted-foreground">Loading notes...</p>
            )}

            {!notesLoading && notes.length === 0 && (
              <p className="text-sm text-muted-foreground">✓ No moderator notes.</p>
            )}

            {notes.map((item: any) => (
              <div key={item.id} className="rounded-lg border p-3">
                <p className="whitespace-pre-wrap text-sm">{item.note}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(item.created_at)} · {getNoteAuthor(item)}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Games Played" value={gameplay.gamesPlayed} />
          <StatCard label="Wins" value={gameplay.wins} />
          <StatCard label="Losses" value={gameplay.losses} />
          <StatCard label="Win %" value={`${gameplay.winPercentage}%`} />
        </section>
      </div>

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

      {showGrantCoins && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Grant Coins</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add coins to {identity.display_name || identity.username}.
            </p>

            <form onSubmit={handleGrantCoins} className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={coinAmount}
                  onChange={(event) => setCoinAmount(Number(event.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Reason</label>
                <textarea
                  value={coinReason}
                  onChange={(event) => setCoinReason(event.target.value)}
                  placeholder="Required audit reason..."
                  className="mt-1 min-h-[90px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowGrantCoins(false)}
                  className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={grantingCoins || !coinReason.trim() || coinAmount <= 0}
                  className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {grantingCoins ? "Granting..." : "Grant Coins"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

function getNoteAuthor(item: any) {
  return (
    item.admin?.display_name ||
    item.admin?.username ||
    item.admin_player_id ||
    "Unknown admin"
  );
}

function ActionButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}

function copyPlayerJson(profile: any) {
  navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
}
