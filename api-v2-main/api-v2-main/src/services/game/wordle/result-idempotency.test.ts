/**
 * Wordrama result idempotency tests, using the REAL local Wordle result service.
 * All I/O dependencies are mocked before the service is imported.
 * No Supabase connection, Azure queue, or production player data is used.
 * Run from api-v2-main/api-v2-main: bun test src/services/game/wordle/result-idempotency.test.ts
 */
import { beforeEach, describe, expect, mock, test } from 'bun:test';

type Row = Record<string, any>;
const rows: Row[] = [];
let failNextInsert = false;
let failNextLookup = false;
let rewardCount = 0;
let incrementCount = 0;
let resetCount = 0;
let customCount = 0;
let messageCount = 0;
let failReward = false;
let failPrestige = false;
let loseRpcResponse = false;
let invalidRpcAck = false;

function matches(row: Row, filters: Array<[string, string, any]>) {
  return filters.every(([method, key, value]) => {
    if (method === 'gte') return String(row[key]) >= String(value);
    return row[key] === value;
  });
}

function query(table: string) {
  const filters: Array<[string, string, any]> = [];
  let insertion: Row | null = null;
  let projection = '';
  const q: any = {
    select(fields: string) { projection = fields; return q; },
    eq(key: string, value: any) { filters.push(['eq', key, value]); return q; },
    gte(key: string, value: any) { filters.push(['gte', key, value]); return q; },
    order() { return q; },
    limit() { return q; },
    insert(row: Row) { insertion = { ...row }; return q; },
    async maybeSingle() {
      if (table !== '_wordle_game_result') throw new Error(`Unexpected table ${table}`);
      if (insertion) {
        if (failNextInsert) {
          failNextInsert = false;
          return { data: null, error: { code: '08006', message: 'Simulated insert failure' } };
        }
        if (rows.some(r => r.id === insertion!.id ||
          (insertion!.game_instance_id && r.player === insertion!.player && r.game_instance_id === insertion!.game_instance_id))) {
          return { data: null, error: { code: '23505', message: 'Simulated uniqueness violation' } };
        }
        const saved = { ...insertion, id: insertion.id ?? crypto.randomUUID(), created_at: new Date().toISOString() };
        rows.push(saved);
        return { data: { id: saved.id }, error: null };
      }
      if (failNextLookup) {
        failNextLookup = false;
        return { data: null, error: { code: '08006', message: 'Simulated lookup failure' } };
      }
      return { data: rows.find(r => matches(r, filters)) ?? null, error: null };
    },
    async then(resolve: any, reject?: any) {
      const data = rows.filter(r => matches(r, filters));
      return Promise.resolve({ data, error: null }).then(resolve, reject);
    },
  };
  return q;
}

// Important: use the same relative module specifiers as the service under test.
mock.module('../../../models', () => ({ db: {
  from: (table: string) => query(table),
  async rpc(name: string, args: Row) {
    expect(name).toBe('finalize_wordle_result');
    const row = rows.find(r => r.id === args.p_result_id && r.player === args.p_player);
    if (!row) return { data: null, error: new Error('Missing result') };
    if (failReward) return { data: null, error: new Error('Simulated transaction failure') };
    if (invalidRpcAck) return { data: {}, error: null };
    if (row.effects_completed === false) {
      if (row.type === 'CUSTOM') customCount++;
      else rewardCount++;
      if (row.game_was_won) incrementCount++;
      else resetCount++;
      row.effects_completed = true;
    }
    if (loseRpcResponse) {
      loseRpcResponse = false;
      return { data: null, error: new Error('Committed but response lost') };
    }
    return { data: { completed: true, prestige: 0 }, error: null };
  },
} }));
mock.module('../../prestigeFrames', () => ({
  async awardPrestigeFrames() { if (failPrestige) throw new Error('Frame grant unavailable'); },
}));
mock.module('../../../utils/game', () => ({
  default: { generateWordleShareCode() { return 'MOCKED'; } },
}));
mock.module('../../../utils/gameLoop', () => ({
  createMessage(type: string, body: any) { return { body: { type, ...body } }; },
  async enqueue(messages: any[]) { messageCount += messages.length; },
}));

const { default: wordleService } = await import('./index');
const player = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const otherPlayer = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
function makeBody(overrides: Record<string, any> = {}) {
  return {
    type: 'INFINITE', wordPack: 'DEFAULT', solution: 'SHRUB',
    guesses: ['SLATE', 'SHRUB'], gameWasHardMode: false,
    resultId: crypto.randomUUID(), gameInstanceId: crypto.randomUUID(),
    ...overrides,
  };
}

beforeEach(() => {
  rows.length = 0;
  failNextInsert = false;
  failNextLookup = false;
  failReward = false;
  failPrestige = false;
  loseRpcResponse = false;
  invalidRpcAck = false;
  rewardCount = 0;
  incrementCount = 0;
  resetCount = 0;
  customCount = 0;
  messageCount = 0;
});

describe('Wordle result service — isolated idempotency', () => {
  test('current production result payload without game instance remains supported', async () => {
    const body = makeBody({ gameInstanceId: undefined, clientCompletedAt: new Date().toISOString() });
    expect((await wordleService.submitWordleResult(player, body)).resultId).toBe(body.resultId);
    expect((await wordleService.submitWordleResult(player, body)).resultId).toBe(body.resultId);
    expect(rows).toHaveLength(1);
    expect([rewardCount, incrementCount]).toEqual([1, 1]);
  });

  test('first win: one persisted result, reward, streak, message', async () => {
    const body = makeBody();
    const answer = await wordleService.submitWordleResult(player, body);
    expect(answer.resultId).toBe(body.resultId);
    expect(rows).toHaveLength(1);
    expect(rows[0].game_instance_id).toBe(body.gameInstanceId);
    expect(rewardCount).toBe(1);
    expect(incrementCount).toBe(1);
    expect(resetCount).toBe(0);
    expect(messageCount).toBe(1);
  });

  test('same result UUID and payload replay: no duplicated side effects', async () => {
    const body = makeBody();
    await wordleService.submitWordleResult(player, body);
    const second = await wordleService.submitWordleResult(player, body);
    expect(second.resultId).toBe(body.resultId);
    expect(second.duplicate).toBe(true);
    expect(rows).toHaveLength(1);
    expect([rewardCount, incrementCount, messageCount]).toEqual([1, 1, 1]);
  });

  test('same instance, new result UUID: duplicate acknowledged without new side effects', async () => {
    const body = makeBody();
    await wordleService.submitWordleResult(player, body);
    const newId = crypto.randomUUID();
    const second = await wordleService.submitWordleResult(player, { ...body, resultId: newId });
    expect(second.duplicateInstance).toBe(true);
    expect(second.resultId).toBe(newId); // outbox exact-request-ID acknowledgment
    expect(second.existingResultId).toBe(body.resultId);
    expect(rows).toHaveLength(1);
    expect([rewardCount, incrementCount, messageCount]).toEqual([1, 1, 1]);
  });

  test('same solution with different instances: both legitimately count', async () => {
    const body = makeBody();
    const secondBody = makeBody({ guesses: ['CRANE', 'SHRUB'] });
    const first = await wordleService.submitWordleResult(player, body);
    const second = await wordleService.submitWordleResult(player, secondBody);
    expect(first.resultId).toBe(body.resultId);
    expect(second.resultId).toBe(secondBody.resultId);
    expect(rows).toHaveLength(2);
    expect([rewardCount, incrementCount, messageCount]).toEqual([2, 2, 2]);
  });

  test('same instance with a different solution is NOT acknowledged as safe duplicate', async () => {
    const body = makeBody();
    await wordleService.submitWordleResult(player, body);
    const second = await wordleService.submitWordleResult(player, {
      ...body, resultId: crypto.randomUUID(), solution: 'CLOUD', guesses: ['CLOUD'],
    });
    expect(second.resultId).toBeUndefined();
    expect(rows).toHaveLength(1);
    expect([rewardCount, incrementCount, messageCount]).toEqual([1, 1, 1]);
  });

  test('same result UUID with altered guesses is NOT acknowledged', async () => {
    const body = makeBody();
    await wordleService.submitWordleResult(player, body);
    const second = await wordleService.submitWordleResult(player, {
      ...body, guesses: ['SHRUB'],
    });
    expect(second.resultId).toBeUndefined();
    expect(rows).toHaveLength(1);
    expect([rewardCount, incrementCount, messageCount]).toEqual([1, 1, 1]);
  });

  test('failed insert: no rewards, result can be retried', async () => {
    const body = makeBody();
    failNextInsert = true;
    const first = await wordleService.submitWordleResult(player, body);
    expect(first.resultId).toBeUndefined();
    expect(rows).toHaveLength(0);
    expect([rewardCount, incrementCount, messageCount]).toEqual([0, 0, 0]);
    const retry = await wordleService.submitWordleResult(player, body);
    expect(retry.resultId).toBe(body.resultId);
    expect(rows).toHaveLength(1);
    expect([rewardCount, incrementCount, messageCount]).toEqual([1, 1, 1]);
  });

  test('result UUID owned by a different player is not acknowledged', async () => {
    const body = makeBody();
    await wordleService.submitWordleResult(player, body);
    const rejected = await wordleService.submitWordleResult(otherPlayer, body);
    expect(rejected.resultId).toBeUndefined();
    expect(rows).toHaveLength(1);
    expect([rewardCount, incrementCount, messageCount]).toEqual([1, 1, 1]);
  });

  test('failed finalization is not acknowledged and retry repairs the saved result', async () => {
    const body = makeBody();
    failReward = true;
    expect((await wordleService.submitWordleResult(player, body)).resultId).toBeUndefined();
    expect(rows).toHaveLength(1);
    expect(rows[0].effects_completed).toBe(false);
    expect([rewardCount, incrementCount]).toEqual([0, 0]);
    failReward = false;
    const retry = await wordleService.submitWordleResult(player, body);
    expect(retry.resultId).toBe(body.resultId);
    expect(retry.duplicate).toBe(true);
    expect([rewardCount, incrementCount]).toEqual([1, 1]);
    await wordleService.submitWordleResult(player, body);
    expect([rewardCount, incrementCount]).toEqual([1, 1]);
  });

  test('different result ID for pending same instance finishes original effects first', async () => {
    const body = makeBody();
    failReward = true;
    await wordleService.submitWordleResult(player, body);
    const retryBody = { ...body, resultId: crypto.randomUUID() };
    expect((await wordleService.submitWordleResult(player, retryBody)).resultId).toBeUndefined();
    failReward = false;
    const retry = await wordleService.submitWordleResult(player, retryBody);
    expect(retry.resultId).toBe(retryBody.resultId);
    expect(retry.existingResultId).toBe(body.resultId);
    expect(rows).toHaveLength(1);
    expect([rewardCount, incrementCount]).toEqual([1, 1]);
  });

  test('lost RPC acknowledgement does not double-award on replay', async () => {
    const body = makeBody();
    loseRpcResponse = true;
    expect((await wordleService.submitWordleResult(player, body)).resultId).toBeUndefined();
    expect([rewardCount, incrementCount]).toEqual([1, 1]);
    expect((await wordleService.submitWordleResult(player, body)).resultId).toBe(body.resultId);
    expect([rewardCount, incrementCount]).toEqual([1, 1]);
  });

  test('missing completion acknowledgement retains result for retry', async () => {
    invalidRpcAck = true;
    expect((await wordleService.submitWordleResult(player, makeBody())).resultId).toBeUndefined();
  });

  test('prestige grant failure retries without repeating XP/coins/streak', async () => {
    const body = makeBody();
    failPrestige = true;
    expect((await wordleService.submitWordleResult(player, body)).resultId).toBeUndefined();
    failPrestige = false;
    expect((await wordleService.submitWordleResult(player, body)).resultId).toBe(body.resultId);
    expect([rewardCount, incrementCount]).toEqual([1, 1]);
  });

  test('loss and custom results also finalize before acknowledgement', async () => {
    const loss = makeBody({ guesses: ['CRANE'] });
    expect((await wordleService.submitWordleResult(player, loss)).resultId).toBe(loss.resultId);
    const custom = makeBody({ type: 'CUSTOM', shareCode: 'ABC' });
    expect((await wordleService.submitWordleResult(player, custom)).resultId).toBe(custom.resultId);
    expect([rewardCount, resetCount, customCount, incrementCount]).toEqual([1, 1, 1, 1]);
  });
});
