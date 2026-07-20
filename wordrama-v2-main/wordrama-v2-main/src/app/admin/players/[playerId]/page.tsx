"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useAddAdminPlayerNoteMutation,
  useGetAdminPlayerNotesQuery,
  useGetAdminPlayerProfileQuery,
  useLazyGetAdminPlayerIdentityReportQuery,
  useGrantAdminPlayerCoinsMutation,
  useBanAdminPlayerMutation,
  useUnbanAdminPlayerMutation,
  useGetAdminCatalogQuery,
  usePreviewAdminGrantEntitlementMutation,
  useGrantAdminEntitlementMutation,
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
  const [banPlayer, { isLoading: banningPlayer }] = useBanAdminPlayerMutation();
  const [unbanPlayer, { isLoading: unbanningPlayer }] = useUnbanAdminPlayerMutation();
  const [showBanPlayer, setShowBanPlayer] = useState(false);
  const [showUnbanPlayer, setShowUnbanPlayer] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banNotes, setBanNotes] = useState("");
  const [banExpiresAt, setBanExpiresAt] = useState("");
  const [unbanReason, setUnbanReason] = useState("");
  const [selectedBanTargets, setSelectedBanTargets] = useState<Record<string, boolean>>({});
  const [showGrantEntitlement, setShowGrantEntitlement] = useState(false);
  const [selectedCatalogItemId, setSelectedCatalogItemId] = useState("");
  const [entitlementReason, setEntitlementReason] = useState("");
  const [entitlementExpiresAt, setEntitlementExpiresAt] = useState("");
  const [grantPreview, setGrantPreview] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "identity">(
    "overview"
  );

  const [
    loadIdentity,
    {
      data: identityReportData,
      isFetching: identityLoading,
    },
  ] = useLazyGetAdminPlayerIdentityReportQuery();

  const identityReport = identityReportData;

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

  const banTargetOptions = buildBanTargetOptions(profile);

  const { data: catalogData } = useGetAdminCatalogQuery();
  const [previewGrantEntitlement, { isLoading: previewingGrant }] =
    usePreviewAdminGrantEntitlementMutation();
  const [grantEntitlement, { isLoading: grantingEntitlement }] =
    useGrantAdminEntitlementMutation();

  useEffect(() => {
    if (
      activeTab === "identity" &&
      playerId &&
      !identityReportData
    ) {
      loadIdentity(playerId);
    }
  }, [
    activeTab,
    playerId,
    identityReportData,
    loadIdentity,
  ]);

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

  async function handleBanPlayer(event: React.FormEvent) {
    event.preventDefault();

    const cleanReason = banReason.trim();
    if (!cleanReason) return;

    const banTargets = banTargetOptions
      .filter((target: any) => selectedBanTargets[target.key])
      .map((target: any) => ({
        banType: target.banType ?? target.key,
        banValue: target.value,
      }));

    await banPlayer({
      playerId,
      reason: cleanReason,
      notes: banNotes.trim() || undefined,
      expiresAt: banExpiresAt || null,
      banTargets,
    }).unwrap();

    setShowBanPlayer(false);
    setBanReason("");
    setBanNotes("");
    setBanExpiresAt("");
  }

  async function handleUnbanPlayer(event: React.FormEvent) {
    event.preventDefault();

    const cleanReason = unbanReason.trim();
    if (!cleanReason) return;

    await unbanPlayer({
      playerId,
      reason: cleanReason,
    }).unwrap();

    setShowUnbanPlayer(false);
    setUnbanReason("");
  }

  async function handlePreviewGrantEntitlement(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedCatalogItemId) return;

    const preview = await previewGrantEntitlement({
      playerId,
      catalogItemId: selectedCatalogItemId,
      expiresAt: entitlementExpiresAt
        ? new Date(entitlementExpiresAt).toISOString()
        : null,
    }).unwrap();

    setGrantPreview(preview.data);
  }

  async function handleGrantEntitlement() {
    const cleanReason = entitlementReason.trim();

    if (!selectedCatalogItemId || !cleanReason) return;

    await grantEntitlement({
      playerId,
      catalogItemId: selectedCatalogItemId,
      reason: cleanReason,
      expiresAt: entitlementExpiresAt
        ? new Date(entitlementExpiresAt).toISOString()
        : null,
    }).unwrap();

    setShowGrantEntitlement(false);
    setSelectedCatalogItemId("");
    setEntitlementReason("");
    setEntitlementExpiresAt("");
    setGrantPreview(null);
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
                  {(identity.display_name || identity.username || "?")
                    .charAt(0)
                    .toUpperCase()}
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
                  <p className="break-all text-xs text-muted-foreground">
                    {identity.id}
                  </p>

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
                {identity.discord_connected
                  ? "🟣 Connected"
                  : "⚪ Not connected"}
              </p>
            </div>
          </div>
        </section>

        <div className="flex border-b">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === "overview"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("identity")}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === "identity"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Identity
          </button>
        </div>
      </div>

      {activeTab === "identity" && (
        <div className="mt-6">
          <Panel title="Player Identity">
            {identityLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading identity report...
              </p>
            ) : (
              <pre className="overflow-auto rounded-lg border bg-muted p-4 text-xs">
                {JSON.stringify(identityReport, null, 2)}
              </pre>
            )}
          </Panel>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <Panel title="Quick Actions">
          <div className="grid gap-3 sm:grid-cols-2">
            <ActionButton label="Grant Coins" onClick={() => setShowGrantCoins(true)} />
            <ActionButton
              label="Grant Entitlement"
              onClick={() => setShowGrantEntitlement(true)}
            />
            <ActionButton
              label="Ban Player"
              onClick={() => {
                const initialTargets: Record<string, boolean> = {};
                banTargetOptions.forEach((target: any) => {
                  initialTargets[target.key] = target.defaultChecked;
                });
                setSelectedBanTargets(initialTargets);
                setShowBanPlayer(true);
              }}
            />
            <ActionButton label="Unban Player" onClick={() => setShowUnbanPlayer(true)} />
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
          <KeyValue
            label="Username"
            value={
              identity._discord_link?.username ??
              profile.authIdentity?.discordGlobalName ??
              profile.authIdentity?.discordUsername ??
              "N/A"
            }
          />
          <KeyValue
            label="Discord ID"
            value={
              identity._discord_link?.user_id ??
              profile.authIdentity?.discordId ??
              "N/A"
            }
          />
          <KeyValue
            label="Auth Provider"
            value={profile.authIdentity?.provider ?? "N/A"}
          />
          <KeyValue
            label="Linked At"
            value={formatDate(identity._discord_link?.created_at)}
          />
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

      {showGrantEntitlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-2xl rounded-xl border bg-card p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Grant Entitlement</h2>

            <form onSubmit={handlePreviewGrantEntitlement} className="mt-5 space-y-4">
              <select
                value={selectedCatalogItemId}
                onChange={(e) => {
                  setSelectedCatalogItemId(e.target.value);
                  setGrantPreview(null);
                }}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select catalog item...</option>
                {(catalogData?.data ?? []).map((item: any) => (
                  <option key={item.catalogItemId} value={item.catalogItemId}>
                    {item.itemName} — {item.entitlementKey}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                value={entitlementExpiresAt}
                onChange={(e) => {
                  setEntitlementExpiresAt(e.target.value);
                  setGrantPreview(null);
                }}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />

              <textarea
                value={entitlementReason}
                onChange={(e) => setEntitlementReason(e.target.value)}
                placeholder="Required audit reason..."
                className="min-h-[90px] w-full rounded-md border bg-background px-3 py-2 text-sm"
              />

              <button type="submit" className="rounded-md border px-4 py-2 text-sm">
                {previewingGrant ? "Previewing..." : "Preview Grant"}
              </button>
            </form>

            {grantPreview && (
              <div className="mt-5 rounded-lg border p-4 text-sm">
                <p className="font-semibold">Preview</p>
                <p>Item: {grantPreview.catalogItem?.itemName}</p>
                <p>Key: {grantPreview.requestedGrant?.entitlementKey}</p>
                <p>Temporary: {grantPreview.requestedGrant?.isTemporaryGrant ? "Yes" : "No"}</p>
                <p>Can Grant: {grantPreview.canGrant ? "Yes" : "No"}</p>

                {(grantPreview.warnings ?? []).length > 0 && (
                  <div className="mt-3 rounded border border-yellow-500 p-3 text-yellow-300">
                    {grantPreview.warnings.map((warning: string) => (
                      <p key={warning}>{warning}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowGrantEntitlement(false)}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  grantingEntitlement ||
                  !grantPreview?.canGrant ||
                  !entitlementReason.trim()
                }
                onClick={handleGrantEntitlement}
                className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                {grantingEntitlement ? "Granting..." : "Confirm Grant"}
              </button>
            </div>
          </div>
        </div>
      )}

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
      {showBanPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Ban Player</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ban {identity.display_name || identity.username}. This creates an active PLAYER ban.
            </p>

            <form onSubmit={handleBanPlayer} className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium">Reason</label>
                <textarea
                  value={banReason}
                  onChange={(event) => setBanReason(event.target.value)}
                  placeholder="Required moderation reason..."
                  className="mt-1 min-h-[90px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Ban Targets</label>
                  <div className="mt-2 space-y-2 rounded-md border p-3">
                    {banTargetOptions.map((target: any) => (
                      <label
                        key={target.key}
                        className="flex items-start gap-3 rounded-md p-2 hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(selectedBanTargets[target.key])}
                          disabled={target.locked}
                          onChange={(event) =>
                            setSelectedBanTargets((current) => ({
                              ...current,
                              [target.key]: event.target.checked,
                            }))
                          }
                          className="mt-1"
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">
                            {target.label}
                            {target.locked ? " (required)" : ""}
                          </span>
                          <span className="block break-all text-xs text-muted-foreground">
                            {target.value}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  IP and username bans are optional because they can create false positives.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Internal Notes</label>
                <textarea
                  value={banNotes}
                  onChange={(event) => setBanNotes(event.target.value)}
                  placeholder="Optional internal details..."
                  className="mt-1 min-h-[70px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Expires At
                  <span className="ml-1 text-xs text-muted-foreground">
                    optional
                  </span>
                </label>
                <input
                  type="datetime-local"
                  value={banExpiresAt}
                  onChange={(event) => setBanExpiresAt(event.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Leave blank for a permanent ban.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBanPlayer(false)}
                  className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={banningPlayer || !banReason.trim()}
                  className="rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {banningPlayer ? "Banning..." : "Ban Player"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showUnbanPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Unban Player</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Deactivate all active PLAYER bans for {identity.display_name || identity.username}.
            </p>

            <form onSubmit={handleUnbanPlayer} className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium">Reason</label>
                <textarea
                  value={unbanReason}
                  onChange={(event) => setUnbanReason(event.target.value)}
                  placeholder="Required unban reason..."
                  className="mt-1 min-h-[90px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUnbanPlayer(false)}
                  className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={unbanningPlayer || !unbanReason.trim()}
                  className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {unbanningPlayer ? "Unbanning..." : "Unban Player"}
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

function buildBanTargetOptions(profile: any) {
  const targets = profile?.banTargets;

  if (!targets) return [];

  const options = [
    {
      key: "PLAYER",
      label: "Player Account",
      value: targets.playerId,
      defaultChecked: true,
      locked: true,
    },
    {
      key: "EMAIL",
      label: "Email",
      value: targets.email,
      defaultChecked: Boolean(targets.email),
      locked: false,
    },
    {
      key: "DISCORD",
      label: "Discord ID",
      value: targets.discordId,
      defaultChecked: Boolean(targets.discordId),
      locked: false,
    },
    {
      key: "USERNAME",
      label: "Username",
      value: targets.username,
      defaultChecked: false,
      locked: false,
    },
    ...(targets.recentIps ?? []).map((ip: string) => ({
      key: `IP:${ip}`,
      label: "IP Address",
      value: ip,
      defaultChecked: false,
      locked: false,
      banType: "IP",
    })),
  ];

  return options.filter((option) => Boolean(option.value));
}

function copyPlayerJson(profile: any) {
  navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
}
