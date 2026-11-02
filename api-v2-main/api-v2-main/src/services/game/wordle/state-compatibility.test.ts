import { beforeEach, expect, mock, test } from 'bun:test';

type State = Record<string, any>;
let stored: State = {};
let revision = 0;
let failRead = false;
let failCas = false;
let rewardFailure = false;
let races: Array<(state: State) => State> = [];
const resultIds: string[] = [];
const counted = new Set<string>();
let lastResult: any;

mock.module('../../../models', () => ({ db: {
  from(name: string) {
    expect(name).toBe('_wordle_saved_state');
    const q: any = { select() { return q; }, eq() { return q; },
      async maybeSingle() { return failRead ? { error: new Error('read failed') }
        : { data: { game_state: structuredClone(stored), state_revision: revision } }; } };
    return q;
  },
  async rpc(name: string, args: any) {
    expect(name).toBe('wordrama_save_wordle_state');
    if (failCas) return { error: new Error('CAS failed') };
    if (races.length) { stored = races.shift()!(structuredClone(stored)); revision++; }
    if (args.p_expected_revision !== revision) return { data: [{ saved: false, current_revision: revision, current_game_state: structuredClone(stored) }] };
    stored = structuredClone(args.p_game_state); revision++;
    return { data: [{ saved: true, current_revision: revision, current_game_state: structuredClone(stored) }] };
  },
} }));
mock.module('./', () => ({ default: {
  async submitWordleResult(_user: string, body: any) {
    lastResult = body;
    const id = body.resultId ?? body.gameInstanceId;
    if (!id) throw new Error('State completion missing stable identity');
    resultIds.push(id);
    if (rewardFailure) return {};
    counted.add(id);
    return { resultId: id };
  },
} }));
const { default: service } = await import('./state');
const { mergeLegacyWordleState } = await import('./legacy-state');
const player = 'player-one';
const game = (guesses: string[] = [], extra: State = {}) => ({
  solution: 'SHRUB', guesses, isGameWon: guesses.includes('SHRUB'),
  isGameLost: guesses.length === 6 && !guesses.includes('SHRUB'),
  isGameInProgress: guesses.length > 0 && !guesses.includes('SHRUB'),
  resultSave: false, ...extra,
});
const state = (board = game(), extra: State = {}): State => ({
  gameMode: 'INFINITE', wordPack: 'FIVE_LETTER', wordLength: 5,
  modes: { INFINITE: { FIVE_LETTER: board } }, ...extra,
});
const active = () => stored.modes.INFINITE.FIVE_LETTER;
beforeEach(() => {
  stored = {}; revision = 0; failRead = false; failCas = false;
  rewardFailure = false; races = []; resultIds.length = 0; counted.clear(); lastResult = undefined;
});

test('production flat body bootstraps and saves progress without envelope', async () => {
  expect((await service.updateGameState(player, state())).status).toBe('saved');
  expect((await service.updateGameState(player, state(game(['STARE'])))).status).toBe('saved');
  expect(active().guesses).toEqual(['STARE']);
  expect(revision).toBe(2);
  expect(stored.gameState).toBeUndefined();
});
test('modern envelope continues to enforce the supplied revision', async () => {
  stored = state(); revision = 4;
  const input = { gameState: state(game(['STARE'])), expectedRevision: 3 };
  expect((await service.updateGameState(player, input)).status).toBe('conflict');
  expect(active().guesses).toHaveLength(0);
  input.expectedRevision = 4;
  expect((await service.updateGameState(player, input)).status).toBe('saved');
  expect(revision).toBe(5);
});
test('malformed envelope cannot fall back to revisionless saving', async () => {
  stored = state();
  for (const input of [null, [], {}, { ...state(), expectedRevision: -1 },
    { ...state(), gameState: state() }, { gameState: state(), expectedRevision: '0' },
    { gameState: state(), expectedRevision: 0.5 }]) {
    expect((await service.updateGameState(player, input)).status).toBe('invalid');
  }
  expect(revision).toBe(0);
});
test('stale and identical legacy requests never regress a board', async () => {
  stored = state(game(['STARE', 'PINKY'])); revision = 8;
  expect((await service.updateGameState(player, state(game(['STARE'])))).status).toBe('saved');
  expect(active().guesses).toEqual(['STARE', 'PINKY']);
});
test('legacy active-board merge preserves inactive modern boards and settings', async () => {
  stored = state();
  stored.modes.DAILY = { FIVE_LETTER: game(['SHRUB'], { gameInstanceId: 'modern' }) };
  stored.setting = 'server';
  const incoming = state(game(['STARE']), { setting: 'stale' });
  incoming.modes.DAILY = { FIVE_LETTER: game() };
  await service.updateGameState(player, incoming);
  expect(stored.modes.DAILY.FIVE_LETTER.gameInstanceId).toBe('modern');
  expect(stored.modes.DAILY.FIVE_LETTER.guesses).toEqual(['SHRUB']);
  expect(stored.setting).toBe('server');
});
test('unidentified legacy request cannot replace a modern identified board', async () => {
  stored = state(game(['STARE'], { gameInstanceId: 'modern' }));
  expect((await service.updateGameState(player, state(game(['STARE', 'SHRUB'])))).status).toBe('conflict');
  expect(active().gameInstanceId).toBe('modern');
  expect(revision).toBe(0);
});
test('legacy tab hydrated with exact modern identity can extend and start a clean successor', async () => {
  stored = state(game(['STARE'], { gameInstanceId: 'modern' }));
  const incoming = state(game(['STARE', 'SHRUB'], { gameInstanceId: 'modern' }));
  expect((await service.updateGameState(player, incoming)).status).toBe('saved');
  const next = state(game([], { solution: 'CLOUD', gameInstanceId: 'modern' }));
  expect((await service.updateGameState(player, next)).status).toBe('saved');
  expect(active().solution).toBe('CLOUD');
  expect(active().gameInstanceId).toBeUndefined();
  expect(active()._legacyParentInstanceId).toBe('modern');
  const progress = state(game(['STARE'], { solution: 'CLOUD', gameInstanceId: 'modern' }));
  expect((await service.updateGameState(player, progress)).status).toBe('saved');
  expect(active().guesses).toEqual(['STARE']);
});
test('divergent guess history and unobserved different board are rejected', async () => {
  stored = state(game(['STARE']));
  expect((await service.updateGameState(player, state(game(['CRANE'])))).status).toBe('conflict');
  expect((await service.updateGameState(player, state(game([], { solution: 'CLOUD' })))).status).toBe('conflict');
});
test('CAS contention recomputes merge, preserving the winning newer progress', async () => {
  stored = state(); revision = 2;
  races.push(() => state(game(['STARE', 'PINKY'])));
  expect((await service.updateGameState(player, state(game(['STARE'])))).status).toBe('saved');
  expect(active().guesses).toEqual(['STARE', 'PINKY']);
  expect(revision).toBe(4);
});
test('modern board winning CAS contention cannot be overwritten by a legacy retry', async () => {
  stored = state();
  races.push(() => state(game(['STARE'], { gameInstanceId: 'modern' })));
  expect((await service.updateGameState(player, state(game(['STARE'])))).status).toBe('conflict');
  expect(active().gameInstanceId).toBe('modern');
});
test('state-only legacy completion gets stable ID and replay does not re-award', async () => {
  stored = state(game(['STARE']));
  const incoming = state(game(['STARE', 'SHRUB'], { resultSave: true }));
  expect((await service.updateGameState(player, incoming)).status).toBe('saved');
  expect(active().resultSave).toBe(false);
  expect(active()._legacyResultId).toMatch(/^[0-9a-f-]{36}$/);
  expect((await service.updateGameState(player, incoming)).status).toBe('saved');
  expect(counted.size).toBe(1);
  expect(resultIds).toHaveLength(1);
});
test('failed state-only completion is durable and a later read recovers it once', async () => {
  stored = state(game(['STARE'])); rewardFailure = true;
  const incoming = state(game(['STARE', 'SHRUB'], { resultSave: true }));
  expect((await service.updateGameState(player, incoming)).status).toBe('error');
  const id = active()._legacyResultId;
  expect(active().resultSave).toBe(true);
  expect(counted.size).toBe(0);
  rewardFailure = false;
  await service.getGameState(player);
  expect(active()._legacyResultId).toBe(id);
  expect(active().resultSave).toBe(false);
  expect(counted.size).toBe(1);
  expect(resultIds).toEqual([id, id]);
});
test('new legacy game cannot discard a pending completion; later save recovers first', async () => {
  stored = state(game(['STARE'])); rewardFailure = true;
  await service.updateGameState(player, state(game(['STARE', 'SHRUB'], { resultSave: true })));
  const next = state(game([], { solution: 'CLOUD' }));
  expect((await service.updateGameState(player, next)).status).toBe('conflict');
  expect(active().solution).toBe('SHRUB');
  rewardFailure = false;
  expect((await service.updateGameState(player, next)).status).toBe('saved');
  expect(active().solution).toBe('CLOUD');
  expect(active()._legacyResultId).toBeUndefined();
  expect(counted.size).toBe(1);
});
test('custom legacy completion forwards its actual share code', async () => {
  stored = { ...state(), gameMode: 'CUSTOM', custom: game(['STARE'], { joinCode: 'SHARED' }) };
  const incoming = { ...stored, custom: game(['STARE', 'SHRUB'], { resultSave: true, joinCode: 'SHARED' }) };
  expect((await service.updateGameState(player, incoming)).status).toBe('saved');
  expect(lastResult.shareCode).toBe('SHARED');
  expect(counted.size).toBe(1);
});
test('legacy client cannot inject completion identity; DB failures never acknowledge saving', async () => {
  stored = state();
  const merged = mergeLegacyWordleState(state(game(['SHRUB'], { resultSave: true, _legacyResultId: 'forged' })), stored)!;
  expect(merged.modes.INFINITE.FIVE_LETTER._legacyResultId).not.toBe('forged');
  failRead = true;
  expect((await service.updateGameState(player, state())).status).toBe('error');
  failRead = false; failCas = true;
  expect((await service.updateGameState(player, state())).status).toBe('error');
});


test('same-word empty reset after completion requires refresh rather than silent replay', async () => {
  stored = state(game(['SHRUB']));
  expect((await service.updateGameState(player, state(game()))).status).toBe('conflict');
  expect(active().isGameWon).toBe(true);
});


test('delayed empty snapshot cannot resurrect an earlier observed legacy game', async () => {
  stored = state(game(['SHRUB']));
  const next = state(game([], { solution: 'CLOUD' }));
  expect((await service.updateGameState(player, next)).status).toBe('saved');
  expect((await service.updateGameState(player, state(game(['CLOUD'], { solution: 'CLOUD', isGameWon: true, isGameInProgress: false })))).status).toBe('saved');
  expect((await service.updateGameState(player, state(game()))).status).toBe('conflict');
  expect(active().solution).toBe('CLOUD');
  expect(active().isGameWon).toBe(true);
});


test('read during completion failure returns the latest revision without a retry loop', async () => {
  stored = state(game(['STARE'])); rewardFailure = true;
  await service.updateGameState(player, state(game(['STARE', 'SHRUB'], { resultSave: true })));
  const before = resultIds.length;
  const snapshot = await service.getGameState(player);
  expect(resultIds.length - before).toBe(1);
  expect(snapshot?.revision).toBe(revision);
  expect(snapshot?.gameState.modes.INFINITE.FIVE_LETTER.resultSave).toBe(true);
});
