# Three-letter and Unhinged pack implementation audit (draft)

Branch-only planning; **no production database or deployment changes**.

## Product rules
- THREE_LETTER: 3 letters, Plus/Creator subscription entitlement, 1,000 coins or $0.99 (user-approved pricing; subscription includes access), independent daily/infinite game slots, rankings and streaks.
- FIVE_LETTER_UNHINGED: 5 letters, $2.99 Stripe-only permanent purchase, not eligible for subscription or coins; real-money checkout required. User accepts payment checkout as the access gate; do not claim this verifies age.
- Word lists pending. Do not enable either pack until supplied, validated, and deployed.
- Adult content must not be exposed in public bundles, API responses to non-owners, previews, or public leaderboard labels that disclose answers.

## Verified production schema (read-only 2026-11-08)
- _items: type WORDLE_WORD_PACK, coin_price, real_price, purchasable_with_coins, purchasable_with_money.
- _player_entitlements, _player_subscriptions, _purchased_items, _store_orders, _store_order_items, _stripe_webhook_events.
- _wordle_game_result: word_pack, word_length, game_instance_id, effects_completed.
- _wordle_streak: word_pack, type, current_streak, best_streak.
- _wordle_saved_state: game_state JSON and state_revision.
- Cron: daily (10m), weekly (15m), monthly (30m), yearly (hourly), all-time (2h) concurrent MV refreshes; team stats (2h) nonconcurrent.
- Existing daily stats view explicitly pivots word_pack names into fixed fields. New packs need additive aggregates and API/UX mappings. Inspect all period views, materialized views, dependent views, indexes and refresh behavior before migration.

## Verified frontend
- src/redux/wordle/defaultStates.ts defines per-pack DAILY and INFINITE slots.
- src/components/wordle/App.tsx maps pack IDs to stats keys, filters available packs by server-reported ownership, and reconciles game result outbox with saved state. Preserve this logic.

## Work remaining before implementation
1. Trace server word pack catalog, solution/guess validation, purchase routes, Stripe checkout/webhooks, subscription grant paths and all entitlement read/write paths. Enforce Unhinged ownership server-side for game issuance, results, and saved-state selection.
2. Trace frontend config, word list loading, Redux types, default state merge/hydration, selector, shop, purchase refresh, statistics and leaderboard selectors. Test existing saved JSON lacking new slots.
3. Inventory pg_matviews, pg_views, dependencies, indexes, policies, SQL functions/triggers, all cron definitions and existing pack counts. Record baseline results and cron health.
4. Add additive SQL migrations in repo, test on staging only; avoid destructive replacements, historical backfills, and production refreshes. Ensure concurrent refresh unique indexes remain valid.
5. Tests: unauthorized access, forged subscription/coin entitlements, webhook replay/refund, age acknowledgement, paid purchase, 3-letter game length/validation, existing packs, outbox idempotency, cross-tab sync, daily rollover, streak isolation, period leaderboards and team stats.
6. User does not want an additional age-verification workflow. Retain Stripe-only purchase gate for Unhinged; do not describe card payment as age verification. Any applicable legal or processor requirements remain independent of this preference.
7. After word lists arrive, validate normalization, length, duplicates, guess dictionary and solutions; stage and enable through explicit rollout.

## Deployment
No prod writes or production deploys. Staging verification, migration review, rollback plan and explicit approval required.

## Frontend marketplace findings (2026-11-08, repository inspection)
- `src/app/marketplace/word-packs/page.tsx` uses `useGetStoreItemsQuery`, `usePurchaseItemsWithCoinsMutation`, and `useCreateItemCheckoutSessionMutation`.
- The marketplace has a coin basket and direct Stripe checkout handler. Unhinged must be excluded from the basket **and** rejected by the server coin-purchase endpoint. Frontend exclusion is only defense-in-depth.
- Existing marketplace sorting is keyed by item UUID, not pack identifier. New items need a stable display-order strategy; don't guess future UUIDs.
- The page currently defines `isCashPrice = false` while rendering cards. Audit the shared `Product` component's real-money button before changing any purchase UI.
- `src/components/wordle/App.tsx` computes `availableWordPacks` as intersection of `wordleDefaultState` keys and `useGetMyWordPacksQuery` results. New board slots alone do not grant access.
- The app has a fixed `wordPackAllTimeStatsMap`; update this mapping only alongside server statistics and leaderboard response changes.

## Safe next implementation sequence
1. Identify actual backend endpoints, authorization and Stripe webhook fulfillment before modifying UI purchase flows.
2. Implement server-side deny-by-default policy for Unhinged and keep both packs disabled until content and server paths are complete.
3. Extend marketplace eligibility and sorting based on actual server item metadata, with tests for basket exclusions and subscription handling.
4. Extend statistics and leaderboards with reviewed migration scripts only; no database execution under current instructions.
