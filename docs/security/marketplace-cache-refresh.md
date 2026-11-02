# Marketplace ownership cache refresh

Branch: feature/authentication-cleanup. Base: 33fa7b3.

A successful coin purchase invalidated Player, StoreItems and Purchases, but not the WordPacks query used by Wordle settings. Navigating back to the game could therefore reuse the pre-purchase word-pack list. The existing Player tag already refreshed theme entitlements in the simulated active-query case, so the theme symptom was not independently reproduced as a missing-tag bug.

Changes:

- src/redux/api/wordrama.ts: adds an explicit Entitlements tag and invalidates Entitlements, WordPacks and WordPack after coin purchases, in addition to existing tags.
- src/components/wordle/App.tsx: rechecks word-pack and entitlement access on mounting the game, so returning from the marketplace does not rely only on retained data. Gameplay, saved-state, result delivery and streak logic are untouched.
- package.json: adds test:purchase-cache.
- tests/purchase-cache.test.mjs: tests the real RTK Query API slice, reducer and middleware with simulated HTTP/auth. Covers active queries, leaving/buying/returning without a browser reload, and failed purchases not unlocking content.

Validation:

- Against the unchanged API slice: 2 regression tests fail, 1 passes (expected reproduction).
- With the fix: 3 tests pass, 0 fail, 12 assertions.
- Wordle App TSX transpilation: pass.
- git diff --check: pass.
- No full frontend production build or browser UI test was run for this patch. Theme behavior still needs confirmation in the user's local staging browser.

Run from wordrama-v2-main/wordrama-v2-main:

    bun run test:purchase-cache

Apply on a clean feature/authentication-cleanup working tree. Restart/reload the local frontend once to load this code; subsequent successful purchases should update available settings without another manual reload. No SQL, production deployment, Vercel or Heroku changes are required.
