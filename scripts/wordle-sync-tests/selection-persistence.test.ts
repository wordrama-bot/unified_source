import { expect, test } from 'bun:test';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import reduce from '../../wordrama-v2-main/wordrama-v2-main/src/redux/wordle/reducers';
import { setWordPack, setWordLength, setGameMode, setInitialState } from '../../wordrama-v2-main/wordrama-v2-main/src/redux/wordle/actions';

const file = process.env.WORDLE_APP_SOURCE || resolve(import.meta.dir,
  '../../wordrama-v2-main/wordrama-v2-main/src/components/wordle/App.tsx');
const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function extract(name: string, env: Record<string, any>) {
  let selected: ts.Node | undefined;
  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.name?.text === name) selected = node;
    if (name === 'persist' && ts.isCallExpression(node) && node.expression.getText(source) === 'useEffect' &&
      node.arguments[0].getText(source).includes('const revision = ++localCheckpointRevisionRef.current')) selected = node.arguments[0];
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (!selected) throw new Error(`Missing production callback ${name}`);
  const js = ts.transpileModule(name === 'persist' ? `const persist = ${selected.getText(source)}` : selected.getText(source),
    { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  return new Function(...Object.keys(env), `${js}; return ${name};`)(...Object.values(env));
}
const board = (id: string, solution: string, guesses: string[] = []) => ({
  gameInstanceId: id, solution, guesses, isGameWon: false, isGameLost: false,
  isGameInProgress: false, resultSave: false,
});
function harness() {
  let state: any = { isLoading: false, gameMode: 'INFINITE', wordPack: 'FIVE_LETTER', wordLength: 5,
    custom: { joinCode: '', hint: '', ...board('custom', '') }, modes: {
      INFINITE: { FIVE_LETTER: board('five', 'APPLE', ['STARE']), NINE_LETTER: board('nine', 'BLUEBERRY') },
      DAILY: { FIVE_LETTER: board('daily', 'PEACH') },
    } };
  const dirty = { current: false };
  const queue = { current: Promise.resolve() };
  const payloads: any[] = [], checkpoints: any[] = [];
  const common = {
    shouldPersistGameStateRef: dirty, gameStateSaveQueueRef: queue,
    user: { id: 'player' }, setShowConfetti() {}, setWordPack, setWordLength, setGameMode,
    dispatch(action: any) { state = reduce(state, action); },
    wordleWordPackConfig: { solutionLengthByName: { FIVE_LETTER: 5, NINE_LETTER: 9, SEVEN_LETTER: 7 } },
    localCheckpointRevisionRef: { current: 0 }, serverStateRevisionRef: { current: 10 },
    pendingCheckpointRevisionRef: { current: 0 }, pendingReconciledStateRef: { current: null },
    saveWordleLocalCheckpoint: async (checkpoint: any) => { checkpoints.push(checkpoint); },
    acknowledgeWordleLocalCheckpoint: async () => {},
    updateRemoteState: (payload: any) => { payloads.push(payload); return {
      unwrap: async () => ({ metadata: { stateRevision: payload.expectedRevision + 1 } }),
    }; },
    isWordleStateRevisionConflict: () => false,
  };
  return {
    select: (pack: string) => extract('handleWordPackChange', common)(pack),
    mode: (mode: string) => extract('enterGameMode', common)(mode),
    save: async (gameLoading = false) => {
      extract('persist', { ...common, gameLoading, gameState: state })();
      await queue.current;
    },
    state: () => state, dirty, payloads, checkpoints,
  };
}

test('switch to an unplayed pack persists without a guess and reload retains both boards', async () => {
  const h = harness(); const before = structuredClone(h.state());
  h.select('NINE_LETTER'); await h.save();
  expect(h.payloads).toHaveLength(1);
  const saved = h.payloads[0].gameState;
  expect(saved.wordPack).toBe('NINE_LETTER'); expect(saved.wordLength).toBe(9);
  expect(saved.modes).toEqual(before.modes);
  expect(h.checkpoints[0].gameState).toEqual(saved);
  const reloaded = reduce(undefined, setInitialState(saved));
  expect(reloaded.wordPack).toBe('NINE_LETTER');
  expect(reloaded.modes.INFINITE.FIVE_LETTER.guesses).toEqual(['STARE']);
  expect(reloaded.modes.INFINITE.NINE_LETTER.guesses).toEqual([]);
});
test('selection remains pending while loading and saves once loading finishes', async () => {
  const h = harness(); h.select('NINE_LETTER'); await h.save(true);
  expect(h.payloads).toHaveLength(0); expect(h.dirty.current).toBe(true);
  await h.save(); expect(h.payloads).toHaveLength(1); expect(h.dirty.current).toBe(false);
});
test('game mode switches also persist without a guess', async () => {
  const h = harness(); const before = structuredClone(h.state().modes);
  h.mode('daily'); await h.save();
  expect(h.payloads).toHaveLength(1);
  expect(h.payloads[0].gameState.gameMode).toBe('DAILY');
  expect(h.payloads[0].gameState.modes).toEqual(before);
});
test('switching back retains original guesses and serializes revisions', async () => {
  const h = harness(); h.select('NINE_LETTER'); await h.save();
  h.select('FIVE_LETTER'); await h.save();
  expect(h.payloads.map(p => p.expectedRevision)).toEqual([10,11]);
  expect(h.payloads[1].gameState.modes.INFINITE.FIVE_LETTER.guesses).toEqual(['STARE']);
});
