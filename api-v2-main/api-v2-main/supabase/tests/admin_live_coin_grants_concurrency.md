# Admin live coin grants: staging concurrency verification

**Staging only.** Do not execute on production. Run after the migration is installed. Use two independent service-role database connections, A and B, and a disposable staging player with an existing `_ledger` row. Do not use an account currently involved in gameplay.

## Same request, concurrent submissions

1. Record the player's starting `_ledger.coin_balance` as `B`. Generate one UUID request ID `R` and select the same player/admin/amount/reason for both connections.
2. In A, start a transaction, call `public.admin_grant_live_coins(R, player, admin, 17, 'Concurrency test')`, and **hold the transaction open**.
3. In B, call the same RPC with the same arguments. It should block while A holds the ledger row lock.
4. Commit A. B should complete with `duplicate=true` and should not grant a second 17 coins.
5. Assert the balance is `B+17`, exactly one row exists in `_admin_coin_grant_requests` for R, and exactly one matching `COINS_GRANTED` moderation action exists.
6. Repeat with A rolled back instead of committed. B should then complete as the first successful grant, with exactly one credit.

## Different requests, concurrent submissions

1. Reset to a known staging fixture balance `B` (use a disposable player, not a production or live gameplay account).
2. In A, start a transaction and grant 17 coins with request ID R1; hold the transaction open.
3. In B, grant 23 coins with request ID R2; verify it waits on the same ledger row.
4. Commit A, allow B to finish, and assert final balance `B+40`, two audit records, and two idempotency records.

## Concurrent purchase

Repeat with a valid staging purchase via `wordrama_purchase_items_with_coins` while A holds the ledger lock. Verify the purchase sees the post-grant balance and never produces a negative balance or a partial entitlement. Do not use already-owned items.

## Permission boundary

Confirm `anon` and `authenticated` cannot execute `admin_grant_live_coins` or insert `_admin_coin_grant_requests`. Confirm the backend's admin permission middleware protects the endpoint and both feature flags default to off.

## Cleanup and evidence

Use disposable fixtures and remove test grants/audits in staging only after verifying referential integrity; record both session outputs, timestamps, starting/ending balances, and counts. **Do not mark these scenarios passed until they are actually executed in independent concurrent sessions.**
