import { afterAll, afterEach, beforeEach, expect, mock, test } from 'bun:test';
import { configureStore } from '@reduxjs/toolkit';

// Exercise the real API slice and RTK Query middleware; only HTTP/auth are fake.
mock.module('../src/lib/config.js', () => ({ API_BASE_URL: 'https://wordrama-test.invalid' }));
mock.module('../src/utils/supabase/client.ts', () => ({
  supabase: { auth: { getSession: async () => ({ data: { session: null } }) } },
}));
const { wordramaApiV3: api } = await import('../src/redux/api/wordrama.ts');
const originalFetch = globalThis.fetch;
let store, owned, calls, failPurchase;
beforeEach(() => {
  owned = false;
  failPurchase = false;
  calls = new Map();
  globalThis.fetch = async (input) => {
    const path = new URL(typeof input === 'string' ? input : input.url).pathname;
    calls.set(path, (calls.get(path) || 0) + 1);
    if (path === '/api/v3/store/purchase/with-coins') {
      if (failPurchase) return Response.json({ message: 'Insufficient funds' }, { status: 400 });
      owned = true;
      return Response.json({ status: 200, count: 1, data: [{ id: 'item' }] });
    }
    if (path === '/api/v3/game/wordle/wordpacks') {
      return Response.json({ data: owned ? ['FIVE_LETTER', 'FOUR_LETTER'] : ['FIVE_LETTER'] });
    }
    if (path === '/api/v3/player/me/entitlements') {
      return Response.json({ data: owned ? [{ entitlement_key: 'THEME:CYBERPUNK', status: 'ACTIVE' }] : [] });
    }
    if (path === '/api/v3/game/wordle/wordpack/FOUR_LETTER') {
      return Response.json({ data: { accessible: owned } });
    }
    throw new Error(`Unexpected test request: ${path}`);
  };
  store = configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (defaults) => defaults().concat(api.middleware),
  });
});
afterEach(() => { store.dispatch(api.util.resetApiState()); });
afterAll(() => { globalThis.fetch = originalFetch; });
const packs = () => api.endpoints.getMyWordPacks.select()(store.getState());
const entitlements = () => api.endpoints.getMyEntitlements.select()(store.getState());
const settleQueries = () => Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));
async function waitForOwnership() {
  // RTK Query batches invalidation and subscription updates asynchronously.
  const deadline = Date.now() + 2000;
  while (Date.now() < deadline) {
    if (packs().data?.data.includes('FOUR_LETTER') && entitlements().data?.data.length === 1) return;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  throw new Error(`Ownership did not refresh: ${JSON.stringify([...calls])}`);
}

test('successful coin purchase refreshes active ownership queries without reloading', async () => {
  await store.dispatch(api.endpoints.getMyWordPacks.initiate());
  await store.dispatch(api.endpoints.getMyEntitlements.initiate());
  await store.dispatch(api.endpoints.getWordleWordPack.initiate('FOUR_LETTER'));
  expect(packs().data.data).not.toContain('FOUR_LETTER');
  expect(entitlements().data.data).toHaveLength(0);
  await store.dispatch(api.endpoints.purchaseItemsWithCoins.initiate(['item'])).unwrap();
  await settleQueries();
  await waitForOwnership();
  expect(packs().data.data).toContain('FOUR_LETTER');
  expect(entitlements().data.data[0].entitlement_key).toBe('THEME:CYBERPUNK');
  expect(api.endpoints.getWordleWordPack.select('FOUR_LETTER')(store.getState()).data.data.accessible).toBe(true);
  expect(calls.get('/api/v3/game/wordle/wordpacks')).toBe(2);
  expect(calls.get('/api/v3/player/me/entitlements')).toBe(2);
});

test('leaving the game, buying, and returning cannot reuse stale ownership', async () => {
  const packSubscription = store.dispatch(api.endpoints.getMyWordPacks.initiate());
  const themeSubscription = store.dispatch(api.endpoints.getMyEntitlements.initiate());
  await Promise.all([packSubscription, themeSubscription]);
  packSubscription.unsubscribe();
  themeSubscription.unsubscribe();
  await store.dispatch(api.endpoints.purchaseItemsWithCoins.initiate(['item'])).unwrap();
  await settleQueries();
  // Resubscribe normally, as navigation does. No forceRefetch or reset is used.
  await store.dispatch(api.endpoints.getMyWordPacks.initiate());
  await store.dispatch(api.endpoints.getMyEntitlements.initiate());
  expect(packs().data.data).toContain('FOUR_LETTER');
  expect(entitlements().data.data).toHaveLength(1);
});

test('failed purchase does not unlock a theme or word pack', async () => {
  await store.dispatch(api.endpoints.getMyWordPacks.initiate());
  await store.dispatch(api.endpoints.getMyEntitlements.initiate());
  failPurchase = true;
  const result = await store.dispatch(api.endpoints.purchaseItemsWithCoins.initiate(['item']));
  expect(result.error.status).toBe(400);
  await settleQueries();
  expect(packs().data.data).not.toContain('FOUR_LETTER');
  expect(entitlements().data.data).toHaveLength(0);
});
