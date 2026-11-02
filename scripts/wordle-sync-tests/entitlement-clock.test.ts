import { afterAll, expect, test } from 'bun:test';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
const db = new PGlite();
const player = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
CREATE TABLE _player_entitlements (player_id uuid, entitlement_key text, status text,
starts_at timestamptz DEFAULT now(), expires_at timestamptz, revoked_at timestamptz,
created_at timestamptz DEFAULT now()); GRANT SELECT ON _player_entitlements TO service_role;`);
await db.exec(await readFile(new URL('../../database-patches/authentication_cleanup_entitlement_clock.sql', import.meta.url), 'utf8'));
afterAll(() => db.close());
test('fresh purchases, exact time boundaries, status, revocation, player and key isolation', async () => {
  await db.exec('BEGIN');
  await db.query(`INSERT INTO _player_entitlements VALUES
    ($1,'THEME:GALAXY','ACTIVE',now(),NULL,NULL,now()),
    ($1,'WORD_PACK:TWELVE_LETTER','ACTIVE',now(),now()+interval '1 hour',NULL,now()-interval '1 second'),
    ($1,'FUTURE','ACTIVE',now()+interval '1 microsecond',NULL,NULL,now()),
    ($1,'EXPIRED','ACTIVE',now()-interval '1 day',now(),NULL,now()),
    ($1,'REVOKED','ACTIVE',now(),NULL,now(),now()),
    ($1,'INACTIVE','REVOKED',now(),NULL,NULL,now()),
    ($2,'OTHER_PLAYER','ACTIVE',now(),NULL,NULL,now())`, [player, other]);
  expect((await db.query<any>('SELECT * FROM wordrama_get_player_entitlements($1)', [player])).rows.map(r => r.entitlement_key)).toEqual(['THEME:GALAXY','WORD_PACK:TWELVE_LETTER']);
  expect((await db.query('SELECT * FROM wordrama_get_player_entitlements($1,true)', [player])).rows).toHaveLength(6);
  expect((await db.query('SELECT * FROM wordrama_get_player_entitlements($1,false,$2)', [player,'THEME:GALAXY'])).rows).toHaveLength(1);
  expect((await db.query('SELECT * FROM wordrama_get_player_entitlements($1,false,$2)', [player,'FUTURE'])).rows).toHaveLength(0);
  await db.exec('COMMIT');
});
test('backend-only execution retains invoker permissions', async () => {
  for (const role of ['anon','authenticated','service_role']) {
    const result = await db.query<any>("SELECT has_function_privilege($1,'wordrama_get_player_entitlements(uuid,boolean,text)','EXECUTE') AS allowed", [role]);
    expect(result.rows[0].allowed).toBe(role === 'service_role');
  }
  await db.exec('SET ROLE service_role');
  expect((await db.query('SELECT * FROM wordrama_get_player_entitlements($1,false,$2)', [player,'THEME:GALAXY'])).rows).toHaveLength(1);
  await db.exec('RESET ROLE; REVOKE SELECT ON _player_entitlements FROM service_role; SET ROLE service_role');
  await expect(db.query('SELECT * FROM wordrama_get_player_entitlements($1)', [player])).rejects.toThrow('permission denied');
  await db.exec('RESET ROLE');
});
