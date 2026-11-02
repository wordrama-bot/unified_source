import { afterEach, beforeEach, expect, test } from 'bun:test';
import { IDBFactory } from 'fake-indexeddb';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import {
  queueWordleResult, getPendingWordleResults, getWordleCompletions,
  removeWordleResult, getWordleLocalCheckpoint, saveWordleLocalCheckpoint,
} from '../../wordrama-v2-main/wordrama-v2-main/src/lib/wordleResultOutbox';

// Evaluate the actual callbacks from App.tsx with controlled I/O. This tests
// delivery while hydration and checkpoint promises are stalled, without
// importing the entire UI or reimplementing the synchronization logic.
const source = ts.createSourceFile('App.tsx', readFileSync(new URL(
  '../../wordrama-v2-main/wordrama-v2-main/src/components/wordle/App.tsx', import.meta.url), 'utf8'),
  ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function callback(name: string, env: Record<string, any>) {
  let expression: ts.Node | undefined;
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === name && node.initializer && ts.isCallExpression(node.initializer)) {
      expression = node.initializer.arguments[0];
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (!expression) throw new Error(`Missing production callback: ${name}`);
  const js = ts.transpileModule(`const selected = ${expression.getText(source)};`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
  }).outputText;
  return new Function(...Object.keys(env), `${js}; return selected;`)(...Object.values(env));
}
const player = 'player-one';
let timerCallbacks: Map<number, () => void>;
let counter: number;
beforeEach(() => {
  timerCallbacks = new Map(); counter = 0;
  (globalThis as any).window = {
    indexedDB: new IDBFactory(),
    setTimeout(fn: () => void) { timerCallbacks.set(++counter, fn); return counter; },
    clearTimeout(id: number) { timerCallbacks.delete(id); },
  };
});
afterEach(() => { delete (globalThis as any).window; });
const completion = () => ({
  resultId: crypto.randomUUID(), gameInstanceId: crypto.randomUUID(), playerId: player,
  clientCompletedAt: new Date().toISOString(), solution: 'SHRUB', guesses: ['SHRUB'],
  gameWasHardMode: false, type: 'INFINITE', wordPack: 'FIVE_LETTER',
});
function delivery(overrides: Record<string, any> = {}) {
  return callback('runPendingWordleResultSync', {
    user: { id: player }, isGameStateHydrated: false,
    resultSyncInProgressRef: { current: false },
    getPendingWordleResults, removeWordleResult,
    submitWordleResult(payload: any) { return {
      unwrap: async () => ({ data: { resultId: payload.resultId } }), abort() {},
    }; },
    ...overrides,
  });
}
async function within<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  try { return await Promise.race([promise, new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Delivery blocked')), 500);
  })]); } finally { clearTimeout(timer!); }
}
test('delivery before hydration retains journal for safe board recovery', async () => {
  const result = completion();
  await queueWordleResult(result);
  expect(await within(delivery()())).toBe(1);
  expect(await getPendingWordleResults(player)).toHaveLength(0);
  expect((await getWordleCompletions(player))[0].resultId).toBe(result.resultId);
  expect(timerCallbacks.size).toBe(0);
});
test('blocked checkpoint queue cannot delay result submission or clear its checkpoint', async () => {
  const result = completion(); await queueWordleResult(result);
  const checkpoint = { playerId: player, revision: 7, savedAt: new Date().toISOString(),
    gameState: { unfinished: true }, pendingRemoteSync: true };
  await saveWordleLocalCheckpoint(checkpoint);
  const pendingRef = { current: checkpoint.gameState };
  const recovery = callback('recoverPendingWordleCheckpoint', {
    user: { id: player }, isGameStateHydrated: true,
    checkpointRecoveryInProgressRef: { current: false },
    pendingReconciledStateRef: pendingRef,
    gameStateSaveQueueRef: { current: new Promise(() => {}) },
  });
  const run = delivery();
  const sync = callback('syncPendingWordleResults', {
    recoverPendingWordleCheckpoint: recovery,
    resultSyncQueueRef: { current: Promise.resolve(0) },
    runPendingWordleResultSync: run,
  });
  expect(await within(sync())).toBe(1);
  expect(await getWordleLocalCheckpoint(player)).toEqual(checkpoint);
  expect(pendingRef.current).toBe(checkpoint.gameState);
  expect(await getWordleCompletions(player)).toHaveLength(1);
});
test('hung recovery request cannot block delivery', async () => {
  await queueWordleResult(completion());
  let checkpointRequested = false;
  const recovery = callback('recoverPendingWordleCheckpoint', {
    user: { id: player }, isGameStateHydrated: true,
    checkpointRecoveryInProgressRef: { current: false },
    pendingReconciledStateRef: { current: { isLoading: false } },
    gameStateSaveQueueRef: { current: Promise.resolve() },
    serverStateRevisionRef: { current: 1 },
    updateRemoteState() { checkpointRequested = true; return { unwrap: () => new Promise(() => {}) }; },
  });
  const sync = callback('syncPendingWordleResults', {
    recoverPendingWordleCheckpoint: recovery,
    resultSyncQueueRef: { current: Promise.resolve(0) }, runPendingWordleResultSync: delivery(),
  });
  expect(await within(sync())).toBe(1);
  expect(checkpointRequested).toBe(true);
});
test('mismatched acknowledgement retains this and later results in order', async () => {
  await queueWordleResult(completion()); await queueWordleResult(completion());
  let attempts = 0;
  const run = delivery({ submitWordleResult() { attempts++; return {
    unwrap: async () => ({ data: { resultId: 'wrong' } }), abort() {},
  }; } });
  expect(await run()).toBe(0);
  expect(attempts).toBe(1);
  expect(await getPendingWordleResults(player)).toHaveLength(2);
  expect(await getWordleCompletions(player)).toHaveLength(2);
});
test('request failure keeps durable results; next attempt succeeds once', async () => {
  await queueWordleResult(completion());
  const fail = delivery({ submitWordleResult() { return {
    unwrap: async () => { throw new Error('Offline'); }, abort() {},
  }; } });
  expect(await fail()).toBe(0);
  expect(await getPendingWordleResults(player)).toHaveLength(1);
  expect(await delivery()()).toBe(1);
  expect(await getPendingWordleResults(player)).toHaveLength(0);
});
test('older outbox entries are journaled atomically before acknowledgement deletes them', async () => {
  const result = { ...completion(), queuedAt: new Date().toISOString() };
  // Version 1 fixture: only the outbox, no journal or checkpoint store.
  await new Promise<void>((resolve, reject) => {
    const req = window.indexedDB.open('wordrama-result-outbox', 1);
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore('results', { keyPath: 'resultId' });
      store.createIndex('playerId', 'playerId', { unique: false });
      store.put(result);
    };
    req.onerror = () => reject(req.error);
    req.onsuccess = () => { req.result.close(); resolve(); };
  });
  expect(await within(delivery()())).toBe(1);
  expect(await getPendingWordleResults(player)).toHaveLength(0);
  expect(await getWordleCompletions(player)).toEqual([result]);
});
test('watchdog runs while visible and is removed on cleanup', async () => {
  const effects: ts.Node[] = [];
  function visit(n: ts.Node) {
    if (ts.isCallExpression(n) && n.expression.getText(source) === 'useEffect' &&
      n.arguments[0]?.getText(source).includes('const watchdog =')) effects.push(n.arguments[0]);
    ts.forEachChild(n, visit);
  }
  visit(source);
  expect(effects).toHaveLength(1);
  const js = ts.transpileModule(`const selected = ${effects[0].getText(source)};`, {}).outputText;
  let interval: (() => void) | undefined;
  let delay: number | undefined;
  let cleared = false;
  let syncs = 0;
  const doc = { visibilityState: 'visible', addEventListener() {}, removeEventListener() {} };
  const win = { setInterval(fn: () => void, ms: number) { interval = fn; delay = ms; return 1; },
    clearInterval(id: number) { cleared = id === 1; }, addEventListener() {}, removeEventListener() {} };
  const effect = new Function('user','navigator','document','window','syncPendingWordleResultsAndRefresh','hiddenAtRef',
    `${js}; return selected;`)({id: player}, { onLine: true }, doc, win, async () => {syncs++;}, {current: null});
  const cleanup = effect();
  await Promise.resolve();
  expect(delay).toBe(30_000);
  interval!(); await Promise.resolve(); expect(syncs).toBe(2);
  doc.visibilityState = 'hidden'; interval!(); await Promise.resolve(); expect(syncs).toBe(2);
  cleanup(); expect(cleared).toBe(true);
});

test('acknowledged journal completion restores a stale board by game instance', async () => {
  const result = completion(); await queueWordleResult(result);
  await delivery()();
  const functions: string[] = [];
  function visit(n: ts.Node) {
    if (ts.isFunctionDeclaration(n) && ['guessesArePrefix', 'reconcileSavedStateWithPendingResults'].includes(n.name?.text ?? '')) {
      functions.push(n.getText(source));
    }
    ts.forEachChild(n, visit);
  }
  visit(source);
  const js = ts.transpileModule(functions.join('\n'), {}).outputText;
  const reconcile = new Function('MAX_CHALLENGES', `${js}; return reconcileSavedStateWithPendingResults;`)(6);
  const board = { gameMode: result.type, wordPack: result.wordPack, modes: {
    [result.type]: { [result.wordPack]: { solution: result.solution, guesses: [], gameInstanceId: result.gameInstanceId } },
  } };
  const restored = reconcile(board, await getWordleCompletions(player));
  expect(restored.modes[result.type][result.wordPack].isGameWon).toBe(true);
  expect(restored.modes[result.type][result.wordPack].resultSave).toBe(false);
  const otherGame = structuredClone(board);
  otherGame.modes[result.type][result.wordPack].gameInstanceId = crypto.randomUUID();
  expect(reconcile(otherGame, await getWordleCompletions(player))).toBe(otherGame);
});

test('separate recovery still saves with revision checks and acknowledges its checkpoint', async () => {
  const checkpoint = { playerId: player, revision: 7, savedAt: new Date().toISOString(),
    gameState: { isLoading: false, gameMode: 'INFINITE' }, pendingRemoteSync: true };
  await saveWordleLocalCheckpoint(checkpoint);
  const pending = { current: checkpoint.gameState };
  const revision = { current: 4 };
  const pendingRevision = { current: 7 };
  const { acknowledgeWordleLocalCheckpoint } = await import('../../wordrama-v2-main/wordrama-v2-main/src/lib/wordleResultOutbox');
  const recover = callback('recoverPendingWordleCheckpoint', {
    user: { id: player }, isGameStateHydrated: true,
    checkpointRecoveryInProgressRef: { current: false }, pendingReconciledStateRef: pending,
    gameStateSaveQueueRef: { current: Promise.resolve() }, serverStateRevisionRef: revision,
    pendingCheckpointRevisionRef: pendingRevision, acknowledgeWordleLocalCheckpoint,
    updateRemoteState(payload: any) {
      expect(payload.expectedRevision).toBe(4);
      expect(payload.gameState).toEqual({ gameMode: 'INFINITE' });
      return { unwrap: async () => ({ metadata: { stateRevision: 5 } }) };
    },
  });
  await recover();
  expect(revision.current).toBe(5);
  expect(pending.current).toBeNull();
  expect((await getWordleLocalCheckpoint(player))?.pendingRemoteSync).toBe(false);
});
