"use client";

import Link from "next/link";

type IdentityUserAgent = {
  userAgent: string;
  requestCount: number;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
};

type IdentityIpAddress = {
  forwardedIp: string;
  requestCount: number;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  userAgentCount: number;
  userAgents: IdentityUserAgent[];
};

type SharedIp = {
  forwardedIp: string;
  requestCount: number;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  userAgentCount: number;
  matchingUserAgentCount: number;
};

type RelatedAccount = {
  playerId: string;
  username: string | null;
  displayName: string | null;
  playerCreatedAt: string | null;
  sharedIpCount: number;
  requestCount: number;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  matchingUserAgentCount: number;
  sharedIps: SharedIp[];
};

type PlayerIdentityReport = {
  playerId: string;
  ipAddresses: IdentityIpAddress[];
  relatedAccounts: RelatedAccount[];
};

type PlayerIdentityPanelProps = {
  loading: boolean;
  error?: boolean;
  report?: PlayerIdentityReport;
  onRetry?: () => void;
};

export default function PlayerIdentityPanel({
  loading,
  error = false,
  report,
  onRetry,
}: PlayerIdentityPanelProps) {
  if (loading) {
    return (
      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-xl font-semibold">Player Identity</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Loading identity report...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-red-500/50 bg-card p-5">
        <h2 className="text-xl font-semibold">Player Identity</h2>

        <p className="mt-4 text-sm text-red-400">
          Unable to load the identity report. The database query may have timed
          out.
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Retry Report
          </button>
        )}
      </section>
    );
  }

  if (!report) {
    return (
      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-xl font-semibold">Player Identity</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          No identity report is available.
        </p>
      </section>
    );
  }

  const ipAddresses = report.ipAddresses ?? [];
  const relatedAccounts = report.relatedAccounts ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Player Identity</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Forwarded-IP, user-agent, and related-account evidence from audit
              history.
            </p>
          </div>

          <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
            {ipAddresses.length} IP{ipAddresses.length === 1 ? "" : "s"}
          </span>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">IP Addresses</h2>
          <span className="text-sm text-muted-foreground">
            {ipAddresses.length} found
          </span>
        </div>

        {ipAddresses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No forwarded IP addresses were found.
          </p>
        ) : (
          <div className="space-y-4">
            {ipAddresses.map((ip) => (
              <div
                key={ip.forwardedIp}
                className="rounded-lg border p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-base font-semibold">
                        {ip.forwardedIp}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(ip.forwardedIp)
                        }
                        className="rounded border px-2 py-1 text-xs hover:bg-muted"
                      >
                        Copy
                      </button>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      First seen {formatDate(ip.firstSeenAt)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Last seen {formatDate(ip.lastSeenAt)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <Metric
                      label="Requests"
                      value={ip.requestCount}
                    />
                    <Metric
                      label="User Agents"
                      value={ip.userAgentCount}
                    />
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <h3 className="text-sm font-semibold">User Agents</h3>

                  {(ip.userAgents ?? []).length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No user-agent data found.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {ip.userAgents.map((userAgent) => (
                        <div
                          key={`${ip.forwardedIp}:${userAgent.userAgent}`}
                          className="rounded-md border bg-background p-3"
                        >
                          <p className="break-all font-mono text-xs">
                            {userAgent.userAgent}
                          </p>

                          <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                            <p>
                              Requests:{" "}
                              <span className="text-foreground">
                                {formatNumber(userAgent.requestCount)}
                              </span>
                            </p>

                            <p>
                              First seen:{" "}
                              <span className="text-foreground">
                                {formatDate(userAgent.firstSeenAt)}
                              </span>
                            </p>

                            <p>
                              Last seen:{" "}
                              <span className="text-foreground">
                                {formatDate(userAgent.lastSeenAt)}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Related Accounts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Accounts observed on one or more of the same recent IP addresses.
            </p>
          </div>

          <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
            {relatedAccounts.length}
          </span>
        </div>

        {relatedAccounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No related accounts were found.
          </p>
        ) : (
          <div className="space-y-4">
            {relatedAccounts.map((account) => (
              <div
                key={account.playerId}
                className="rounded-lg border p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold">
                      {account.displayName ||
                        account.username ||
                        "Unknown Player"}
                    </p>

                    {account.username && (
                      <p className="text-sm text-muted-foreground">
                        @{account.username}
                      </p>
                    )}

                    <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
                      {account.playerId}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Account created {formatDate(account.playerCreatedAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      label={`${account.sharedIpCount} shared IP${
                        account.sharedIpCount === 1 ? "" : "s"
                      }`}
                    />

                    <Badge
                      label={`${account.matchingUserAgentCount} matching user agent${
                        account.matchingUserAgentCount === 1 ? "" : "s"
                      }`}
                    />

                    <Link
                      href={`/admin/players/${account.playerId}`}
                      className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Open Player
                    </Link>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Metric
                    label="Recent Matched Requests"
                    value={account.requestCount}
                  />
                  <Metric
                    label="First Seen"
                    value={formatDate(account.firstSeenAt)}
                  />
                  <Metric
                    label="Last Seen"
                    value={formatDate(account.lastSeenAt)}
                  />
                </div>

                <div className="mt-4 border-t pt-4">
                  <h3 className="text-sm font-semibold">Shared IP Evidence</h3>

                  <div className="mt-3 space-y-3">
                    {(account.sharedIps ?? []).map((sharedIp) => (
                      <div
                        key={`${account.playerId}:${sharedIp.forwardedIp}`}
                        className="rounded-md border bg-background p-3"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-mono text-sm font-semibold">
                                {sharedIp.forwardedIp}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    sharedIp.forwardedIp
                                  )
                                }
                                className="rounded border px-2 py-1 text-xs hover:bg-muted"
                              >
                                Copy
                              </button>
                            </div>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatDate(sharedIp.firstSeenAt)} —{" "}
                              {formatDate(sharedIp.lastSeenAt)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge
                              label={`${formatNumber(
                                sharedIp.requestCount
                              )} recent requests`}
                            />
                            <Badge
                              label={`${sharedIp.userAgentCount} user agent${
                                sharedIp.userAgentCount === 1 ? "" : "s"
                              }`}
                            />
                            <Badge
                              label={`${sharedIp.matchingUserAgentCount} matching`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-md border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-semibold">
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
      {label}
    </span>
  );
}

function formatNumber(value: number) {
  return Number(value ?? 0).toLocaleString();
}

function formatDate(value: string | null | undefined) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}
