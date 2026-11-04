# Wordle idle tab recovery

An open tab previously refreshed result delivery and statistics on resume but
kept its in-memory board. If that exact game instance had been completed in
another tab, browser origin, or device, it could be played again. The result
service correctly prevented a second award, leaving the player with an
uncredited replay. Saved-state revision conflicts do not themselves retire
the in-memory board.

The frontend now checks the active instance after hydration, pack changes,
focus, visibility, pageshow, and reconnect. Enter also checks before accepting
a guess when the last successful check is at least 30 seconds old. Concurrent
checks for the same board share a request. A positive completion restores the
finished board without submitting another result or granting another reward.

The lookup first checks the local completion journal, then uses authenticated
`GET /api/v3/game/wordle/completed-instance/:gameInstanceId`. The server filters
by authenticated player and exact instance ID, returns an explicit null for
unplayed instances, and disables HTTP caching. It does not write any rows.
No migration, grant, or production data repair is required.

Late responses cannot update a different board, pack, mode, or player. Editing
a guess during verification also cancels that Enter submission. Online lookup
failures ask the player to retry instead of treating the board as unplayed;
requests are aborted after six seconds. Offline play remains available, with
the local journal still preventing known replays.

This does not prevent two simultaneously active clients from racing to play
the same instance during the 30-second verification interval, or an offline
client from replaying a completion only known to the server. Server-side
idempotency remains the final protection against duplicate rewards. Legacy
boards without instance IDs retain the existing hydration recovery behavior.

## Validation

Follow-up for multiple games in another tab: foreground and Play Again now
explicitly refresh history, streak, stats and profile, even if the outbox
also delivered a result. Returning in under 30 seconds no longer skips this
refresh. Once the local board is finished and its checkpoint is acknowledged,
the client reads the latest saved session and revision while keeping the
selected mode and pack. Play Again uses this refreshed board identity, or
resumes a newer unfinished board instead of discarding its guesses.

The session refresh declines to replace unsent checkpoints or a state that
changed during the request, and it never reopens the same completed instance.
Test the exact sequence of completing three games in tab B, then returning to
tab A and pressing Play Again before submitting another result in tab A.

Run `bun run test` in `scripts/wordle-sync-tests`. It covers the actual App
verification and Enter callbacks, late responses, offline play, lookup errors,
player ownership, and the existing delivery/idempotency/revision regressions.

Validation in the review workspace: 122 sync/idempotency/revision tests passed
and the API bundled successfully (952 modules). A full frontend TypeScript
check still reports the existing baseline errors; the patch introduced no
additional diagnostics. A browser replay across two tabs has not yet been
performed.

Before merging, run both the updated API and frontend locally or on previews.
Complete a game in tab A while tab B still has its unfinished instance. Resume
tab B and verify that it shows the completed board; Play Again should create a
different instance and a genuine win should receive credit. Repeat across
word packs and after leaving a tab visible but idle for over 30 seconds.

Deploy the API before the frontend: the new frontend needs the read-only
completion endpoint. Until that endpoint is available, online unfinished
boards will ask the player to retry verification. No deployment is performed
by this patch.
