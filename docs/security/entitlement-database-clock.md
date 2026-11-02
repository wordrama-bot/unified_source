# Entitlement database clock

## Change

The API previously compared database purchase timestamps with its host clock.
A fresh staging purchase started at 22:33:26 UTC while the API response Date was
22:33:08 UTC, hiding the entitlement until the host clock caught up.

`getPlayerEntitlements` and `hasPlayerEntitlement` now each make one call to
`wordrama_get_player_entitlements`. PostgreSQL evaluates status, revocation,
start (inclusive) and expiry (exclusive) using CURRENT_TIMESTAMP. Optional
inactive history and entitlement-key filtering remain supported. Errors propagate
without a permissive fallback. No polling or per-guess queries were added.

The SQL function is STABLE, SECURITY INVOKER, has an empty search path, and grants
execution only to service_role. Existing table permissions and RLS remain in force.
The staging migration `authentication_cleanup_entitlement_clock` is installed;
production has not been changed. Install the SQL before running this API version
in any other environment, with separate explicit approval for production.

## Validation

- Backend security runner: 24 tests pass, including 3 new ownership service tests.
- Sync/SQL/idempotency: 54 tests pass, including 2 new SQL entitlement tests.
- Wordle state compatibility: 18 tests pass.
- Frontend marketplace cache: 3 tests pass.
- New cases cover host clocks +/-24 hours, fresh purchases, start/expiry boundaries,
  future grants, revocation, inactive status, player/key isolation, inactive history,
  errors, backend-only execution, and invoker permissions.
- Staging: Galaxy is returned ACTIVE; anon/authenticated execution denied and
  service_role execution allowed. No player data changed by this migration.
- Security advisors run after migration: no findings reference the new function;
  unrelated existing notices remain outside this patch.
- `git diff --check` passes.

The first SQL test run had one assertion failure: a future start one microsecond
away had become active by the next transaction. The permission test now filters
Galaxy explicitly. Two test invocations initially used incorrect working paths;
all final suites above completed successfully.

No frontend, Wordle game logic, streak, idempotency, or deployment changes are in
this patch. Browser testing with the updated local API remains pending. Client UI
expiry checks and admin grant-preview timestamps are outside this API-read fix.

## Apply locally

Apply the patch after the marketplace cache patch on feature/authentication-cleanup,
then restart the local API (`bun run start`). Staging SQL is already installed.
Test a new marketplace purchase, then navigate to the game without a hard refresh.
No merge, production deployment, or production Supabase changes are authorized.
