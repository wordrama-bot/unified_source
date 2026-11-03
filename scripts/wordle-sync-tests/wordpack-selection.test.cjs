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
      if (kind === 'daily' ? text.includes('const newSolution: string = wordOfTheDay') : text.includes('const newSolution: string = getRandomWord(wordleWordPack')) selected = node.arguments[0];
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return evaluate(selected, env);
}
function run(kind, result, solution = '') {
  const writes = [];
  const pack = queryValue('useGetWordleWordPackQuery', result);
  const daily = queryValue('useGetWordleWoTDQuery', result);
  effect(kind, { gameLoading: false, gameMode: kind === 'daily' ? 'DAILY' : 'INFINITE', solution,
    wordleWordPack: pack, wordOfTheDay: daily, crypto: { randomUUID: () => 'instance' },
    getRandomWord: (words) => words[0], updateGameState: (state) => writes.push(state),
    setShowConfetti() {}, setIsStatsModalOpen() {}, setCurrentRowClass() {}, setCurrentGuess() {},
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
