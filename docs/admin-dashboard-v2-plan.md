# Admin Dashboard V2 — architecture and production-safe rollout

Status: design/audit baseline (2026-11-07). No production migrations or deployments authorized.

## Non-negotiable constraints
- Production Supabase is READ-ONLY during investigation and feature development.
- Do not recreate July 2026 audit expression/covering indexes removed for compute impact.
- No automatic heavy dashboard queries, no global polling, and no unbounded historical scans.
- Preserve moderation, bans, entitlements, purchases, coin adjustments, streaks, result delivery, multi-tab consistency, and security controls.
- Use existing backend admin authorization. Never expose service-role credentials or unreleased solutions to player APIs.
- Keep game-facing leaderboard refresh cadence unchanged unless independently reviewed.

## Verified production inventory (read-only metadata)
- public._audit: approximately 5.8M live rows, 2,379 MB including indexes. Existing indexes: _audit_pkey (125 MB), idx_audit_user_id_created_at (543 MB), idx_audit_created_at_brin (~72 KB).
- public._wordle_game_result: approximately 1.37M live rows, ~632 MB; stores player, guesses, solution, game_instance_id, word_pack, timestamps and outcome.
- public._wordle_saved_state: approximately 2,936 player rows, ~4 MB, unique index on player, game_state JSON and state_revision; historical ~4M updates.
- public._ui_saved_state: one row per player, ui_state JSON, unique player index.
- Existing RPCs: admin_get_player_identity(text,integer,integer), admin_get_suspicious_gameplay().
- pg_cron installed. Active jobs refresh daily/weekly/monthly/yearly/alltime leaderboards and team stats on different schedules.
- pg_stat_statements shows heavy player-facing _v_wordle_alltime_stats_by_type workload, separate from admin dashboard.
- Some cron.job_run_details records show 'job startup timeout' for job IDs absent from the current active-job inventory. Investigate, do not infer current jobs failed.

## Feature classification
| Feature | Source | Freshness | Trigger |
|---|---|---|---|
| Registration/activity totals and trends | Daily aggregated reporting tables | 24h | Admin opens report |
| Suspicious gameplay / abnormal solve cadence | Incremental daily player metrics plus bounded recent window | 24h | Admin opens report |
| Shared-IP and user-agent relationships | Privacy-conscious daily identity summary, not raw audit reverse scan | 24h | Admin opens report |
| Player identity/profile | Existing authorized player service | Live | Explicit player lookup |
| Active guesses and game state | _wordle_saved_state via server admin endpoint | Live-ish: most recent persisted revision | Selected player only |
| Active solution | Existing trusted server-side solution authority | Live | Selected player only |
| Completed game history | _wordle_game_result indexed player lookup | Live | Selected player, paginated |
| Ban, coin, entitlement, moderation actions | Existing backend services | Immediate | Explicit admin action |

## Implementation sequence
1. Source audit: locate admin frontend page/components, backend admin routes/authorization, save-state persistence, solution selection and game-mode state shape. GitHub code search connector returned no matching files; fetch exact paths or obtain repository tree before implementing.
2. Add **backend-only** targeted admin player monitor endpoint. Authorize on every request. Query exactly one player using existing unique player index; return sanitized persisted guesses, revision, server timestamp, and solution from trusted server source only if verified. Do not infer solution from client state. Rate-limit, audit admin access, and cap response.
3. Add frontend player monitor with explicit Start/Stop, visible last-saved timestamp, 3–5s polling only while panel visible, request cancellation, no background refresh. Clearly label unsaved in-browser guesses as unavailable.
4. Add snapshot schema and incremental aggregation design in staging first. Partition processing by bounded date/ID watermark, persist progress, deduplicate, ensure retry-safe upserts. Do not schedule a full daily scan of _audit.
5. Implement daily suspicious-gameplay and identity summaries; include snapshot timestamp, retention, privacy and access rules. Keep manual deep investigations bounded and off by default.
6. Verify staging performance: query plans (EXPLAIN without ANALYZE for prod), baseline versus new latency/reads/temp files, refresh runtime, scheduler overlaps, and functionality tests.
7. After explicit approval, separately plan production migration, staged backfill, rollout, monitoring and rollback.

## Source verification required before writing live monitoring
- How often state saves occur and whether guesses are stored before submission.
- Shape of game_state JSON for daily/infinite/multiple packs, and how stale states are distinguished.
- Whether active solution is stored server-side and which authority provides it.
- Existing admin auth middleware, moderation logging and ban enforcement.
- Existing frontend admin routing, state management and data fetching.

## Security and data accuracy
- Treat saved state as last persisted state, not guaranteed real-time keystrokes.
- Do not expose current solutions through client Supabase table policies or publicly callable SECURITY DEFINER functions.
- Snapshot data is investigative context only; bans, purchases and entitlements must use live authoritative services.
- No direct access to raw IP histories unless necessary, explicitly requested, and bounded.
