# Final authentication hardening follow-up

Scope: wordrama-bot/unified_source, feature/authentication-cleanup only.
Apply after the owner-pushed cde9c5c (cache and database-clock fixes).
This report supersedes pending-staging statements in earlier implementation reports.

## Every change

| File | Change |
| --- | --- |
| src/routes/v3/noRole.ts | Migration GET and implicit HEAD return 405 with Allow: POST. Neither calls authentication-dependent migration or writes. Existing rate-limited authenticated POST remains protected by the global cookie origin middleware. |
| src/services/friends.ts | Invite, accept, decline, cancel and remove use one backend-only transaction RPC. Validate UUIDs, normalize IDs, reject self-invites, validate acknowledgements, fail closed on errors. Remove unused nontransactional mutation helpers. Invite queue failures after commit are logged without reporting a failed invitation. |
| src/controllers/friends.ts | Failed removals no longer return success. Cancel response and failure messages correctly describe cancellation. |
| database-patches/authentication_cleanup_friend_actions.sql | Atomic lifecycle actions, pending-state and participant authorization checks, common unordered-pair advisory transaction lock, post-lock request recheck, reciprocal friendship inserts/removal, and actual affected-row validation. SECURITY INVOKER, empty search_path, service_role-only execution. Revoke direct browser/PUBLIC write, TRUNCATE, REFERENCES and TRIGGER privileges on both tables; retain existing SELECT and service_role grants. Installation does not modify existing player data. |
| security-tests/friends.test.ts | Replace earlier mocked preflight tests with actual service tests for single-RPC lifecycle calls, bad UUIDs, self-invites, malformed acknowledgements, errors and queue failures. Database preflight validation is now exercised by SQL tests. |
| security-tests/migration-route.test.ts | Real HTTP routing, token validation, cookie parsing and origin middleware. GET/HEAD with valid authentication cannot migrate; POST requires authentication, cookie origin protection and still supports Bearer clients. Migration handler is mocked to count writes safely. |
| security-tests/friend-controllers.test.ts | Real controllers reject failed actions and forward authenticated actor identity rather than body-supplied identity. Successful response IDs/messages preserved. |
| security-tests/run.ts | Add both new suites to isolated-process security runner. |
| scripts/wordle-sync-tests/friend-actions.test.ts | Execute actual SQL against disposable PostgreSQL/PGlite fixtures: all lifecycle actions, authorization, duplicates, state/ownership, transaction rollback on second insert or deletion failure, one-sided repair, queued contention, browser privileges and service access. |
| docs/security/authentication-final-hardening.md | This change inventory, verification results, deployment prerequisites and remaining limits. |

Backend source/test paths in this table are under api-v2-main/api-v2-main.
No dependencies, frontend implementation, Wordle game code, streak logic,
idempotency functions, challenge reward logic or billing implementation changed.

## Verification

All 137 automated tests passed with zero failures in the final runs:

| Command and directory | Tests |
| --- | ---: |
| Backend: bun run test:security | 30 |
| Backend: bun test src/middleware/tokenValidation.test.ts | 24 |
| scripts/wordle-sync-tests: bun run test (SQL, delivery, effects, result idempotency) | 62 |
| Same command, isolated state compatibility suite | 18 |
| Frontend: bun run test:purchase-cache | 3 |

- Backend Bun bundle passes (814 modules); git diff --check passes.
- Full TypeScript checking still fails on existing repository issues. Compared
  against an archived copy of the pre-patch branch with identical dependencies:
  319 diagnostics before, 317 after. Normalized file/code/message comparison shows
  no new diagnostics. This is not a clean repository-wide typecheck.
- During development, the initial security command was launched at the repository
  root without that package script; one bundle invocation also used the wrong root.
  Both were rerun in the backend successfully.
  New test type annotations/import extensions and an inferred result type were
  corrected before the final checks above.
- No real Stripe transaction was made. Billing player-resolution/invalid-plan
  regression tests remain in the passing security suite.

## Staging verification

Installed authentication_cleanup_friend_actions on staging project
ryzhfvgjobhorisyrnqa only. The first confirmation expired without applying; the
retry succeeded. A follow-up response-compatibility migration preserves the original
removed friendship row in the response; its first confirmation also expired and
its retry succeeded. The final function also passed invite/accept/remove under
SET LOCAL ROLE service_role with all fixtures rolled back. PostgreSQL integration exercised invite, unauthorized outsider
accept rejection, authorized acceptance with exactly two friendship rows, removal
of both directions, cancellation and decline. Temporary auth/player/request/friend
fixtures were all rolled back in one transaction. No existing player data changed.

Verified anon/authenticated cannot execute the function, insert friendships,
delete invitations or truncate invitations. service_role retains execution and
necessary table privileges. Security advisor output is unchanged and has no
finding for the new function. Existing unrelated notices were not altered.

PGlite's queued contention test is not proof of independent-session concurrency;
no multi-session load test was performed for this new RPC. Pair locks and row
rechecks implement serialization, but a production-scale load claim is not made.
The staging integration used database SQL, not two signed-in browser sessions.

## Readiness and rollout limits

The two identified code blockers and the related invite/removal races are fixed.
Final browser smoke tests should cover friend invite/accept/decline/cancel/remove
with two staging accounts, and account/billing navigation with this patched API.
The owner already confirmed no-refresh marketplace purchases after the prior fixes.
Migration cookie/CSRF behavior is covered by real local HTTP tests.

Production remains untouched and is not ready for an automatic rollout:

1. Production still has one reciprocal friend-request pair. The previously added
   unique-index preflight refuses installation until it is resolved. This patch
   does not delete either request or choose which one to retain. Owner approval
   for that exact data repair is required separately.
2. Review and install required SQL before deploying the API: coin transactions,
   challenge transactions, friend-request constraints (after resolving the pair),
   entitlement clock function, then this friend-action function/grant restriction.
   Preserve required explicit service_role privileges. Staging already has these.
3. A fresh production read-only function-privilege check found the earlier legacy
   admin/delete/search/webhook/Wordle functions already deny anon/authenticated
   execution and retain service_role execution. Only is_admin_banned and the two
   trigger helpers remain browser-executable. No additional legacy-RPC parity
   change was inferred or applied. Recheck privileges immediately before rollout.
4. Confirm exact production CORS origins and JWT configuration without exposing
   secrets. No environment or hosting configuration was changed in this patch.

Earlier repository-wide TypeScript errors remain a baseline limitation. The old
unmounted streamer/migrate routers remain unreachable; no legacy service-token
access was reintroduced. Earlier reports are historical snapshots, not a current
statement that staging migrations remain unapplied.

No merge, push to main, deployment, Vercel/Heroku action or production Supabase
mutation occurred. Apply this one patch on feature/authentication-cleanup, restart
the local API, and complete the staging smoke tests before any production approval.
