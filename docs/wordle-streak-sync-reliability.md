# Wordle synchronization reliability: local test handoff

## Scope and base

Branch: `feature/wordle-streak-sync-reliability`.
Parent: `d5d81c7276cce7fa46e6b2e9a2f77a09062bc663` on
`feature/wordle-offline-idempotency-fix`.

The fix is stacked on the saved feature branch, not main. That branch is
unchanged. Its game-instance IDs, payload/owner checks, unique result index,
completion journal, local checkpoints and revision-checked state saves are reused.
This patch does not repeat or replace those changes. No word-list changes
are included.

## Changes

- Result delivery no longer waits for hydration or for the checkpoint queue or
  recovery request. Checkpoint recovery still waits for hydration, stays ordered
  behind board saves, checks revisions and acknowledges durable checkpoints.
- A visible-page watchdog retries pending results every 30 seconds. Existing
  request timeouts, exponential retries and exact-result-ID acknowledgments remain.
- Outbox removal atomically copies a completion to the recovery journal before
  deleting it. This also protects queued entries from older IndexedDB versions.
- New API inserts explicitly set `effects_completed=false`. Before acknowledging
  any new result, matching retry, uniqueness-race retry or same-instance duplicate,
  the API calls `finalize_wordle_result` on the canonical result ID.
- The SQL function locks the result row and commits XP, coins, streak, custom
  play count and the completion marker together. An error rolls these effects
  back; the saved result remains pending for the client's next attempt. Concurrent
  retries of one result cannot repeat effects. Streak updates use atomic UPSERT;
  XP locks the player's level row and coins use an atomic increment.
- XP formulas and reward mappings follow the existing code (including its
  six-guess/loss behavior). Custom play counts use an atomic `+ 1`.
- Prestige frame grants remain in the API. A grant error prevents acknowledgment;
  retrying the idempotent entitlement grant does not repeat XP, coins or streak.
- The challenge queue remains best effort, as before. This change does not add a
  durable challenge-event delivery system.

## SQL prerequisite and limitations

New migration: `supabase/migrations/20261101002803_wordle_result_effects.sql`.
It has NOT been applied to any connected database. Staging metadata was read to
check columns, defaults, unique indexes and triggers; all SQL tests ran locally.

The function is SECURITY INVOKER, validates result ownership and is executable
only by `service_role`. The new column has no default and is not backfilled.
Old writers therefore continue to use their original path after migration-only
installation; only the new API opts into transactional processing.

Historical/old-writer rows have a NULL marker. Their existing effects are treated
as legacy and are never replayed. It is impossible to infer which old rows had
partially applied rewards safely from result existence alone. This patch fixes
future processing and retries of explicitly pending new rows; it does not repair
historical streak/reward discrepancies automatically.

If reverting an API after testing, first review/drain any `effects_completed=false`
rows with the new API. An older API does not understand pending effects and can
acknowledge them prematurely. Do not blindly backfill NULL markers to false.

The result insert and finalization are separate transactions: a result can be
visible briefly while effects are pending, but the new API does not acknowledge
it until finalization succeeds. Recovery depends on a retained/retried outbox
entry or an explicit resubmission. No scheduled server worker is added.

## Apply the supplied patch on your PC

Start with a clean working tree. Do not run these commands if `git status --short`
shows changes; preserve your local work first. The patch is based on d5d81c7,
which is already on your saved feature branch.

```powershell
cd C:\wordrama\unified_source
git status --short
git switch -c feature/wordle-streak-sync-reliability d5d81c7
git am --3way "C:\path\to\wordle-streak-sync-reliability.patch"
git log -1 --oneline
git status --short
```

If that new branch name already exists on your PC, choose a fresh test branch
name instead of overwriting/resetting it. These commands do not push or deploy.

## Automated verification

Requires Bun and the backend's normal dependencies. Test-only dependencies are
pinned in `scripts/wordle-sync-tests/package-lock.json`.

```powershell
cd C:\wordrama\unified_source\api-v2-main\api-v2-main
bun install
cd ..\..\scripts\wordle-sync-tests
npm ci
bun run test
```

31 tests passed, 0 failed:

- 14 tests of the real result service with database/queue/frame I/O mocked:
  UUID and instance replay, owner/payload rejection, failed insert, failed
  finalization, lost acknowledgment, missing completion acknowledgment,
  retry under a different UUID and prestige grant recovery.
- 8 tests of the actual migration in isolated PGlite PostgreSQL: idempotency,
  rollback after XP/coins before streak, missing ledger, loss/best streak,
  custom play count, legacy rows, privileges/ownership and XP/prestige boundaries.
  The XP test covers 48 level/guess combinations. PGlite serializes queries;
  these are not a real multi-connection PostgreSQL contention/load test.
- 9 tests using the actual App callbacks and IndexedDB helpers with controlled
  I/O: delivery before hydration, blocked/hung checkpoints, exact acknowledgments,
  retry retention, old outbox upgrade, watchdog cleanup, stale-board recovery
  from the acknowledged journal and revision-checked checkpoint acknowledgment.

Full `tsc --noEmit --pretty false` was also compared with untouched d5d81c7 using
identical installed dependencies. Both versions fail existing repository checks:
backend 401 diagnostics, frontend 366. The frontend diagnostics are identical
when line numbers are ignored. The backend replaces one existing extensionless
import diagnostic (`streak`) with the same diagnostic for `prestigeFrames`;
there are no new diagnostic categories or additional diagnostics. This is not
reported as a passing full build/type check.

## Staging checks still required

Use the staging project and staging API/frontend configuration only.

1. Confirm the saved feature branch's two SQL prerequisites are installed:
   `database-patches/20261026_wordle_game_instance_idempotency.sql` and
   `database-patches/20261026_wordle_saved_state_revision.sql`.
2. Review and apply the new effects SQL migration in staging before running the
   new API. Applying the code patch alone does not install SQL.
3. Test a solve, loss, custom game, repeated submission and offline reconnect.
   Confirm exactly one result and one reward/streak effect, and that outbox
   entries disappear only after the server acknowledges the submitted UUID.
4. Delay/fail saved-state requests while letting result requests through.
   Confirm stats catch up and reloading recovers the completed board from the
   journal. Resume checkpoint requests and confirm revision-checked recovery.
5. Interrupt the result response after the server commits, then reconnect.
   Confirm the same result is acknowledged without another reward or streak bump.
6. In staging only, induce a transactional effect failure. Confirm no successful
   result acknowledgment, a retained local outbox entry and a false marker.
   Remove the failure, retry and confirm one completed effect set.

Authenticated browser/end-to-end staging tests and real multi-connection
contention tests have not been run in this session. No production data, branch,
merge, deployment or push was performed for this implementation.
