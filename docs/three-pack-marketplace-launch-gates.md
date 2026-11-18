# Three-pack marketplace launch gates (PREPARATION ONLY)

This document is a release checklist, **not authorization to deploy or modify production**.

## Pack IDs and intended rules

| Pack | Item ID | Coins | Stripe | Subscription |
| --- | --- | --- | --- | --- |
| 3 Letter | f8436a71-8395-4cb1-9235-5a0d06d32f01 | 1,000 | $0.99 | PLUS / CREATOR |
| 3 Letter Crazy | f8436a71-8395-4cb1-9235-5a0d06d32f02 | 1,000 | $0.99 | PLUS / CREATOR |
| 5 Letter Unhinged (18+) | f8436a71-8395-4cb1-9235-5a0d06d32f03 | Never | $2.99 | Never |

## Observed database state (read-only audit, 2026-11-18)

- Production `public._items`: first two records exist, each discontinued and not purchasable with coins or money. Unhinged record is missing.
- Staging `public._items`: all three records are missing.
- Recheck immediately before launch. Do not assume these snapshots remain current.

## Code launch holds

- Backend `src/services/marketplaceV2/catalog.ts`: all three items currently have `isPurchasable: false` and `isStripePurchasable: false`. Leave disabled during preparation.
- Backend `src/services/marketplaceV2/plannedWordPackPolicy.ts`: gameplay/entitlement policy is enabled, but this is not the purchase activation switch.
- Frontend `src/lib/wordle/plannedPacks.ts`: `enabled: false` is a separate planning configuration; verify actual consumers before modifying it.
- Frontend marketplace now derives `Coming Soon` from DB availability. Unhinged remains Stripe-only in UI and is explicitly blocked from coin purchase in backend `store.ts`.

## Before staging activation

1. Inspect the full `public._items` schema, constraints, triggers, and representative existing word-pack rows. Construct idempotent staging-only INSERT/UPDATE SQL from the verified schema; do not invent required fields.
2. Create all three staging item records initially **discontinued and not purchasable**. Confirm IDs, type `WORDLE_WORD_PACK`, game, images, descriptions, coin and real prices.
3. Confirm Stripe test price IDs and backend environment variables: `STRIPE_PRICE_WORD_PACK_3_LETTER`, `STRIPE_PRICE_WORD_PACK_3_LETTER_CRAZY`, `STRIPE_PRICE_WORD_PACK_5_LETTER_UNHINGED`.
4. Verify coin purchase RPC validates item availability, price, ownership, and atomicity. Confirm Unhinged coin purchase remains rejected regardless of DB flags.
5. Verify backend catalog, DB flags, frontend availability, and entitlement mappings agree; test both payment paths, fulfillment, retries, subscription access, and age acknowledgement in staging.
6. Verify game and leaderboard cutover readiness and update the separate leaderboard runbook with actual rehearsal results.

## Controlled production release (requires separate explicit approval)

1. Confirm backups, rollback artifacts, maintenance/cron coordination, and exact production DB preflight.
2. Add any missing production item records in a disabled state, preserving existing item IDs and entitlements.
3. Deploy and verify the backend/frontend/database dependencies in the approved order. Keep all purchase channels disabled until prerequisites pass.
4. Enable the backend catalog flags and DB purchase flags **together as an approved release operation**, with 3 Letter and Crazy coin/card, Unhinged card only; set `discontinued: false` for all three.
5. Verify Stripe price IDs and a controlled purchase/entitlement smoke test; check PLUS/CREATOR access and that Unhinged is excluded.
6. On failure, first disable the new purchase channels; use the rehearsed DB and code rollback procedure as appropriate. Do not delete existing entitlements, player results, streaks, or rewards.

## Known code follow-up

The backend catalog activation values should be changed only as part of the approved release. There is intentionally **no live activation** in this preparation commit.
