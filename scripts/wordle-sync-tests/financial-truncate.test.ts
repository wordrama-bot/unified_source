import { afterAll, expect, test } from 'bun:test';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';

const db = new PGlite();
const tables = ['_ledger', '_purchased_items', '_player_entitlements'];
const migration = await readFile(new URL(
  '../../supabase/migrations/20261104223128_authentication_cleanup_financial_truncate.sql',
  import.meta.url,
), 'utf8');
await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;`);
for (const table of tables) {
  await db.exec(`CREATE TABLE ${table}(id integer PRIMARY KEY);
    INSERT INTO ${table} VALUES (1);
    ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;
    GRANT ALL ON ${table} TO PUBLIC,anon,authenticated,service_role;`);
}
const privileges = async () => (await db.query(`
  SELECT c.relname, r.role, p.privilege,
    has_table_privilege(r.role,c.oid,p.privilege) AS allowed
  FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
  CROSS JOIN (VALUES ('anon'),('authenticated'),('service_role')) r(role)
  CROSS JOIN (VALUES ('SELECT'),('INSERT'),('UPDATE'),('DELETE'),('TRUNCATE'),('REFERENCES'),('TRIGGER')) p(privilege)
  WHERE n.nspname='public' AND c.relname IN ('_ledger','_purchased_items','_player_entitlements')
  ORDER BY c.relname,r.role,p.privilege;
`)).rows as { relname: string; role: string; privilege: string; allowed: boolean }[];
const before = await privileges();
expect(before.every(row => row.allowed)).toBe(true);
await db.exec(migration);
afterAll(() => db.close());

test('browser TRUNCATE is denied even when PUBLIC originally granted access', async () => {
  const rows = (await privileges()).filter(row => row.role !== 'service_role' && row.privilege === 'TRUNCATE');
  expect(rows).toHaveLength(6);
  expect(rows.every(row => !row.allowed)).toBe(true);
  for (const role of ['anon','authenticated']) {
    for (const table of tables) {
      await db.exec(`SET ROLE ${role}`);
      try { await expect(db.exec(`TRUNCATE ${table}`)).rejects.toThrow('permission denied'); }
      finally { await db.exec('RESET ROLE'); }
    }
  }
});
test('service_role privileges and every non-TRUNCATE grant remain unchanged', async () => {
  const keep = (row: typeof before[number]) => row.role === 'service_role' || row.privilege !== 'TRUNCATE';
  expect((await privileges()).filter(keep)).toEqual(before.filter(keep));
});
test('installation preserves sentinel rows and RLS on all three tables', async () => {
  for (const table of tables) {
    expect((await db.query(`SELECT * FROM ${table}`)).rows).toEqual([{id:1}]);
  }
  const rows = (await db.query(`SELECT relrowsecurity FROM pg_class
    WHERE oid IN ('_ledger'::regclass,'_purchased_items'::regclass,'_player_entitlements'::regclass)`)).rows;
  expect(rows.every(row => row.relrowsecurity === true)).toBe(true);
});
test('reapplying is idempotent', async () => {
  const first = await privileges();
  await db.exec(migration);
  expect(await privileges()).toEqual(first);
});
