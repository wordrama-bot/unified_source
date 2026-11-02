/// <reference path="../node_modules/@types/bun/index.d.ts" />
import { beforeEach, expect, mock, test } from 'bun:test';
const itemId = '11111111-1111-4111-8111-111111111111';
let calls: any[] = [], ack: any, rpcError: any, queueFails = false;
mock.module('../src/models', () => ({ db: {
  from() { throw new Error('Nontransactional database access forbidden'); },
  async rpc(name: string, args: any) { calls.push({ name, args }); return { data: ack, error: rpcError }; },
} }));
mock.module('../src/services/marketplaceV2/catalog', () => ({ CATALOG: [{ catalogItemId: itemId, entitlementKey: 'THEME:TEST', entitlementType: 'THEME' }] }));
mock.module('../src/services/marketplaceV2/entitlements', () => ({ getPlayerEntitlements: async () => [] }));
mock.module('../src/utils/gameLoop', () => ({ enqueue: async () => { if (queueFails) throw new Error('queue unavailable'); }, createMessage: (_: any, payload: any) => payload, sendMessage: async () => {} }));
const store = (await import('../src/services/store.js')).default;
const ledger = (await import('../src/services/ledger.js')).default;
beforeEach(() => { calls = []; ack = { purchased: true, items: [{ id: itemId }] }; rpcError = null; queueFails = false; });
test('purchase uses one transaction and server catalog entitlements', async () => {
  expect(await store.purchaseItemsWithCoins('player', [itemId])).toEqual({ data: [{ id: itemId }] });
  expect(calls).toEqual([{ name: 'wordrama_purchase_items_with_coins', args: {
    p_player: 'player', p_items: [itemId], p_entitlements: [{ item_id: itemId, key: 'THEME:TEST', type: 'THEME' }],
  } }]);
});
test('empty, duplicate, malformed and oversized batches never call RPC', async () => {
  for (const ids of [[], [itemId, itemId], ['invalid'], Array(51).fill(itemId)]) {
    expect(await store.purchaseItemsWithCoins('player', ids)).toHaveProperty('error');
  }
  expect(calls).toHaveLength(0);
});
test('RPC errors and malformed acknowledgements fail closed without legacy fallback', async () => {
  rpcError = { message: 'function missing' };
  expect(await store.purchaseItemsWithCoins('player', [itemId])).toHaveProperty('error');
  rpcError = null; ack = {};
  expect(await store.purchaseItemsWithCoins('player', [itemId])).toHaveProperty('error');
});
test('queue outage does not report a committed purchase as failed', async () => {
  queueFails = true;
  expect(await store.purchaseItemsWithCoins('player', [itemId])).toHaveProperty('data');
});
test('balance mutations use atomic delta RPC and reject invalid amounts', async () => {
  ack = { coinBalance: 100 };
  expect(await ledger.changeBalance('player', 'down', 10)).toEqual(ack);
  expect(calls[0]).toEqual({ name: 'wordrama_change_coin_balance', args: { p_player: 'player', p_delta: -10 } });
  for (const amount of [NaN, Infinity, -1, 0.1]) {
    await expect(ledger.changeBalance('player', 'up', amount)).rejects.toThrow();
  }
  rpcError = { message: 'missing ledger' };
  await expect(ledger.changeBalance('player', 'up', 1)).rejects.toThrow();
});
