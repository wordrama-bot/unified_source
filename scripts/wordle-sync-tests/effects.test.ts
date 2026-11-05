// Runs the actual migration in an isolated PostgreSQL WASM instance.
// Table columns/unique keys checked against staging metadata; no remote writes.
import { afterAll, beforeAll, beforeEach, expect, test } from 'bun:test';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';

const db = new PGlite();
const player = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const result = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const migration = new URL('../../supabase/migrations/20261101002803_wordle_result_effects.sql', import.meta.url);
beforeAll(async () => {
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE TABLE _wordle_saved_state(player uuid PRIMARY KEY, game_state json);
    CREATE TABLE _levels(player uuid PRIMARY KEY, xp bigint NOT NULL DEFAULT 0,
      level bigint NOT NULL DEFAULT 1, prestige bigint NOT NULL DEFAULT 0,
      xp_to_next_level bigint NOT NULL DEFAULT 59);
    CREATE TABLE _ledger(player uuid PRIMARY KEY, coin_balance bigint NOT NULL DEFAULT 0);
    CREATE TABLE _wordle_streak(player uuid, word_pack text, type text,
      current_streak bigint NOT NULL, best_streak bigint NOT NULL,
      UNIQUE(player, word_pack, type));
    CREATE TABLE _wordle_customs(share_code text PRIMARY KEY, times_played bigint NOT NULL DEFAULT 0);
    CREATE TABLE _wordle_game_result(id uuid PRIMARY KEY, player uuid NOT NULL,
      type text NOT NULL, word_pack text NOT NULL, guess_count bigint NOT NULL,
      game_was_won boolean, share_code text);
  `);
  await db.exec(readFileSync(migration, 'utf8'));
  await db.exec(readFileSync(new URL('../../database-patches/20261026_wordle_saved_state_revision.sql', import.meta.url), 'utf8'));
}, 30_000);
afterAll(() => db.close());
beforeEach(async () => {
  await db.exec(`TRUNCATE _levels, _ledger, _wordle_streak, _wordle_game_result, _wordle_customs;
    INSERT INTO _levels(player) VALUES ('${player}');
    INSERT INTO _ledger(player) VALUES ('${player}');
    INSERT INTO _wordle_game_result(id, player, type, word_pack, guess_count, game_was_won, effects_completed)
      VALUES ('${result}', '${player}', 'INFINITE', 'FIVE_LETTER', 2, true, false);`);
});
async function finalize(id = result, owner = player) {
  return (await db.query<{ack: any}>(
    'select public.finalize_wordle_result($1::uuid, $2::uuid) as ack', [owner, id])).rows[0].ack;
}
async function state() {
  return (await db.query<any>(`SELECT l.xp, l.level, l.prestige, l.xp_to_next_level,
    b.coin_balance, s.current_streak, s.best_streak, r.effects_completed
    FROM _levels l CROSS JOIN _ledger b CROSS JOIN _wordle_game_result r
    LEFT JOIN _wordle_streak s ON s.player = r.player WHERE r.id = '${result}'`)).rows[0];
}
test('actual SQL awards once; repeated/lost-response retry leaves all effects unchanged', async () => {
  expect((await finalize()).completed).toBe(true);
  const first = await state();
  expect(first).toEqual({ xp: 46, level: 3, prestige: 0, xp_to_next_level: 54,
    coin_balance: 15, current_streak: 1, best_streak: 1, effects_completed: true });
  await Promise.all([finalize(), finalize(), finalize()]);
  expect(await state()).toEqual(first);
});
test('failure after XP/coins but before streak rolls transaction back; replay repairs once', async () => {
  await db.exec(`ALTER TABLE _wordle_streak ADD CONSTRAINT injected_failure CHECK (current_streak < 1);`);
  try {
    await expect(finalize()).rejects.toThrow();
    const failed = await state();
    expect(failed.xp).toBe(0);
    expect(failed.coin_balance).toBe(0);
    expect(failed.effects_completed).toBe(false);
  } finally {
    await db.exec('ALTER TABLE _wordle_streak DROP CONSTRAINT injected_failure');
  }
  await finalize();
  expect((await state()).current_streak).toBe(1);
  expect((await state()).coin_balance).toBe(15);
});
test('missing ledger rolls back XP and remains pending', async () => {
  await db.exec('DELETE FROM _ledger');
  await expect(finalize()).rejects.toThrow('Missing Wordle player ledger');
  expect((await db.query<any>('SELECT xp FROM _levels')).rows[0].xp).toBe(0);
  expect((await db.query<any>('SELECT effects_completed FROM _wordle_game_result')).rows[0].effects_completed).toBe(false);
});
test('loss resets current streak and preserves best streak', async () => {
  await db.exec(`INSERT INTO _wordle_streak VALUES ('${player}', 'FIVE_LETTER', 'INFINITE', 8, 10);
    UPDATE _wordle_game_result SET game_was_won = false, guess_count = 6;`);
  await finalize();
  const s = await state();
  expect([s.current_streak, s.best_streak, s.coin_balance]).toEqual([0, 10, 2]);
});
test('custom counter increments exactly once without XP or coins', async () => {
  await db.exec(`INSERT INTO _wordle_customs VALUES ('ABC', 7);
    UPDATE _wordle_game_result SET type='CUSTOM', share_code='ABC';`);
  await finalize(); await finalize();
  expect((await db.query<any>('select times_played from _wordle_customs')).rows[0].times_played).toBe(8);
  expect((await state()).xp).toBe(0);
  expect((await state()).coin_balance).toBe(0);
});
test('legacy NULL marker is never replayed and migration can be reapplied', async () => {
  await db.exec('UPDATE _wordle_game_result SET effects_completed = NULL');
  await db.exec(readFileSync(migration, 'utf8'));
  expect((await finalize()).legacy).toBe(true);
  expect((await state()).coin_balance).toBe(0);
  expect((await state()).effects_completed).toBeNull();
});
test('wrong player and unprivileged RPC calls cannot finalize', async () => {
  await expect(finalize(result, result)).rejects.toThrow();
  for (const role of ['anon', 'authenticated']) {
    await db.exec(`SET ROLE ${role}`);
    try { await expect(finalize()).rejects.toThrow('permission denied'); }
    finally { await db.exec('RESET ROLE'); }
  }
});
test('XP progression matches existing levels.ts across level/prestige boundaries', async () => {
  for (const originalLevel of [1, 49, 50, 99, 100, 149, 199, 200]) {
    for (const guessCount of [1, 2, 3, 4, 5, 6]) {
      const award = [1000,150,100,50,30,20][guessCount - 1];
      const xpFor = (l: number) => Math.floor(50 * Math.pow(l >= 50 ? 1.061 : 1.08, l - 1));
      let level = originalLevel % 100;
      let xp = 37 + award;
      let threshold = xpFor(level);
      while (xp >= xpFor(level)) { threshold = xpFor(level); xp -= threshold; level++; }
      if (originalLevel >= 100) level = Math.floor(originalLevel / 100) * 100 + level;
      await db.query('UPDATE _levels SET level=$1, xp=37', [originalLevel]);
      await db.query('UPDATE _wordle_game_result SET effects_completed=false, guess_count=$1', [guessCount]);
      await finalize();
      const s = await state();
      expect([s.xp, s.level, s.prestige, s.xp_to_next_level]).toEqual([xp, level, Math.floor(level/100), threshold]);
    }
  }
});

// Exercise the compatibility adapter's existing CAS RPC in actual PostgreSQL.
test('existing state RPC rejects stale revisions for legacy adapter and modern clients', async () => {
  const call = (rev: number, value: string) => db.query<any>(
    'select * from public.wordrama_save_wordle_state($1::uuid, $2::json, $3::bigint)',
    [player, JSON.stringify({ value }), rev]);
  expect((await call(0, 'legacy')).rows[0].saved).toBe(true);
  expect((await call(0, 'stale')).rows[0].saved).toBe(false);
  const modern = (await call(1, 'modern')).rows[0];
  expect(modern.saved).toBe(true);
  expect(modern.current_revision).toBe(2);
  const staleLegacy = (await call(1, 'late-legacy')).rows[0];
  expect(staleLegacy.saved).toBe(false);
  expect(staleLegacy.current_game_state.value).toBe('modern');
});

test('eight offline rounds replay in order with correct streaks despite lost acknowledgements', async () => {
  await db.exec('DELETE FROM _wordle_game_result');
  const outcomes = [true, true, false, true, false, true, true, true];
  let current = 0, best = 0;
  for (const won of outcomes) {
    const id = crypto.randomUUID();
    await db.query(`INSERT INTO _wordle_game_result(id, player, type, word_pack, guess_count, game_was_won, effects_completed)
      VALUES ($1::uuid, $2::uuid, 'INFINITE', 'FIVE_LETTER', 2, $3, false)`, [id, player, won]);
    await finalize(id);
    await finalize(id); // Lost response: replay the exact result, not a new game.
    current = won ? current + 1 : 0; best = Math.max(best, current);
    const row = (await db.query<any>('SELECT current_streak, best_streak FROM _wordle_streak WHERE player = $1::uuid', [player])).rows[0];
    expect(row).toEqual({ current_streak: current, best_streak: best });
  }
  const count = (await db.query<any>('SELECT count(*)::int AS n FROM _wordle_game_result WHERE effects_completed = true')).rows[0].n;
  expect(count).toBe(8); expect(current).toBe(3); expect(best).toBe(3);
});
