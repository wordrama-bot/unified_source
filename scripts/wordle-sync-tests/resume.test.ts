import { expect, test } from 'bun:test';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { checkWordleBoardCompletion } from '../../wordrama-v2-main/wordrama-v2-main/src/lib/wordleBoardCompletion';
import reduce from '../../wordrama-v2-main/wordrama-v2-main/src/redux/wordle/reducers';
import { setGameState, setInitialState } from '../../wordrama-v2-main/wordrama-v2-main/src/redux/wordle/actions';

// Execute the production callback with controlled network, time and Redux.
const source = ts.createSourceFile('App.tsx', readFileSync(process.env.WORDLE_RESUME_APP_SOURCE || new URL(
  '../../wordrama-v2-main/wordrama-v2-main/src/components/wordle/App.tsx', import.meta.url), 'utf8'),
  ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function extract(name: string, env: Record<string, any>) {
  let expression = '';
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === name &&
        node.initializer && ts.isCallExpression(node.initializer)) expression = node.initializer.arguments[0].getText(source);
    if (ts.isFunctionDeclaration(node) && node.name?.text === name) expression = node.getText(source);
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (!expression) throw new Error(`Missing callback ${name}`);
  const js = ts.transpileModule(`const selected = ${expression};`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return new Function(...Object.keys(env), `${js}; return selected;`)(...Object.values(env));
}

function sessionHarness() {
  const finished = (id: string) => ({ ...board(id), guesses: ['STARE', 'STEED'], isGameWon: true });
  const local = { isLoading: false, gameMode: 'INFINITE', wordPack: 'FIVE_LETTER', wordLength: 5,
    modes: { INFINITE: { FIVE_LETTER: finished('first'), NINE_LETTER: board('nine') } } };
  let remote: any = structuredClone(local);
  remote.wordPack = 'NINE_LETTER'; remote.wordLength = 9;
  remote.modes.INFINITE.FIVE_LETTER = finished('third');
  const live = { current: local as any }, active = { current: { playerId: 'actor',
    gameMode: 'INFINITE', wordPack: 'FIVE_LETTER', board: local.modes.INFINITE.FIVE_LETTER } };
  const revision = { current: 10 }, pending = { current: null as any }, dirty = { current: false };
  let pendingDisk = false, requests = 0, release: (() => Promise<void>) | undefined;
  const env = { user: { id: 'actor' }, isGameStateHydrated: true, navigator: { onLine: true },
    liveGameStateRef: live, activeBoardRef: active, gameStateSaveQueueRef: { current: Promise.resolve() },
    shouldPersistGameStateRef: dirty, pendingReconciledStateRef: pending, serverStateRevisionRef: revision,
    getWordleLocalCheckpoint: async () => ({ pendingRemoteSync: pendingDisk }),
    refetchSavedState() { requests++; return { abort() {}, unwrap: async () => {
      if (release) await release(); return { data: remote, metadata: { stateRevision: 30 } };
    } }; },
    window: { setTimeout() { return 1; }, clearTimeout() {} },
    getWordleCompletions: async () => [], reconcileAllWordleBoards: (state: any) => state,
    mergeCompletedWordleSession: extract('mergeCompletedWordleSession', {}), setInitialState,
    dispatch(action: any) { live.current = reduce(live.current, action);
      active.current = { ...active.current, board: live.current.modes.INFINITE.FIVE_LETTER }; },
  };
  return { env, live, active, revision, pending, dirty, local,
    run: extract('refreshCompletedWordleSession', env), get requests() { return requests; },
    setRemote(state: any) { remote = state; }, get remote() { return remote; },
    diskPending() { pendingDisk = true; }, delay(fn: () => Promise<void>) { release = fn; } };
}
test('finished first tab catches up to later games and revision while preserving selected pack', async () => {
  const h = sessionHarness(); await h.run();
  expect(h.live.current.modes.INFINITE.FIVE_LETTER.gameInstanceId).toBe('third');
  expect(h.live.current.wordPack).toBe('FIVE_LETTER'); expect(h.live.current.wordLength).toBe(5);
  expect(h.revision.current).toBe(30);
});
test('session refresh cannot replace unfinished or unsent local progress', async () => {
  for (const condition of ['unfinished', 'memory', 'disk', 'dirty']) {
    const h = sessionHarness();
    if (condition === 'unfinished') h.local.modes.INFINITE.FIVE_LETTER.isGameWon = false;
    if (condition === 'memory') h.pending.current = { unsent: true };
    if (condition === 'disk') h.diskPending();
    if (condition === 'dirty') h.dirty.current = true;
    expect(await h.run()).toBeNull(); expect(h.requests).toBe(0); expect(h.revision.current).toBe(10);
  }
});
test('remote checkpoint cannot reopen its already finished exact instance', async () => {
  const h = sessionHarness(); h.remote.modes.INFINITE.FIVE_LETTER = board('first');
  await h.run(); expect(h.live.current.modes.INFINITE.FIVE_LETTER.isGameWon).toBe(true);
});
test('progress or account changes during catch-up cancel the stale response', async () => {
  for (const change of ['board', 'account', 'queued-write']) {
    const h = sessionHarness(); let finish!: () => void;
    h.delay(() => new Promise(resolve => { finish = resolve; }));
    const request = h.run(); await new Promise(resolve => setTimeout(resolve, 0));
    if (change === 'board') h.live.current = { ...h.live.current, wordPack: 'NINE_LETTER' };
    if (change === 'account') h.active.current = { ...h.active.current, playerId: 'other' };
    if (change === 'queued-write') h.env.gameStateSaveQueueRef.current = Promise.resolve();
    finish(); expect(await request).toBeNull(); expect(h.revision.current).toBe(10);
  }
});
test('Play Again uses the latest shared board target and creates a fresh instance', async () => {
  const h = sessionHarness(); let refreshes = 0;
  const next = extract('newInfiniteGame', { ...h.env, isLoadingWordPack: false,
    wordleWordPackConfig: { solutionLengthByName: { FIVE_LETTER: 5 } },
    wordleWordPack: { data: { wordList: ['APPLE'] } },
    syncPendingWordleResultsAndRefresh: async (force: boolean) => { expect(force).toBe(true); refreshes++; },
    refreshCompletedWordleSession: h.run, getRandomWord: () => 'APPLE',
    crypto: { randomUUID: () => 'fresh' }, setGameState,
    setShowConfetti() {}, setIsStatsModalOpen() {}, setCurrentRowClass() {}, setCurrentGuess() {},
  });
  await next(); expect(refreshes).toBe(1);
  expect(h.live.current.modes.INFINITE.FIVE_LETTER.gameInstanceId).toBe('fresh');
  expect(h.live.current.modes.INFINITE.FIVE_LETTER.guesses).toEqual([]);
  expect(h.dirty.current).toBe(true);
});
test('Play Again resumes a newer unfinished shared puzzle without replacing guesses', async () => {
  const h = sessionHarness(); h.remote.modes.INFINITE.FIVE_LETTER = board('next-in-progress');
  const next = extract('newInfiniteGame', { ...h.env, isLoadingWordPack: false,
    wordleWordPackConfig: { solutionLengthByName: { FIVE_LETTER: 5 } },
    wordleWordPack: { data: { wordList: ['APPLE'] } },
    syncPendingWordleResultsAndRefresh: async () => {}, refreshCompletedWordleSession: h.run,
    setShowConfetti() {}, setIsStatsModalOpen() {}, setCurrentRowClass() {}, setCurrentGuess() {},
  });
  await next(); expect(h.live.current.modes.INFINITE.FIVE_LETTER.gameInstanceId).toBe('next-in-progress');
  expect(h.live.current.modes.INFINITE.FIVE_LETTER.guesses).toEqual(['STARE']);
  expect(h.dirty.current).toBe(false);
});
test('explicit foreground refresh reloads history and stats even after syncing a result', async () => {
  const calls: string[] = [];
  const run = extract('syncPendingWordleResultsAndRefresh', { user: { id: 'actor' }, gameMode: 'INFINITE',
    syncPendingWordleResults: async () => 1, getPendingWordleResults: async () => [],
    schedulePendingWordleResultRetry() {}, clearPendingWordleResultRetry() {},
    refetchStats() { calls.push('stats'); }, refetchLast30() { calls.push('history'); },
    refetchStreak() { calls.push('streak'); }, refetchProfile() { calls.push('profile'); },
  });
  await run(true); expect(calls).toEqual(['stats', 'history', 'streak', 'profile']);
});
const board = (id = 'old') => ({ gameInstanceId: id, solution: 'STEED', guesses: ['STARE'],
  isGameWon: false, isGameLost: false, isGameInProgress: true, resultSave: false });
const result = (id = 'old') => ({ gameInstanceId: id, solution: 'STEED', guesses: ['STARE', 'STEED'],
  type: 'INFINITE', wordPack: 'FIVE_LETTER' });
function harness() {
  let state: any = { isLoading: false, gameMode: 'INFINITE', wordPack: 'FIVE_LETTER',
    modes: { INFINITE: { FIVE_LETTER: board() } } };
  const active = { current: { playerId: 'actor', gameMode: 'INFINITE', wordPack: 'FIVE_LETTER', board: state.modes.INFINITE.FIVE_LETTER } };
  const epoch = { current: 0 };
  const last = { current: null as any };
  let calls = 0, aborts = 0, clearedGuess = false;
  let journal: any[] = [];
  let online = true;
  let server: () => Promise<any> = async () => result();
  let timeout: () => void = () => {};
  const env = {
    activeBoardRef: active, boardCheckEpochRef: epoch, lastBoardCheckRef: last,
    pendingBoardCheckRef: { current: null }, checkWordleBoardCompletion,
    getWordleCompletions: async () => journal,
    getCompletedInstance(id: string, cached: boolean) {
      expect(id).toBe('old'); expect(cached).toBe(false); calls++;
      return { unwrap: async () => ({ data: await server() }), abort() { aborts++; } };
    },
    navigator: { get onLine() { return online; } },
    window: { setTimeout(fn: () => void) { timeout = fn; return 1; }, clearTimeout() {} },
    dispatch(action: any) { state = reduce(state, action); }, setGameState,
    setCurrentGuess(value: string) { expect(value).toBe(''); clearedGuess = true; },
  };
  return { env, active, epoch, last, run: extract('verifyActiveWordleBoard', env),
    get state() { return state; }, get calls() { return calls; }, get aborts() { return aborts; },
    get clearedGuess() { return clearedGuess; }, expire() { last.current.at -= 30_001; },
    setServer(fn: () => Promise<any>) { server = fn; }, setJournal(rows: any[]) { journal = rows; },
    offline() { online = false; }, timeout() { timeout(); } };
}
test('idle live tab retires an exact game completed on another origin', async () => {
  const h = harness();
  expect(await h.run()).toBe('completed');
  expect(h.state.modes.INFINITE.FIVE_LETTER.isGameWon).toBe(true);
  expect(h.state.modes.INFINITE.FIVE_LETTER.guesses).toEqual(['STARE', 'STEED']);
  expect(h.clearedGuess).toBe(true);
});
test('foreground invalidates a previously unplayed check', async () => {
  const h = harness(); h.setServer(async () => null);
  expect(await h.run()).toBe('ready');
  expect(await h.run()).toBe('ready'); expect(h.calls).toBe(1);
  h.setServer(async () => result()); h.epoch.current++;
  expect(await h.run()).toBe('completed'); expect(h.calls).toBe(2);
});
test('idle timeout rechecks even without visibility or focus events', async () => {
  const h = harness(); h.setServer(async () => null);
  await h.run(); h.expire(); h.setServer(async () => result());
  expect(await h.run()).toBe('completed');
});
test('local journal catches completed games while offline without a network call', async () => {
  const h = harness(); h.offline(); h.setJournal([result()]);
  expect(await h.run()).toBe('completed'); expect(h.calls).toBe(0);
});
test('offline unfinished boards remain playable and are checked after reconnect', async () => {
  const h = harness(); h.offline();
  expect(await h.run()).toBe('ready'); expect(h.calls).toBe(0); expect(h.last.current).toBeNull();
});
test('same word in a different completed instance does not retire a new game', async () => {
  const h = harness(); h.setJournal([result('different')]); h.setServer(async () => null);
  expect(await h.run()).toBe('ready');
  expect(h.state.modes.INFINITE.FIVE_LETTER.isGameWon).toBe(false);
});
test('a delayed response cannot change a new puzzle or another selected pack', async () => {
  for (const change of ['instance', 'pack', 'player']) {
    const h = harness(); let finish!: (value: any) => void;
    h.setServer(() => new Promise(resolve => { finish = resolve; }));
    const pending = h.run(); await new Promise(resolve => setTimeout(resolve, 0));
    if (change === 'instance') h.active.current = { ...h.active.current, board: board('new') };
    if (change === 'pack') h.active.current = { ...h.active.current, wordPack: 'NINE_LETTER' };
    if (change === 'player') h.active.current = { ...h.active.current, playerId: 'other' };
    finish(result()); expect(await pending).toBe('retry');
    expect(h.state.modes.INFINITE.FIVE_LETTER.isGameWon).toBe(false);
  }
});
test('lookup failure or malformed data never certifies an unplayed board', async () => {
  const h = harness(); h.setServer(async () => { throw new Error('timeout'); });
  expect(await h.run()).toBe('retry'); expect(h.last.current).toBeNull();
  h.setServer(async () => result('wrong-instance'));
  expect(await h.run()).toBe('retry'); expect(h.last.current).toBeNull();
});
test('concurrent resume and Enter share one verification request', async () => {
  const h = harness(); let finish!: (value: any) => void;
  h.setServer(() => new Promise(resolve => { finish = resolve; }));
  const first = h.run(), second = h.run();
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(h.calls).toBe(1); h.timeout(); expect(h.aborts).toBe(1);
  finish(null); expect(await first).toBe('ready'); expect(await second).toBe('ready');
});
test('Enter never submits a guess when verification retires the board', async () => {
  const h = harness(); let submitted = 0;
  const alerts: string[] = [];
  const enter = extract('onEnter', { gameLoading: false, isBoardLengthValid: true, activeBoardRef: h.active,
    currentGuessRef: { current: 'STEED' },
    guessSubmissionInProgressRef: { current: false }, verifyActiveWordleBoard: h.run,
    submitGuess() { submitted++; }, showErrorAlert(message: string) { alerts.push(message); } });
  await enter(); expect(submitted).toBe(0); expect(alerts[0]).toContain('already completed');
});
test('editing a guess during verification cannot submit the old text', async () => {
  const h = harness(); let finish!: (status: string) => void;
  let submitted = 0;
  const guess = { current: 'STARE' };
  const enter = extract('onEnter', { gameLoading: false, isBoardLengthValid: true, activeBoardRef: h.active, currentGuessRef: guess,
    guessSubmissionInProgressRef: { current: false },
    verifyActiveWordleBoard: () => new Promise(resolve => { finish = resolve; }),
    submitGuess() { submitted++; }, showErrorAlert() {} });
  const pending = enter(); guess.current = 'STEED'; finish('ready');
  await pending; expect(submitted).toBe(0);
});
