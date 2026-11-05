const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const file = process.env.WORDLE_APP_SOURCE || path.join(__dirname, '../../wordrama-v2-main/wordrama-v2-main/src/components/wordle/App.tsx');
const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function evaluate(node, env) {
  const js = ts.transpileModule(`const selected = ${node.getText(source)};`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
  }).outputText;
  return new Function(...Object.keys(env), `${js}; return selected;`)(...Object.values(env));
}
function queryValue(hook, result) {
  let declaration;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(source) === hook) declaration = node;
    ts.forEachChild(node, visit);
  }
  visit(source);
  const js = ts.transpileModule(`const ${declaration.getText(source)};`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const binding = declaration.name.elements[0].name.getText(source);
  return new Function(hook, 'gameState', 'wordPack', `${js}; return ${binding};`)(() => result, { wordPack: 'SIX_LETTER' }, 'SIX_LETTER');
}
function effect(kind, env) {
  let selected;
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'useEffect') {
      const text = node.arguments[0].getText(source);
      if (kind === 'daily' ? text.includes('const newSolution: string = wordOfTheDay') : text.includes('const newSolution: string = getRandomWord(')) selected = node.arguments[0];
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return evaluate(selected, env);
}
function run(kind, result, solution = '', overrides = {}) {
  const writes = [];
  const pack = queryValue('useGetWordleWordPackQuery', result);
  const daily = queryValue('useGetWordleWoTDQuery', result);
  effect(kind, { gameLoading: false, gameMode: kind === 'daily' ? 'DAILY' : 'INFINITE', solution,
    wordPack: 'SIX_LETTER', guesses: [], isGameWon: false, isGameLost: false,
    wordleWordPackConfig: { solutionLengthByName: { SIX_LETTER: 6, NINE_LETTER: 9, TEN_LETTER: 10 } },
    wordleWordPack: pack, wordOfTheDay: daily, crypto: { randomUUID: () => 'instance' },
    getRandomWord: (words) => words[0], updateGameState: (state, persistRemote) => writes.push({ ...state, persistRemote }),
    setShowConfetti() {}, setIsStatsModalOpen() {}, setCurrentRowClass() {}, setCurrentGuess() {},
    ...overrides,
  })();
  return writes;
}
for (const kind of ['daily', 'infinite']) {
  test(`${kind}: ignore previous pack while selected pack is fetching`, () => {
    assert.deepEqual(run(kind, { data: { data: { wordList: ['APPLE'], todaysWord: 'APPLE' } }, currentData: undefined }), []);
  });
  test(`${kind}: create board from selected pack response`, () => {
    const writes = run(kind, { data: { data: { wordList: ['APPLE'], todaysWord: 'APPLE' } }, currentData: { data: { wordList: ['ORANGE'], todaysWord: 'ORANGE' } } });
    assert.equal(writes.length, 1);
    assert.equal(writes[0].solution, 'ORANGE');
  });
}
test('infinite: preserve existing board and game instance', () => {
  assert.deepEqual(run('infinite', { currentData: { data: { wordList: ['ORANGE'] } } }, 'BANANA'), []);
});

for (const [wordPack, solution, correct] of [
  ['NINE_LETTER', 'PENTAGON', 'BLUEBERRY'],
  ['TEN_LETTER', 'CHAIRLIFT', 'BLACKBOARD'],
]) {
  test(`infinite: repair untouched wrong-length saved ${wordPack} board and persist replacement`, () => {
    const writes = run('infinite', { currentData: { data: { wordList: [correct] } } }, solution, { wordPack });
    assert.equal(writes.length, 1);
    assert.equal(writes[0].solution, correct);
    assert.equal(writes[0].gameInstanceId, 'instance');
    assert.deepEqual(writes[0].guesses, []);
    assert.equal(writes[0].persistRemote, true);
  });
}
test('infinite: wait for selected pack before repairing wrong-length board', () => {
  assert.deepEqual(run('infinite', { data: { data: { wordList: ['ORANGE'] } } }, 'APPLE'), []);
});
test('infinite: completed wrong-length saved boards are preserved', () => {
  for (const overrides of [{ isGameWon: true }, { isGameLost: true }]) {
    assert.deepEqual(run('infinite', { currentData: { data: { wordList: ['ORANGE'] } } }, 'APPLE', overrides), []);
  }
});
test('infinite: reject wrong-length candidates for both new and repaired boards', () => {
  for (const solution of ['', 'APPLE']) {
    assert.deepEqual(run('infinite', { currentData: { data: { wordList: ['PEACH'] } } }, solution), []);
    const writes = run('infinite', { currentData: { data: { wordList: ['PEACH', 'ORANGE'] } } }, solution);
    assert.equal(writes[0].solution, 'ORANGE');
  }
});

test('infinite: repair mismatched unfinished boards regardless of guess count without recording a result', () => {
  for (const guesses of [['HOMETOWN'], ['HOMETOWN', 'SKELETON'], Array(6).fill('SKELETON')]) {
    const writes = run('infinite', { currentData: { data: { wordList: ['BLUEBERRY'] } } }, 'PENTAGON',
      { wordPack: 'NINE_LETTER', guesses });
    assert.equal(writes.length, 1);
    assert.equal(writes[0].solution.length, 9);
    assert.deepEqual(writes[0].guesses, []);
    assert.equal(writes[0].isGameLost, false);
    assert.equal(writes[0].isGameWon, false);
    assert.equal(writes[0].resultSave, false);
    assert.equal(writes[0].persistRemote, true);
  }
});
test('daily: refuse a wrong-length answer response', () => {
  assert.deepEqual(run('daily', { currentData: { data: { todaysWord: 'APPLE' } } }), []);
});
function callback(name, env) {
  let selected;
  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name?.text === name) selected = node;
    ts.forEachChild(node, visit);
  }
  visit(source);
  const js = ts.transpileModule(selected.getText(source), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  return new Function(...Object.keys(env), `${js}; return ${name};`)(...Object.values(env));
}
for (const name of ['onChar', 'onEnter', 'submitGuess']) {
  test(`${name}: ignore input while board length is invalid or game is loading`, async () => {
    for (const [gameLoading, isBoardLengthValid] of [[false, false], [true, true]]) {
      // No other dependencies supplied: touching verification, state or submission fails this test.
      await callback(name, { gameLoading, isBoardLengthValid })('A');
    }
  });
}
