# Wordle legacy-client compatibility follow-up

Base: `44c123e` on `feature/wordle-streak-sync-reliability`.
This is a follow-up patch, not a replacement for the original synchronization patch.

## Behavior

The API accepts the current production client's flat saved-state body alongside
modern `{gameState, expectedRevision}` envelopes. GET and POST response shapes
remain unchanged. Explicit malformed envelopes cannot bypass revision checking.
Modern stale revisions still return 409.

Flat snapshots are not blindly written over the server state. The adapter reads
the current snapshot and merges only the client's active board, preserving other
boards and settings. Prefix-extending guesses can advance progress; stale prefixes
preserve the newer server board. CAS contention recomputes this merge rather than
attaching a fresh revision to a stale snapshot. Retries are bounded.

Identified modern boards are protected. A legacy tab that hydrated the exact
modern game ID may extend it and start an observed clean successor after its
completion; the server handles the old tab's reused ID as an internal alias.
Unidentified old snapshots cannot overwrite a different identified game.

Very old state-only completions get a server-generated UUID persisted in the
saved board before result processing. Failures leave the completion durable and
return an error. A later state read or save retries it with that same UUID and
only clears resultSave after finalization succeeds. A new legacy game cannot
replace a pending completion. Custom completions forward the actual join code.

No new SQL migration is required; this uses the existing revision CAS and effects
functions already installed in staging. Result outbox behavior and instance/UUID
idempotency protections remain in place. Current production /result payloads
without gameInstanceId remain accepted and are covered by a regression test.

## Necessary limits

A client without revisions/instance identity cannot prove ordering for every
possible snapshot. Divergent guesses, unobserved different boards with progress,
and ambiguous same-word resets return 409 instead of overwriting newer progress.
Observed legacy board history blocks resurrection of earlier completed words;
repeat-word resets or reaching 256 history entries require a client refresh.
Existing refresh enforcement still applies. Old clients do not gain a new UI
for these conflicts; their existing refresh prompt eventually moves them forward.
No claim is made that every historical revisionless snapshot is orderable.

The adapter does not automatically reconstruct unmarked historical result effects
or create a background worker. Pending state-only completions retry on later
state access; independent client outbox results retain their normal retry path.

Deploy the compatible API BEFORE the new frontend, after all original SQL
prerequisites are installed. This does not make the new frontend compatible with
an old API that blindly stores its envelope; do not roll the API back underneath
new clients without a reviewed compatibility/rollback plan.

## Local validation

`cd scripts/wordle-sync-tests` then `bun run test`:

- 33 existing/extended result, IndexedDB, delivery and PostgreSQL tests passed.
- 18 isolated compatibility service tests passed.
- Total: 51 passed, zero failed; 333 assertions.

The compatibility service tests mock I/O to exercise controlled revision races.
The PostgreSQL suite additionally executes the actual existing state CAS RPC in
local PGlite and confirms stale writes cannot replace the winning snapshot.
The runner uses separate Bun processes because the service mocks differ.

Repository-wide TypeScript checking still fails on existing configuration,
module and typing issues. No type diagnostics were reported for the new adapter
or changed state service with Bun-compatible bundler module resolution. This is
not a passing full production build or an authenticated legacy-browser staging test.

## Apply on your PC

Stop the local API using Ctrl+C. The frontend can remain running on staging.
From a clean tree at 44c123e, extract the ZIP and run:

```powershell
cd C:\wordrama\unified_source
git status --short
git branch --show-current
git am --3way "C:\Users\soldi\Downloads\Wordrama-Legacy-Compatibility\wordle-legacy-client-compatibility.patch"
cd scripts\wordle-sync-tests
bun run test
```

If your extraction folder differs, use its actual patch path. Stop if any command
fails. Then restart the API in its existing staging configuration:

```powershell
cd C:\wordrama\unified_source\api-v2-main\api-v2-main
bun run start
```

Do not merge, deploy or change production data. No env files are included in the
patch. No additional SQL is needed for this follow-up.

## Remaining staging verification

Before production, exercise authenticated flat-body POSTs through the local API:
normal legacy board progress, stale prefix retention, progression to a new game,
and old-format completion. Verify 200 on supported saves and 409 on ambiguous
saves. Confirm modern envelopes still enforce revision checking. Use a separate
staging account/tab when necessary to avoid interpreting a protected modern
board's intentional conflict as a failure of normal legacy saving.

Repeat a state-only completion after an induced finalization failure and confirm
one result/award after recovery. Recheck ordinary new-client gameplay and header
refresh. These follow-up browser checks have not yet been run by the user.
