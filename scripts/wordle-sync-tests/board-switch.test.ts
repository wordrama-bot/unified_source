import { expect, test } from 'bun:test';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.env.WORDLE_SOURCE_ROOT || resolve(import.meta.dir, '../..');
const src = `${root}/wordrama-v2-main/wordrama-v2-main/src`;
const { default: reduce } = await import(`${src}/redux/wordle/reducers.ts`);
const { setGameState, setWordPack } = await import(`${src}/redux/wordle/actions.ts`);
const source = ts.createSourceFile('App.tsx', readFileSync(`${src}/components/wordle/App.tsx`, 'utf8'),
  ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function functions(names: string[], env: Record<string, any>) {
  const declarations: string[] = [];
  function visit(n: ts.Node) {
    if (ts.isFunctionDeclaration(n) && names.includes(n.name?.text ?? '')) declarations.push(n.getText(source));
    ts.forEachChild(n, visit);
  }
  visit(source);
  const js = ts.transpileModule(declarations.join('\n'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return new Function(...Object.keys(env), `${js}; return {${names.join(',')}};`)(...Object.values(env));
}
const board = (id: string, solution = 'APPLE') => ({ gameInstanceId: id, solution,
  guesses: [], isGameWon: false, isGameLost: false, isGameInProgress: false, resultSave: false });
function state() {
  return { isLoading: false, gameMode: 'INFINITE', wordPack: 'FIVE_LETTER', wordLength: 5,
    custom: { ...board('custom'), joinCode: '', hint: '' },
    modes: { INFINITE: { FIVE_LETTER: board('five'), SIX_LETTER: board('six', 'ORANGE') },
      DAILY: { FIVE_LETTER: board('daily') } } };
}

test('completion committing after a pack switch updates its original board only', async () => {
  let current = state();
  let finish!: () => void;
  const pending = new Promise<void>(resolve => { finish = resolve; });
  const persist = { current: false };
  const { updateGameState } = functions(['updateGameState'], {
    gameMode: current.gameMode, wordPack: current.wordPack, currentGame: current.modes.INFINITE.FIVE_LETTER,
    shouldPersistGameStateRef: persist, setGameState,
    dispatch(action: any) { current = reduce(current, action); },
  });
  const completion = (async () => {
    await pending;
    updateGameState({ ...board('five'), guesses: ['APPLE'], isGameWon: true }, true);
  })();
  current = reduce(current, setWordPack('SIX_LETTER'));
  const six = current.modes.INFINITE.SIX_LETTER;
  finish(); await completion;
  expect(current.wordPack).toBe('SIX_LETTER');
  expect(current.modes.INFINITE.SIX_LETTER).toBe(six);
  expect(current.modes.INFINITE.FIVE_LETTER.isGameWon).toBe(true);
  expect(persist.current).toBe(true);
});

test('a delayed old-board callback cannot replace a newer instance, even with the same word', () => {
  let current = state();
  const old = current.modes.INFINITE.FIVE_LETTER;
  current = reduce(current, setGameState(board('new')));
  const next = reduce(current, setGameState({ ...old, isGameWon: true }, {
    gameMode: 'INFINITE', wordPack: 'FIVE_LETTER', gameInstanceId: old.gameInstanceId, solution: old.solution,
  }));
  expect(next).toBe(current);
});

test('delayed completion cannot overwrite a different game mode', () => {
  let current = state();
  current.gameMode = 'DAILY';
  const daily = current.modes.DAILY.FIVE_LETTER;
  current = reduce(current, setGameState({ ...board('five'), isGameWon: true }, {
    gameMode: 'INFINITE', wordPack: 'FIVE_LETTER', gameInstanceId: 'five', solution: 'APPLE',
  }));
  expect(current.modes.DAILY.FIVE_LETTER).toBe(daily);
  expect(current.modes.INFINITE.FIVE_LETTER.isGameWon).toBe(true);
});

const recover = () => functions(['guessesArePrefix', 'reconcileSavedStateWithPendingResults', 'reconcileAllWordleBoards'], {
  MAX_CHALLENGES: 6,
}).reconcileAllWordleBoards;
const result = (id: string, pack = 'FIVE_LETTER', solution = 'APPLE') => ({
  resultId: id, gameInstanceId: id, type: 'INFINITE', wordPack: pack, solution, guesses: [solution],
});
test('recovery marks completed inactive packs without changing selection or unfinished boards', () => {
  const original = state();
  original.wordPack = 'SIX_LETTER';
  const fixed = recover()(original, [result('five')]);
  expect(fixed.wordPack).toBe('SIX_LETTER');
  expect(fixed.modes.INFINITE.FIVE_LETTER.isGameWon).toBe(true);
  expect(fixed.modes.INFINITE.SIX_LETTER).toBe(original.modes.INFINITE.SIX_LETTER);
});
test('pending checkpoints recover exact completed instances and preserve newer unsent instances', () => {
  const original = state();
  original.modes.INFINITE.SIX_LETTER = board('new-six', 'ORANGE');
  const fixed = recover()(original, [result('five'), result('later-five'), result('old-six', 'SIX_LETTER', 'ORANGE')], false);
  expect(fixed.modes.INFINITE.FIVE_LETTER.gameInstanceId).toBe('five');
  expect(fixed.modes.INFINITE.FIVE_LETTER.isGameWon).toBe(true);
  expect(fixed.modes.INFINITE.SIX_LETTER).toBe(original.modes.INFINITE.SIX_LETTER);
});
test('identified journal entries never complete a different or unidentified board', () => {
  const original = state();
  delete (original.modes.INFINITE.FIVE_LETTER as any).gameInstanceId;
  expect(recover()(original, [result('five')], false)).toBe(original);
});
