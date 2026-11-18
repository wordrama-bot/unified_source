# Leaderboard pack cutover / rollback plan (NOT AUTHORIZED FOR EXECUTION)

## Scope
New packs: 3 Letter, 3 Letter Crazy, 5 Letter Unhinged (18+). Preserve historical results, rewards, streaks, rankings and ownership. Production changes require separate explicit authorization. No CASCADE.

## Status updated 2026-11-18
- Five public leaderboard materialized views (MVs) and the dependent `public._mv_team_wordle_stats` require coordinated handling. PostgreSQL object-ID dependencies mean a simple rename/swap is unsafe.
- The feature branch now contains a dependency-aware candidate cutover (`wordrama_leaderboard_cutover.sql`) and full MV rollback (`wordrama_leaderboard_full_rollback.sql`), in addition to candidate/rollback streak-page RPC scripts and read-only preflight SQL.
- Previous staging rehearsals reportedly exercised the five-period cutover, team MV refresh/rebinding and full rollback successfully. Leaderboard RPC checks covered 45 combinations (3 packs x 5 periods x 3 sorts), with 90 sorted rows. This supersedes the older statement that the dependency solution was not designed or rehearsed.
- Earlier production preview MVs and read-only comparisons were reviewed. These historical observations are NOT substitutes for a fresh production preflight or a verified current rollback snapshot.
- No production leaderboard cutover, RPC promotion, or purchase activation is authorized by this document.

## Release gates (all required before production execution)
1. Run `wordrama_leaderboard_cutover_preflight.sql` read-only against the intended production project; confirm current dependencies, candidate availability, 15/15 pack-column checks, privileges, and row counts across ALL five periods (not just all-time).
2. Inventory and preserve exact definitions, indexes, grants, owners, refresh schedules and row counts for five live leaderboard MVs, `_mv_team_wordle_stats`, `_v_team_leaderboard`, and the existing streak-page RPC. Verify backup retention and recovery access.
3. Review both cutover and full rollback SQL against the current production dependency graph, including additional dependent views/functions/jobs and team MV indexes. The cutover currently guards against nonzero team indexes; if present, resolve deliberately rather than bypassing the guard.
4. Validate current candidate MVs, downstream column names/types, historical players and periods, pack isolation, multiple-player rankings and tie behavior. Do not assume historical staging tests prove current production data behavior.
5. Confirm that the staging cutover and full rollback rehearsals match the committed scripts and document their outputs. Rehearse again if scripts, dependencies, or schemas changed materially.
6. Arrange a controlled maintenance window, coordinate leaderboard refresh jobs and traffic, confirm backups, and obtain separate explicit authorization before running any production write.
7. Execute the dependency-safe MV cutover transaction only after gates pass; inspect results and team leaderboard behavior. Apply `wordrama_leaderboard_streak_page_new_packs_candidate.sql` separately only after new public columns are verified. Preserve SECURITY INVOKER and service_role-only EXECUTE.
8. Verify all five periods, existing and new pack ranks, representative historical players, RPC authorization, team refresh behavior, grants, and scheduled refreshes before enabling packs. Retain backups until validation is complete.

## Rollback
- Before cutover COMMIT: use transaction ROLLBACK on any failed gate or validation.
- If only the RPC change fails after MV promotion: use `wordrama_leaderboard_streak_page_rollback.sql`. This does not undo MV promotion.
- If completed MV promotion must be reversed: use the rehearsed `wordrama_leaderboard_full_rollback.sql` only after confirming the expected `*_wr3_backup` objects, dependency state and team view/index/ACL conditions. Then restore the original RPC if it was changed. Revalidate the five periods, team leaderboard, grants and refresh jobs.
- Neither rollback path rewrites source game results, rewards, streaks or player ownership. Never use CASCADE.
- If actual production dependencies diverge from rehearsed assumptions, STOP and review; do not force or improvise a rollback.

## Release state
**STAGING REHEARSAL COMPLETE; PRODUCTION CUTOVER NOT YET AUTHORIZED.** The prior team-MV dependency design blocker has an implemented and staged approach, but fresh production preflight, complete rollback snapshot, current dependency/ACL/index review, and controlled execution approval remain mandatory. Stripe staging checkout verification was deferred separately and is not covered by this runbook.
