"use client";

import { useState } from "react";
import { useGetAdminPlayerLiveGameQuery } from "@/redux/api/wordrama";

export default function PlayerLiveMonitor({ playerId }: { playerId: string }) {
  const [monitoring, setMonitoring] = useState(false);
  const { data, error, isFetching, refetch } = useGetAdminPlayerLiveGameQuery(playerId, {
    skip: !monitoring || !playerId,
    pollingInterval: monitoring ? 5000 : 0,
    skipPollingIfUnfocused: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const snapshot = data?.data;
  const latest = snapshot?.latestCompletedGame;

  return (
    <section className="mt-6 rounded-xl border bg-card p-6">
      <h2 className="text-xl font-semibold">Player Live Monitor</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Read-only. Shows the latest completed game alongside the last persisted board; unsaved typing is unavailable.
        Requests run only while monitoring is enabled and the page is focused.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setMonitoring((value) => !value)}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
          {monitoring ? "Stop monitoring" : "Start monitoring"}
        </button>
        {monitoring && (
          <button type="button" onClick={() => refetch()} disabled={isFetching}
            className="rounded-md border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50">
            Refresh now
          </button>
        )}
        {monitoring && <span className="text-xs text-muted-foreground">5-second interval while focused</span>}
      </div>
      {monitoring && error && <p className="mt-4 text-sm text-red-500">Unable to load player snapshot.</p>}
      {monitoring && isFetching && <p className="mt-4 text-xs text-muted-foreground">Checking saved state...</p>}
      {monitoring && snapshot && (
        <div className="mt-5 space-y-3 text-sm">
          <p>Checked: {new Date(snapshot.observedAt).toLocaleString()} (not the save time)</p>
          <div className="rounded-md border p-3 space-y-2">
            <p className="font-semibold">Latest completed game</p>
            {latest ? (
              <>
                <p>Completed: {new Date(latest.completedAt).toLocaleString()}</p>
                <p>Pack: {latest.wordPack ?? "Unknown"} · Length: {latest.wordLength ?? "Unknown"}</p>
                <p>Result: {latest.isGameWon ? "Won" : "Lost"} · Solution: <span className="font-mono font-semibold">{latest.solution ?? "Unavailable"}</span></p>
                <p>Game instance: {latest.gameInstanceId ?? "Unknown"}</p>
                <p className="font-medium">Submitted guesses</p>
                {latest.guesses?.length ? (
                  <ol className="list-inside list-decimal space-y-1 font-mono">
                    {latest.guesses.map((guess: string, index: number) => <li key={index}>{guess}</li>)}
                  </ol>
                ) : <p className="text-muted-foreground">No recorded guesses.</p>}
              </>
            ) : <p className="text-muted-foreground">No completed games recorded.</p>}
          </div>
          <p className="font-semibold">Last persisted board (may be stale)</p>
          {latest && snapshot.gameInstanceId !== latest.gameInstanceId && (
            <p className="text-amber-600 dark:text-amber-400">
              The saved board is a different game instance. This may be a newer game or an outdated snapshot; its freshness cannot be verified.
            </p>
          )}
          <p>Revision: {snapshot.stateRevision ?? "No saved state"}</p>
          <p>Mode: {snapshot.gameMode ?? "Unknown"} · Pack: {snapshot.wordPack ?? "Unknown"}</p>
          <p>Game instance: {snapshot.gameInstanceId ?? "Unknown"}</p>
          <p>Status: {snapshot.isGameWon ? "Won" : snapshot.isGameLost ? "Lost" : "Not marked complete"}</p>
          <div>
            <p className="font-medium">Submitted guesses</p>
            {snapshot.guesses?.length ? (
              <ol className="mt-2 list-inside list-decimal space-y-1 font-mono">
                {snapshot.guesses.map((guess: string, index: number) => <li key={index}>{guess}</li>)}
              </ol>
            ) : <p className="text-muted-foreground">No saved guesses.</p>}
          </div>
          <p>Saved solution (admin only): <span className="font-mono font-semibold">{snapshot.solution ?? "Unavailable"}</span></p>
          <p className="text-xs text-muted-foreground">
            This shows the currently selected mode and word pack from the player's latest saved snapshot.
            It does not prove that the player is currently online.
          </p>
        </div>
      )}
    </section>
  );
}
