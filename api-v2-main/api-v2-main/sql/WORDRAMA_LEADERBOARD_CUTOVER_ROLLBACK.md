# Leaderboard pack cutover / rollback plan (NOT AUTHORIZED FOR EXECUTION)

## Scope
New packs: 3 Letter, 3 Letter Crazy, 5 Letter Unhinged (18+). Preserve all historical game results, rewards, streaks, and rankings. No writes to game-result, streak, reward, or ownership tables. Keep existing pack IDs and leaderboard query contracts. Production changes must be explicitly approved separately.

## Verified as of 2026-11-12
- Five live public leaderboard materialized views exist.
- Ten populated replacement preview MVs exist in production schema `wordrama_pack_preview` (five periods x two variants).
- Independent replacement views contain new pack columns and were refreshed; all five row counts then matched live.
- Read-only equivalents of current/best/games-played sorting passed 45 checks (3 packs x 5 periods x 3 sorts), but only ONE participating test player exists for each new pack. Tie-breaking and the actual updated RPC are not execution-tested.
- **Blocking dependency**: `public._mv_team_wordle_stats` depends on ALL FIVE public leaderboard MVs through PostgreSQL object OIDs. A rename-based swap of MVs does NOT redirect that dependency, and dropping old MVs requires dependency handling. Never use CASCADE.

## Deployment gates
1. Read-only execute `wordrama_leaderboard_cutover_preflight.sql`. Recheck dependencies and privileges; require 15/15 new pack rank/win/loss column checks true.
2. Capture definitions, indexes, grants, ownership, refresh jobs, and row counts for five live MVs AND `_mv_team_wordle_stats`; retain a complete immutable SQL rollback snapshot of their definitions and dependencies.
3. Choose and implement an explicit dependency-safe promotion strategy, including rebind/recreate of team stats MV and its indexes/grants/refresh job, OR use a separate stable view/API indirection with proven compatibility. This is **not yet designed/tested** and is a release blocker.
4. Confirm all downstream code expects correct column names/types; inspect all dependent views, functions, jobs, and API queries. Check historical 2024 data, player ID coverage, per-pack streak isolation, and leaderboards in each period.
5. Rehearse FULL cutover and rollback on staging or an isolated production clone with realistic data, including multiple players and ties. Staging currently lacks the preview schema; migrate a COPY of preview definitions there first, not production results.
6. During a controlled maintenance window, freeze conflicting leaderboard refresh jobs, refresh candidates, take backups, execute dependency-safe promotion in a transaction where feasible, validate, and resume jobs. Avoid long locks on player-facing tables. Never activate packs until validated.
7. Independently apply the reviewed `wordrama_leaderboard_streak_page_new_packs_candidate.sql` only after target public columns exist. This function uses SECURITY INVOKER and service_role-only EXECUTE.
8. Verify all five periods, all existing pack rankings, new packs, RPC authorization, team leaderboard refresh, and representative historical players before release.

## Rollback
- If failure occurs inside the cutover transaction: ROLLBACK before COMMIT; no production objects change.
- If RPC deployment alone fails AFTER commit: run `wordrama_leaderboard_streak_page_rollback.sql` to restore the exact pre-cutover production function. This does NOT roll back a materialized-view promotion.
- If a completed MV promotion fails: restore the captured original five MV definitions, unique indexes, grants, ownership, refresh scheduling, AND dependent `_mv_team_wordle_stats` definition/indexes/grants in a rehearsed dependency-safe order. **No executable MV rollback script can be certified until that dependency-aware promotion is fully specified and rehearsed.** Do not pretend the RPC rollback covers this.
- Do not delete or rewrite source results, rewards, streaks, or player history. No CASCADE.

## Release state
**BLOCKED for MV promotion**, pending explicit team-MV dependency solution and full rehearsal. The preflight and RPC rollback SQL are ready on the feature branch. No production cutover or deployment was performed.
