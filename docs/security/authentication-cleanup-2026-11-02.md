# Authentication cleanup implementation and validation

Scope: `wordrama-bot/unified_source`, `feature/authentication-cleanup` only.
Starting commit: `9046c1f29ae7972adfb9f8bc9db517a7abca7a31`.
Production Supabase was inspected using read-only transactions for schema, constraints, indexes, triggers, grants, RLS policies and aggregate data checks. No database changes, deployments, merges, or other branch writes were performed. Follow-up work starts from the user-pushed commit `699edfb` on the same branch.

## Behavior and every changed file

Paths below are relative to the repository; backend paths start with `api-v2-main/api-v2-main/`.

| Area | Files | Result |
| --- | --- | --- |
| Challenge HTTP writes | `src/controllers/challenge.ts` | Both HTTP progress routes now return 403 without persistence/rewards. Browser-supplied status/progress are never proof of completion. |
| Trusted challenge awards | `src/services/challenge/progress.ts` | Retains the method used by existing champion scripts; validates status, safe-integer/ranged progress and completion consistency, then calls a transactional RPC. Prestige-frame grant behavior is retained after commit, including on retries. Account initialization is unchanged. |
| Challenge transaction | `database-patches/authentication_cleanup_challenge_transactions.sql` | **Unapplied review candidate.** Active-challenge lookup, serialized completion, progress monotonicity, XP/level calculation, coins, avatar ownership and completion marker commit or roll back together. Complete/legacy-completed records never re-award. Avatar rewards cannot grant FRAME privileges. Uses SECURITY INVOKER, empty search_path, service_role-only EXECUTE. Revokes non-SELECT table privileges from anon/authenticated; existing own-row write policies otherwise bypass API restrictions. Trusted award scripts remain responsible for proving qualification from server data. |
| Spellbee removal | `src/schema/game/spellbee.ts`, `src/services/game/spellbee.ts`, `src/utils/game.ts` | Deletes the unused legacy result schema/service and removes the obsolete Spellbee reward helper. The owner confirmed the game is retired. |
| Spellbee endpoint | `src/controllers/game/spellbee.ts` | Authenticated calls to the legacy result endpoint return HTTP 410 Gone regardless of result body, without parsing results, persistence or rewards. Existing authentication middleware remains in place. |
| Browser origin protection | `src/middleware/requestOrigin.ts`, `src/app.ts` | Exact configured HTTP(S) origins only; empty CORS configuration no longer allows arbitrary origins. Cookie-bearing POST/PUT/PATCH/DELETE requests require an allowed Origin, or allowed Referer when Origin is absent. Origin:null is rejected. Explicit Bearer clients, cookie-free non-browser requests, reads and OPTIONS remain supported. Stripe's signature-verified raw-body webhook stays mounted before these browser checks. |
| Billing | `src/controllers/billing.ts` | Plan changes resolve the authenticated player's record and pass `player.id`, matching the other billing handlers. Missing player/invalid plan cannot call the plan-change service; body player IDs are ignored. |
| Friend input and HTTP handling | `src/schema/friends.ts`, `src/controllers/friends.ts` | Validate/normalize UUIDs and propagate service validation failure rather than returning success. Removes the broken `request.players.id` duplicate check. |
| Friend persistence | `src/services/friends.ts` | Reject self-invites before database reads/writes, nonexistent targets, requests in either direction and existing friendships. Fail closed on validation read failures. Insert failures cannot emit invite events. |
| Friend constraints | `database-patches/authentication_cleanup_friend_requests.sql` | **Unapplied review candidate.** Unique unordered request pairs close the concurrent-invite race; a NOT VALID self-invite check protects new writes without rewriting old records. Read-only review found one reciprocal pair in production. An explicit preflight refuses application while such pairs exist; this script does not delete/repair them. |
| Coin input and HTTP handling | `src/schema/store.ts`, `src/controllers/store.ts` | Require 1–50 distinct UUIDs, normalize IDs, reject malformed/duplicate batches, and return purchase errors instead of a success envelope. |
| Coin purchases | `src/services/store.ts` | Entire batch calls one transaction, with entitlement metadata from the server catalog. No read/debit/insert fallback. Validates transaction acknowledgement. Queue notification failure is logged after commit and does not misreport a committed purchase as failed. |
| Balance writes | `src/services/ledger.ts` | Replaces read-modify-write balance changes with a validated atomic delta RPC, preventing competing API reward writes from overwriting a purchase debit. Errors throw rather than returning a truthy empty object. |
| Coin transaction | `database-patches/authentication_cleanup_coin_transactions.sql` | **Unapplied review candidate.** Locks the player's ledger and item records; validates database prices, availability, balance, existing purchases and permanent entitlements. Debit, all ownership records and catalog entitlements are one transaction. Missing ledger, duplicate purchase, invalid item or entitlement failure cannot leave partial charges. SECURITY INVOKER, empty search_path, service_role-only EXECUTE. |
| Test entry point | `package.json`, `security-tests/run.ts` | Adds `test:security`. Mock-dependent suites run in separate processes to avoid Bun mock leakage. No dependency or lockfile changes. |
| Regression suites | `security-tests/origin.test.ts`, `security-tests/controllers.test.ts`, `security-tests/friends.test.ts`, `security-tests/store.test.ts`, `security-tests/challenge.test.ts` | Exercise the actual changed middleware/controllers/services with database/billing/queue dependencies mocked. |
| Local SQL tests | `scripts/wordle-sync-tests/coin-transactions.test.ts` | Executes the actual three candidate SQL files against a disposable embedded PostgreSQL/PGlite database. Uses the existing pinned test dependency. |
| This report | `docs/security/authentication-cleanup-2026-11-02.md` | Change inventory, commands, results and deployment limitations. |

## Test results

All **115 tests passed** in the final relevant runs, with **0 failing tests**.

| Suite | Passed | What was checked |
| --- | ---: | --- |
| New origin middleware | 3 | All unsafe methods; trusted/untrusted/missing/null Origin; Referer fallback; Bearer and cookie-free clients; fail-closed configuration. |
| New controllers | 6 | Billing resolved player, invalid plan/missing player; challenge forgery rejected; Spellbee returns 410 for legacy/malformed bodies, including an isolated HTTP POST. |
| New friends | 4 | Self/invalid IDs before I/O; missing target, duplicate and existing friendship; valid insertion; insert failure without invite event. |
| New store/ledger | 5 | Single RPC and server metadata; invalid batch rejection; missing RPC/invalid acknowledgement; post-commit queue outage; atomic delta and invalid amounts. |
| New trusted challenge service | 3 | Transaction RPC and prestige-frame grant; invalid progress; transaction failure not acknowledged. |
| New local SQL | 19 | Batch totals/ownership; duplicate replay; competing queued purchases; entitlement rollback; malformed/unavailable/invalid price; reward/debit preservation; missing ledger; RPC privileges; self/duplicate invites; single-award challenge replay; invalid/regressing progress; inactive challenge/reward rollback; avatar deduplication and invalid avatar rollback; permanent ownership prevents charging; direct browser writes revoked; friend preflight preserves duplicate rows and refuses application. |
| Existing JWT/chunked cookies | 24 | Prior authentication hardening preserved. |
| Existing Wordle result/idempotency | 15 | Replays, conflicting payloads, pending/lost acknowledgements, reward failure and recovery. |
| Existing Wordle state/legacy compatibility | 18 | Revision checks, stale saves, board merging, legacy completion and recovery. |
| Existing Wordle delivery and SQL effects | 18 | Browser journal/outbox/watchdog and actual Wordle finalizer SQL, rewards, streaks, failures, privileges and XP boundaries. |

Other checks:

- API bundle: **PASS**, `bun build src/app.ts --target bun` (814 modules).
- `git diff --check`: **PASS**.
- Repository-wide `tsc --noEmit`: **FAIL, existing baseline issues remain**. Untouched starting commit: 338 diagnostics. Final implementation: 318 diagnostics. Comparison by file, diagnostic code and message found no new diagnostic messages. This is not a clean typecheck.
- Initial local SQL run: 4 failures caused by an ambiguous PL/pgSQL `item_id` variable. Renamed it; subsequent final run passes all 19 SQL tests.
- Expected error logs in negative tests simulate queue outages, failed RPCs and lost acknowledgements; they are asserted failure cases, not test failures.

Commands (Bun 1.3.10 used):

```sh
# Backend directory
bun install --frozen-lockfile
bun run test:security
bun test src/middleware/tokenValidation.test.ts
bun test src/services/game/wordle/result-idempotency.test.ts
bun test src/services/game/wordle/state-compatibility.test.ts
bun build src/app.ts --target bun --outfile /tmp/wordrama-auth-api.js
./node_modules/.bin/tsc --noEmit

# scripts/wordle-sync-tests (existing package-lock.json dependencies)
npm ci
bun test coin-transactions.test.ts
bun test delivery.test.ts effects.test.ts
```

## Preservation and limitations

The branch retains the recent Wordle reliability history, including `8700ba4`, `7c8980f`, `44c123e` and `504ee70`, and the earlier JWT/cookie hardening commits. No existing Wordle implementation, frontend, tests, state RPC or finalizer migration was edited. The shared ledger helper is intentionally changed; modern Wordle finalization continues using its unchanged atomic SQL.

Do not deploy the API or run the champion scripts from this branch until the candidate SQL is reviewed, approved and installed in the target environment. Required order: coin functions, challenge function, friend constraints, then API. Until then new RPC callers fail closed. Nothing has been applied to Supabase.

Read-only live review confirmed required columns/defaults, player-ledger and challenge-progress uniqueness, entitlement source/status constraints, and active-permanent entitlement uniqueness. Challenge progress is bigint, so both service and SQL now reject fractional progress. No reward-mutating triggers were found on the reviewed tables; the sole custom trigger updates entitlement timestamps. The existing challenge reward ledger is empty and has no database function writers referencing it.

RLS is enabled on the reviewed tables. The live own-row INSERT/UPDATE policies on challenge progress are why the candidate now revokes direct browser-role write privileges while retaining SELECT and service_role access. No production grants or policies were changed. Aggregate checks found zero self-invites and negative balances, but one reciprocal friend-request pair; its resolution requires separate explicit approval before the friend candidate can be applied.

The SQL tests use disposable minimal fixtures, now with bigint challenge progress and simulated preexisting browser write grants. Live metadata was reviewed, but the complete production schema, triggers, data and policies were not cloned. PGlite serializes queued requests; these tests do not establish true multi-connection PostgreSQL load behavior. A full isolated PostgreSQL/staging integration test remains required before deployment. No staging project or database was modified.

Spellbee is retired. Its result endpoint is a 410 tombstone; no authoritative puzzle feed is required.

Set CORS_ORIGIN to the exact intended frontend origins in each environment before deployment. Empty config intentionally blocks browser cross-origin access and cookie writes. No environment values were changed.

Purchase queue events remain best effort after the transaction, as in the existing architecture; no durable outbox was added. Prestige-frame delivery remains a separately idempotent post-commit operation and logs grant failures, matching prior behavior.


## Follow-up after owner confirmed Spellbee retirement

- Replaced Spellbee's temporary 400/503 behavior with 410, added an HTTP regression, and removed its dead schema/service/reward helper.
- Corrected progress validation for the live bigint column in the service and candidate SQL.
- Added direct-write privilege revocation to the challenge candidate, based on actual RLS/grants.
- Added a non-destructive friend-request preflight; one production reciprocal pair is a known application blocker.
- Updated local SQL fixtures/tests and this report. Production metadata was read only.
