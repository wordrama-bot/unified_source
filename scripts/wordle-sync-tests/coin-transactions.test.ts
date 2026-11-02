import { afterAll, beforeEach, expect, test } from 'bun:test';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
const db = new PGlite();
await db.exec(`
  CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
  CREATE TABLE _ledger (player uuid PRIMARY KEY, coin_balance bigint NOT NULL);
  CREATE TABLE _items (id uuid PRIMARY KEY, coin_price numeric, purchasable_with_coins boolean, discontinued boolean);
  CREATE TABLE _purchased_items (player_id uuid, item_id uuid, bought_with_coins boolean, bought_with_money boolean, unlocked_with_subscription boolean);
  CREATE TABLE _player_entitlements (player_id uuid, entitlement_key text, entitlement_type text CHECK(entitlement_type <> 'FAIL'), source_type text, status text, metadata jsonb, revoked_at timestamptz, starts_at timestamptz DEFAULT now(), expires_at timestamptz);
  CREATE TABLE _challenges (id uuid PRIMARY KEY, is_active boolean, coin_reward bigint, xp_reward bigint, avatar_entitlement_key text);
  CREATE TABLE _challenge_progress (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, player_id uuid, challenge_id uuid, status text, progress bigint, UNIQUE(player_id, challenge_id));
  CREATE TABLE _levels (player uuid PRIMARY KEY, xp bigint, level bigint, prestige bigint, xp_to_next_level bigint);
  CREATE TABLE _friend_requests (sending_player uuid, receiving_player uuid);
`);
await db.exec(await readFile(new URL('../../database-patches/authentication_cleanup_coin_transactions.sql', import.meta.url), 'utf8'));
await db.exec(await readFile(new URL('../../database-patches/authentication_cleanup_friend_requests.sql', import.meta.url), 'utf8'));
await db.exec('GRANT ALL ON _challenge_progress TO anon, authenticated');
await db.exec(await readFile(new URL('../../database-patches/authentication_cleanup_challenge_transactions.sql', import.meta.url), 'utf8'));
const player = '11111111-1111-4111-8111-111111111111';
const a = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const b = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
beforeEach(async () => {
  await db.exec('TRUNCATE _ledger, _items, _purchased_items, _player_entitlements, _friend_requests, _challenges, _challenge_progress, _levels');
  await db.query('INSERT INTO _ledger VALUES ($1, 100)', [player]);
  await db.query('INSERT INTO _levels VALUES ($1, 0, 1, 0, 50)', [player]);
  await db.query('INSERT INTO _challenges VALUES ($1, true, 25, 50, NULL)', [a]);
  await db.query('INSERT INTO _items VALUES ($1, 60, true, false), ($2, 30, true, false)', [a,b]);
});
afterAll(async () => { await db.close(); });
const buy = (items: string[], entitlements: any[] = []) => db.query(
  'SELECT wordrama_purchase_items_with_coins($1, $2::uuid[], $3::jsonb) AS result', [player, items, JSON.stringify(entitlements)]);
async function balance() { return (await db.query<{coin_balance: number}>('SELECT coin_balance FROM _ledger')).rows[0].coin_balance; }
async function count(table: string) { return (await db.query<{n: number}>(`SELECT count(*)::int AS n FROM ${table}`)).rows[0].n; }
test('batch debits exact total and grants all ownership atomically', async () => {
  const result = await buy([a,b], [{ item_id: a, key: 'THEME:A', type: 'THEME' }]);
  expect((result.rows[0] as any).result.purchased).toBe(true);
  expect(await balance()).toBe(10); expect(await count('_purchased_items')).toBe(2);
  expect(await count('_player_entitlements')).toBe(1);
});
test('replay cannot charge or grant twice', async () => {
  await buy([a]); await expect(buy([a])).rejects.toThrow('Item already owned');
  expect(await balance()).toBe(40); expect(await count('_purchased_items')).toBe(1);
});
test('competing purchases cannot overspend', async () => {
  await db.query('UPDATE _items SET coin_price = 60');
  const results = await Promise.allSettled([buy([a]), buy([b])]);
  expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
  expect(await balance()).toBe(40); expect(await count('_purchased_items')).toBe(1);
});
test('entitlement failure rolls back debit and every inserted item', async () => {
  await expect(buy([a,b], [{ item_id: b, key: 'FAIL', type: 'FAIL' }])).rejects.toThrow('violates check constraint');
  expect(await balance()).toBe(100); expect(await count('_purchased_items')).toBe(0);
});
test('empty, duplicate and missing items cannot debit', async () => {
  for (const items of [[], [a,a], [player]]) await expect(buy(items)).rejects.toThrow();
  expect(await balance()).toBe(100);
});
test('unavailable, discontinued, null and fractional prices cannot debit', async () => {
  for (const update of ['purchasable_with_coins = false', 'discontinued = true', 'coin_price = NULL', 'coin_price = -1', 'coin_price = 1.5']) {
    await db.query('UPDATE _items SET coin_price = 60, purchasable_with_coins = true, discontinued = false');
    await db.exec(`UPDATE _items SET ${update}`);
    await expect(buy([a])).rejects.toThrow();
  }
  expect(await balance()).toBe(100);
});
test('atomic rewards and purchases preserve both balance changes', async () => {
  await Promise.all([buy([a]), db.query('SELECT wordrama_change_coin_balance($1, 25)', [player])]);
  expect(await balance()).toBe(65);
  await expect(db.query('SELECT wordrama_change_coin_balance($1, -100)', [player])).rejects.toThrow();
  expect(await balance()).toBe(65);
});
test('missing ledger cannot create ownership', async () => {
  await db.exec('TRUNCATE _ledger'); await expect(buy([a])).rejects.toThrow();
  expect(await count('_purchased_items')).toBe(0);
});
test('coin functions are executable only by service_role', async () => {
  for (const role of ['anon', 'authenticated', 'service_role']) {
    for (const signature of ['wordrama_change_coin_balance(uuid,bigint)', 'wordrama_purchase_items_with_coins(uuid,uuid[],jsonb)']) {
      const r = await db.query<{allowed: boolean}>('SELECT has_function_privilege($1, $2, $3) AS allowed', [role, signature, 'EXECUTE']);
      expect(r.rows[0].allowed).toBe(role === 'service_role');
    }
  }
});
test('database rejects self invites and duplicate unordered pairs', async () => {
  await expect(db.query('INSERT INTO _friend_requests VALUES ($1, $1)', [player])).rejects.toThrow();
  await db.query('INSERT INTO _friend_requests VALUES ($1, $2)', [player,a]);
  await expect(db.query('INSERT INTO _friend_requests VALUES ($1, $2)', [a,player])).rejects.toThrow();
});

const complete = (status = 'COMPLETE', progress: any = 100) => db.query(
  'SELECT wordrama_update_challenge_progress($1, $2, $3, $4::numeric) AS result', [player,a,status,progress]);
test('trusted challenge completion is atomic and replay awards only once', async () => {
  await Promise.all([complete(), complete()]);
  expect(await balance()).toBe(125);
  expect(await count('_challenge_progress')).toBe(1);
  const row: any = (await db.query('SELECT * FROM _levels')).rows[0];
  expect(row.xp).toBe(0); expect(row.level).toBe(2);
});
test('challenge progress rejects invalid status, nonfinite values and regression', async () => {
  for (const [status, progress] of [['COMPLETE', 90], ['UNLOCKED', 100], ['COMPLETE', 'NaN'], ['IN_PROGRESS', 99.9], ['BAD', 0]]) {
    await expect(complete(String(status), progress)).rejects.toThrow('Invalid challenge progress');
  }
  await complete('IN_PROGRESS', 50);
  await expect(complete('IN_PROGRESS', 10)).rejects.toThrow('cannot regress');
  expect(await balance()).toBe(100);
});
test('inactive challenge and reward failure cannot persist completion', async () => {
  await db.query('UPDATE _challenges SET is_active = false');
  await expect(complete()).rejects.toThrow();
  await db.query('UPDATE _challenges SET is_active = true');
  await db.exec('TRUNCATE _ledger');
  await expect(complete()).rejects.toThrow();
  expect(await count('_challenge_progress')).toBe(0);
  expect((await db.query<any>('SELECT level FROM _levels')).rows[0].level).toBe(1);
});
test('challenge RPC is unavailable to browser database roles', async () => {
  for (const role of ['anon','authenticated','service_role']) {
    const r = await db.query<any>("SELECT has_function_privilege($1, 'wordrama_update_challenge_progress(uuid,uuid,text,numeric)', 'EXECUTE') AS allowed", [role]);
    expect(r.rows[0].allowed).toBe(role === 'service_role');
  }
});
test('challenge avatar grant is idempotent and retains existing active ownership', async () => {
  await db.query("UPDATE _challenges SET avatar_entitlement_key = 'AVATAR:TEST'");
  await complete(); await complete();
  expect(await count('_player_entitlements')).toBe(1);
  expect(await balance()).toBe(125);
  await db.exec('TRUNCATE _challenge_progress');
  await complete();
  expect(await count('_player_entitlements')).toBe(1);
});
test('invalid avatar reward rolls back XP, coins and completion', async () => {
  await db.query("UPDATE _challenges SET avatar_entitlement_key = 'FRAME:OWNER'");
  await expect(complete()).rejects.toThrow('Invalid challenge avatar reward');
  expect(await balance()).toBe(100);
  expect(await count('_challenge_progress')).toBe(0);
  expect((await db.query<any>('SELECT level FROM _levels')).rows[0].level).toBe(1);
});
test('existing permanent entitlement prevents purchase without charging', async () => {
  await db.query("INSERT INTO _player_entitlements (player_id, entitlement_key, source_type, status) VALUES ($1, 'THEME:A', 'ADMIN', 'ACTIVE')", [player]);
  await expect(buy([a], [{ item_id: a, key: 'THEME:A', type: 'THEME' }])).rejects.toThrow('Item already owned');
  expect(await balance()).toBe(100); expect(await count('_purchased_items')).toBe(0);
});

test('browser roles cannot write challenge progress directly after candidate hardening', async () => {
  for (const role of ['anon','authenticated']) {
    for (const privilege of ['INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER']) {
      const result = await db.query<any>("SELECT has_table_privilege($1, '_challenge_progress', $2) AS allowed", [role,privilege]);
      expect(result.rows[0].allowed).toBe(false);
    }
  }
});
test('friend candidate preflight refuses existing reciprocal requests without deleting them', async () => {
  // Remove the new index only inside this disposable local fixture.
  await db.exec('DROP INDEX friend_requests_unordered_pair_unique');
  await db.query('INSERT INTO _friend_requests VALUES ($1,$2),($2,$1)', [player,a]);
  const sql = await readFile(new URL('../../database-patches/authentication_cleanup_friend_requests.sql', import.meta.url), 'utf8');
  await expect(db.exec(sql)).rejects.toThrow('Resolve existing reciprocal friend requests');
  await db.exec('ROLLBACK');
  expect(await count('_friend_requests')).toBe(2);
});
