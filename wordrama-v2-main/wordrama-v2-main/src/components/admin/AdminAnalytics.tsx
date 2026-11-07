"use client";

import { useState } from "react";
import { useLazyGetAdminAnalyticsQuery } from "@/redux/api/wordrama";

type Daily = {
  date: string;
  registrations: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  activePlayers: number;
};

const format = (value: number) => value.toLocaleString();

export default function AdminAnalytics() {
  const [days, setDays] = useState<7 | 30 | 90>(7);
  const [load, { data, isFetching, isError }] = useLazyGetAdminAnalyticsQuery();
  const report = data?.data;
  const daily: Daily[] = report?.days === days ? report.daily ?? [] : [];
  const maxGames = Math.max(1, ...daily.map((d) => d.gamesPlayed));

  return (
    <section className="mt-8 rounded-xl border bg-card p-5">
      <h2 className="text-xl font-semibold">Historical Analytics</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        On-demand reporting from the existing daily leaderboard. No automatic polling.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label htmlFor="admin-analytics-range" className="text-sm">Period</label>
        <select id="admin-analytics-range" value={days}
          onChange={(e) => setDays(Number(e.target.value) as 7 | 30 | 90)}
          className="rounded-md border bg-background px-3 py-2 text-sm">
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
        <button type="button" disabled={isFetching} onClick={() => load(days, false)}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50">
          {isFetching ? "Loading..." : "Load analytics"}
        </button>
      </div>
      {isError && <p className="mt-4 text-sm text-red-500">Unable to load analytics. Try a shorter range.</p>}
      {daily.length > 0 && (
        <>
          <p className="mt-3 text-xs text-muted-foreground">
            Reporting timezone: {report.timezone}. Generated: {new Date(report.generatedAt).toLocaleString()}.
            Leaderboard source refreshes approximately every 10 minutes.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Registrations", report.totals.registrations],
              ["Games played", report.totals.gamesPlayed],
              ["Wins", report.totals.wins],
              ["Losses", report.totals.losses],
              ["Avg. daily active players", Math.round(daily.reduce((total, day) => total + day.activePlayers, 0) / daily.length)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold">{format(Number(value))}</p>
              </div>
            ))}
          </div>
          <h3 className="mt-6 font-semibold">Games completed per day</h3>
          <div className="mt-3 flex h-36 items-end gap-1 border-b pb-1" role="img"
            aria-label="Bar chart of games played per day; exact numbers in table below">
            {daily.map((d) => (
              <div key={d.date} className="group relative min-w-0 flex-1 bg-sky-500/80 hover:bg-sky-400"
                style={{ height: `${Math.max(2, (d.gamesPlayed / maxGames) * 100)}%` }}
                title={`${d.date}: ${format(d.gamesPlayed)} games`} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{daily[0].date}</span><span>{daily[daily.length - 1].date}</span>
          </div>
          <div className="mt-5 max-h-80 overflow-auto rounded-md border">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="sticky top-0 bg-card">
                <tr>{["Date", "Registrations", "Games", "Wins", "Losses", "Active players"].map((h) =>
                  <th key={h} className="px-3 py-2">{h}</th>)}</tr>
              </thead>
              <tbody>{daily.map((d) => (
                <tr key={d.date} className="border-t">
                  <td className="px-3 py-2">{d.date}</td>
                  {[d.registrations, d.gamesPlayed, d.wins, d.losses, d.activePlayers].map((n, i) =>
                    <td key={i} className="px-3 py-2">{format(n)}</td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
