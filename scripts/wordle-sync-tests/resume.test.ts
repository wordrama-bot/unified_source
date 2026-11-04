import { expect, test } from 'bun:test';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { checkWordleBoardCompletion } from '../../wordrama-v2-main/wordrama-v2-main/src/lib/wordleBoardCompletion';
import reduce from '../../wordrama-v2-main/wordrama-v2-main/src/redux/wordle/reducers';
import { setGameState } from '../../wordrama-v2-main/wordrama-v2-main/src/redux/wordle/actions';

// Execute the production callback with controlled network, time and Redux.
const source = ts.createSourceFile('App.tsx', readFileSync(new URL(
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
  const enter = extract('onEnter', { activeBoardRef: h.active,
    currentGuessRef: { current: 'STEED' },
    guessSubmissionInProgressRef: { current: false }, verifyActiveWordleBoard: h.run,
    submitGuess() { submitted++; }, showErrorAlert(message: string) { alerts.push(message); } });
  await enter(); expect(submitted).toBe(0); expect(alerts[0]).toContain('already completed');
});
test('editing a guess during verification cannot submit the old text', async () => {
  const h = harness(); let finish!: (status: string) => void;
  let submitted = 0;
  const guess = { current: 'STARE' };
  const enter = extract('onEnter', { activeBoardRef: h.active, currentGuessRef: guess,
    guessSubmissionInProgressRef: { current: false },
    verifyActiveWordleBoard: () => new Promise(resolve => { finish = resolve; }),
    submitGuess() { submitted++; }, showErrorAlert() {} });
  const pending = enter(); guess.current = 'STEED'; finish('ready');
  await pending; expect(submitted).toBe(0);
});
