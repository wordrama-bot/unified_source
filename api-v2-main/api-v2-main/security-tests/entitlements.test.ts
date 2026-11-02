import { afterEach, beforeEach, expect, mock, test } from 'bun:test';
let calls: any[] = [], rpcError: any, rows: any[];
mock.module('../src/models', () => ({ db: {
  from() { throw new Error('Application-clock table fallback forbidden'); },
  async rpc(name: string, args: any) { calls.push({ name, args }); return { data: rows, error: rpcError }; },
} }));
const { getPlayerEntitlements, hasPlayerEntitlement } = await import('../src/services/marketplaceV2/entitlements');
const RealDate = Date;
beforeEach(() => { calls = []; rpcError = null; rows = [{ entitlement_key: 'THEME:GALAXY', starts_at: '2026-11-02T22:33:26Z', expires_at: '2026-11-03T22:33:26Z' }]; });
afterEach(() => { globalThis.Date = RealDate; });
for (const offset of [-86400000, 86400000]) {
  test(`ownership trusts database with application clock offset ${offset}`, async () => {
    const clock = RealDate.parse('2026-11-02T22:33:26Z') + offset;
    globalThis.Date = class extends RealDate { constructor() { super(clock); } static now() { return clock; } } as DateConstructor;
    expect(await getPlayerEntitlements('player')).toEqual(rows);
    expect(await hasPlayerEntitlement('player','THEME:GALAXY')).toBe(true);
    expect(calls).toEqual([
      { name: 'wordrama_get_player_entitlements', args: { p_player: 'player', p_include_inactive: false } },
      { name: 'wordrama_get_player_entitlements', args: { p_player: 'player', p_include_inactive: false, p_entitlement_key: 'THEME:GALAXY' } },
    ]);
  });
}
test('inactive history is explicit, empty access is denied, errors propagate', async () => {
  await getPlayerEntitlements('player', { includeInactive: true });
  expect(calls[0].args.p_include_inactive).toBe(true);
  rows = [];
  expect(await hasPlayerEntitlement('player','THEME:GALAXY')).toBe(false);
  rpcError = new Error('database unavailable');
  await expect(getPlayerEntitlements('player')).rejects.toThrow('database unavailable');
  await expect(hasPlayerEntitlement('player','THEME:GALAXY')).rejects.toThrow('database unavailable');
});
