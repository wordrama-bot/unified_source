# Wordrama gameplay recovery

Prepared against production source `9314f872219e286ad95927f3af4a571fe410f833`.

## What changed

The November 4 idle-board and cross-tab commits added server waits to Enter and Play Again. This patch removes those waits. Ordinary guesses validate against the downloaded dictionary and update local state immediately. A completed round must still be committed to IndexedDB before the client marks it finished. Network delivery, checkpoint persistence, and completion verification continue in the background.

The patch includes the fast-input and reveal catch-up UX improvements. The normal grid/keyboard reveal timing remains; an accepted letter on the next row finishes both reveals. It excludes the separate Performance Polish patch and its settings/auth changes.

The backend also stops an optional prestige-frame failure from blocking all later streak updates once the core result has committed. New clients advertise support for that distinction. The original result remains in the existing durable outbox until the frame retry succeeds. Legacy clients keep their previous full-retry behavior. XP, coins, and streaks are still finalized atomically and idempotently. No database migration is required.

## Consistency policy

Gameplay does not wait for another device to respond. Background recovery still retires confirmed completed instances and rejects late responses for another board/player/pack. Completed-session catch-up cannot replace an active or unsent local board. Play Again uses a newer unfinished board if background recovery has already restored it; otherwise it starts a fresh unique instance immediately.

If two devices play the same old instance before they can communicate, the server counts that instance once. This is an unavoidable tradeoff of responsive offline play. It must not hold the player at the Enter key waiting for cross-device agreement.

## Applying

This is one consolidated patch for production main, including the two earlier UX patches. Do not apply it on top of the Fast Typing, Reveal Catch-Up, or Performance Polish patch. Keep those local changes on their existing branch and use a fresh worktree:

```powershell
cd C:\wordrama\unified_source
git fetch myfork
git worktree add -b fix/gameplay-response C:\wordrama\gameplay-response myfork/main
cd C:\wordrama\gameplay-response
git apply --check "$HOME\Downloads\Wordrama-Gameplay-Recovery.patch"
git apply "$HOME\Downloads\Wordrama-Gameplay-Recovery.patch"
git status --short
```

If the check reports a conflict, stop and review the current main rather than forcing the patch. New regression-test files appear as untracked files until added; include them in the eventual commit.

## Validation and deployment

Run the frontend locally from the new worktree and test first-guess entry with Network throttled, then with Network offline after the pack has loaded. Submit several guesses without an extra Enter press. Finish eight rounds with wins/losses, refreshing once while offline, then reconnect. Verify history, streaks, coins and XP catch up once and that the durable pending-result queue drains. Use an expendable test account, because completed rounds affect its statistics.

Test two tabs as well: complete a game in A, return to B, and confirm background retirement/catch-up. Start a new round before a deliberately delayed old response returns and confirm that response cannot overwrite the new instance.

For repeatable automated checks, install the existing backend dependencies and the dependencies in scripts/wordle-sync-tests. Run:

```powershell
cd C:\wordrama\gameplay-response\scripts\wordle-sync-tests
npm ci
bun test --timeout 30000 . ../../api-v2-main/api-v2-main/src/services/game/wordle/result-idempotency.test.ts
bun test --timeout 30000 ../../api-v2-main/api-v2-main/src/services/game/wordle/state-compatibility.test.ts
```

The state-compatibility tests deliberately mock the same backend dependency as the idempotency tests, so keep them in separate Bun invocations as the existing test script does.

After local browser checks and code review, deploy the backend first, then the frontend. Existing clients remain compatible. No production deployment or database change has been performed by this work.

A real network/server outage can leave results pending; retaining them and retrying is the intended behavior. This patch cannot repair already incorrect historical streaks or establish that every reported production symptom has the same cause. Real browser verification remains necessary before claiming the regression is resolved for users.
