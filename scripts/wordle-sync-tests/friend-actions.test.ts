import { afterAll, beforeEach, expect, test } from 'bun:test';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
const db = new PGlite();
const a = '11111111-1111-4111-8111-111111111111';
const b = '22222222-2222-4222-8222-222222222222';
const c = '33333333-3333-4333-8333-333333333333';
await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
CREATE TABLE _players(id uuid PRIMARY KEY);
CREATE TABLE _friend_requests(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), sending_player uuid REFERENCES _players, receiving_player uuid REFERENCES _players, status text DEFAULT 'PENDING',created_at timestamptz DEFAULT now());
CREATE TABLE _friends(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),player uuid REFERENCES _players,friend_id uuid REFERENCES _players,created_at timestamptz DEFAULT now());
GRANT ALL ON _players,_friends,_friend_requests TO service_role,anon,authenticated;`);
await db.exec(await readFile(new URL('../../database-patches/authentication_cleanup_friend_actions.sql',import.meta.url),'utf8'));
const action = async (player: string, target: string, verb: string) => (await db.query<any>('SELECT wordrama_friend_action($1,$2,$3) AS result',[player,target,verb])).rows[0].result;
const count = async (table: string) => (await db.query<any>(`SELECT count(*)::int AS n FROM ${table}`)).rows[0].n;
beforeEach(async () => {
  await db.exec('TRUNCATE _friends,_friend_requests,_players CASCADE');
  await db.query('INSERT INTO _players VALUES ($1),($2),($3)',[a,b,c]);
});
afterAll(() => db.close());
test('invite and acceptance create both directions and consume the invitation exactly once',async () => {
  const invite = await action(a,b,'invite');
  expect(invite.status).toBe('PENDING');
  const accepted = await action(b,invite.id,'accept');
  expect(accepted).toEqual({requestId:invite.id,status:'accepted'});
  expect(await count('_friends')).toBe(2); expect(await count('_friend_requests')).toBe(0);
  await expect(action(b,invite.id,'accept')).rejects.toThrow('unavailable');
  expect(await count('_friends')).toBe(2);
});
test('self, absent target, duplicate/reverse invite and existing friendship are rejected',async () => {
  await expect(action(a,a,'invite')).rejects.toThrow();
  await expect(action(a,'44444444-4444-4444-8444-444444444444','invite')).rejects.toThrow('Player not found');
  const invite = await action(a,b,'invite');
  await expect(action(a,b,'invite')).rejects.toThrow('already exists');
  await expect(action(b,a,'invite')).rejects.toThrow('already exists');
  await action(b,invite.id,'accept');
  await expect(action(a,b,'invite')).rejects.toThrow('Already friends');
});
test('outsiders and wrong directions cannot accept, cancel or decline',async () => {
  const invite = await action(a,b,'invite');
  for (const [player,verb] of [[a,'accept'],[a,'decline'],[b,'cancel'],[c,'accept'],[c,'decline'],[c,'cancel']]) {
    await expect(action(player,invite.id,verb)).rejects.toThrow('unavailable');
  }
  expect(await count('_friend_requests')).toBe(1); expect(await count('_friends')).toBe(0);
});
test('decline and cancel require a real owned pending row, and replays fail',async () => {
  for (const verb of ['decline','cancel']) {
    const invite = await action(a,b,'invite');
    expect((await action(verb === 'cancel' ? a : b,invite.id,verb)).requestId).toBe(invite.id);
    await expect(action(verb === 'cancel' ? a : b,invite.id,verb)).rejects.toThrow('unavailable');
  }
  const invite = await action(a,b,'invite');
  await db.query("UPDATE _friend_requests SET status='DECLINED' WHERE id=$1",[invite.id]);
  await expect(action(b,invite.id,'accept')).rejects.toThrow('unavailable');
});
test('second friendship insertion failure rolls back first insertion and preserves invitation',async () => {
  const invite = await action(a,b,'invite');
  await db.exec(`ALTER TABLE _friends ADD CONSTRAINT fail_reverse CHECK(player <> '${a}'::uuid)`);
  await expect(action(b,invite.id,'accept')).rejects.toThrow('fail_reverse');
  expect(await count('_friends')).toBe(0); expect(await count('_friend_requests')).toBe(1);
  await db.exec('ALTER TABLE _friends DROP CONSTRAINT fail_reverse');
});
test('accept repairs one-sided friendship without duplicates; removal deletes both or rolls back',async () => {
  const invite = await action(a,b,'invite');
  await db.query('INSERT INTO _friends(player,friend_id) VALUES ($1,$2)',[a,b]);
  await action(b,invite.id,'accept'); expect(await count('_friends')).toBe(2);
  await expect(action(c,b,'remove')).rejects.toThrow('unavailable');
  await db.exec(`CREATE FUNCTION fail_delete() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF OLD.player='${b}'::uuid THEN RAISE EXCEPTION 'delete failure'; END IF; RETURN OLD; END $$;
    CREATE TRIGGER fail_delete BEFORE DELETE ON _friends FOR EACH ROW EXECUTE FUNCTION fail_delete();`);
  await expect(action(a,b,'remove')).rejects.toThrow('delete failure');
  expect(await count('_friends')).toBe(2);
  await db.exec('DROP TRIGGER fail_delete ON _friends; DROP FUNCTION fail_delete()');
  expect(await action(a,b,'remove')).toHaveProperty('friend_id',b); expect(await count('_friends')).toBe(0);
  await expect(action(a,b,'remove')).rejects.toThrow('unavailable');
});
test('competing queued lifecycle actions have one winner',async () => {
  const invite = await action(a,b,'invite');
  const results = await Promise.allSettled([action(b,invite.id,'accept'),action(a,invite.id,'cancel')]);
  expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);
  expect(await count('_friend_requests')).toBe(0); expect(await count('_friends')).toBe(2);
});
test('function and direct writes are unavailable to browser roles; service access retained',async () => {
  for (const role of ['anon','authenticated','service_role']) {
    const result=await db.query<any>("SELECT has_function_privilege($1,'wordrama_friend_action(uuid,uuid,text)','EXECUTE') AS allowed",[role]);
    expect(result.rows[0].allowed).toBe(role==='service_role');
    for (const table of ['_friends','_friend_requests']) for (const privilege of ['INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER']) {
      const r=await db.query<any>('SELECT has_table_privilege($1,$2,$3) AS allowed',[role,table,privilege]);
      expect(r.rows[0].allowed).toBe(role==='service_role');
    }
  }
  await db.exec('SET ROLE service_role');
  expect((await action(a,b,'invite')).status).toBe('PENDING');
  await db.exec('RESET ROLE');
});
