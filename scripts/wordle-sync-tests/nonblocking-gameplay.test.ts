import { beforeEach, afterEach, expect, test } from 'bun:test';
import { IDBFactory } from 'fake-indexeddb';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import reduce from '../../wordrama-v2-main/wordrama-v2-main/src/redux/wordle/reducers';
import { setGameState } from '../../wordrama-v2-main/wordrama-v2-main/src/redux/wordle/actions';
import { queueWordleResult, getPendingWordleResults, getWordleCompletions, removeWordleResult } from '../../wordrama-v2-main/wordrama-v2-main/src/lib/wordleResultOutbox';
const source = ts.createSourceFile('App.tsx', readFileSync(new URL('../../wordrama-v2-main/wordrama-v2-main/src/components/wordle/App.tsx', import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function production(names: string[], env: Record<string, any>) {
  const declarations: string[] = [];
  function visit(n: ts.Node) {
    if (ts.isFunctionDeclaration(n) && names.includes(n.name?.text ?? '')) declarations.push(n.getText(source));
    if (ts.isVariableDeclaration(n) && names.includes(n.name.getText(source)) && n.initializer && ts.isCallExpression(n.initializer)) declarations.push(`const ${n.name.getText(source)} = ${n.initializer.arguments[0].getText(source)};`);
    ts.forEachChild(n, visit);
  }
  visit(source); const js = ts.transpileModule(declarations.join('\n'), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  return new Function(...Object.keys(env), `${js};return {${names.join(',')}};`)(...Object.values(env));
}
const never = new Promise(() => {});
const player = 'actor';
beforeEach(() => { (globalThis as any).window = { indexedDB: new IDBFactory(), setTimeout: () => 1, clearTimeout() {} }; });
afterEach(() => { delete (globalThis as any).window; });
async function responsive(promise: Promise<any>) {
  let timer: ReturnType<typeof setTimeout>;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Gameplay waited for network')), 5_000); })]); }
  finally { clearTimeout(timer!); }
}
function harness() {
  const board = () => ({ gameInstanceId: crypto.randomUUID(), solution: 'STEED', guesses: [], isGameWon: false, isGameLost: false, isGameInProgress: true, resultSave: false });
  let state: any = { isLoading: false, gameMode: 'INFINITE', wordPack: 'FIVE_LETTER', custom: {}, modes: { INFINITE: { FIVE_LETTER: board() } } };
  const input = { current: '' }, lock = { current: false }, finalizing = { current: false }, persist = { current: false };
  const active: any = { current: { playerId: player, gameMode: 'INFINITE', wordPack: 'FIVE_LETTER', board: state.modes.INFINITE.FIVE_LETTER } };
  const alerts: string[] = []; let backgroundCalls = 0; let revealFinishes = 0;
  let queue = queueWordleResult;
  function render() {
    const current = state.modes.INFINITE.FIVE_LETTER;
    const env = {
      gameLoading: false, isBoardLengthValid: true, isGameWon: current.isGameWon, isGameLost: current.isGameLost,
      isCustom: false, isDaily: false, isInfinite: true, isStatsModalOpen: false, isLoadingWordPack: false,
      currentGuessRef: input, guessSubmissionInProgressRef: lock, resultFinalizationInProgressRef: finalizing,
      activeBoardRef: active, currentGame: current, gameState: state, user: { id: player },
      solution: current.solution, guesses: current.guesses, gameMode: 'INFINITE', wordPack: 'FIVE_LETTER',
      MAX_CHALLENGES: 6, REVEAL_TIME_MS: 250, gameSoundEnabled: false, WIN_MESSAGES: ['Win'],
      NOT_ENOUGH_LETTERS_MESSAGE: 'short', WORD_NOT_FOUND_MESSAGE: 'invalid', CORRECT_WORD_MESSAGE: () => 'answer',
      unicodeLength: (text: string) => text.length, localeAwareUpperCase: (text: string) => text.toUpperCase(),
      isWinningWord: (a: string, b: string) => a === b, isWordInWordList: () => true,
      wordleWordPack: { data: { wordList: ['STEED'], validGuesses: ['stare', 'steed'] } },
      wordleWordPackConfig: { solutionLengthByName: { FIVE_LETTER: 5 } }, getRandomWord: () => 'STEED', crypto,
      setCurrentGuess: (guess: string) => { input.current = guess; }, setCurrentRowClass() {},
      setShowConfetti() {}, setIsStatsModalOpen() {}, setIsRevealing() {}, clearCurrentRowClass() {}, clearAlert() {},
      showErrorAlert: (message: string) => alerts.push(message), showSuccessAlert() {},
      shouldPersistGameStateRef: persist, setGameState,
      dispatch(action: any) { state = reduce(state, action); active.current.board = state.modes.INFINITE.FIVE_LETTER; },
      queueWordleResult: (result: any) => queue(result), revealTimerRef: { current: null }, finishReveal() { revealFinishes++; },
      setTimeout: () => 1, clearTimeout() {},
      // All network and checkpoint paths deliberately hang, including resume.
      verifyActiveWordleBoard: () => never, refreshCompletedWordleSession: () => never,
      gameStateSaveQueueRef: { current: never },
      syncPendingWordleResultsAndRefresh: () => { backgroundCalls++; return never; },
    };
    return production(['onChar', 'onEnter', 'submitGuess', 'newInfiniteGame', 'queueCompletedWordleGame', 'updateGameState'], env);
  }
  return { render, input, alerts, lock, finalizing, get board() { return state.modes.INFINITE.FIVE_LETTER; },
    get backgroundCalls() { return backgroundCalls; }, get revealFinishes() { return revealFinishes; }, failStorage() { queue = async () => { throw new Error('IndexedDB unavailable'); }; },
    next: async () => { await responsive(render().newInfiniteGame()); finalizing.current = false; },
  };
}

test('first and subsequent nonterminal guesses commit immediately with completion checks and checkpoints hung', async () => {
  const h = harness();
  for (const word of ['STARE', 'SLATE', 'CRANE']) {
    h.input.current = word; const pending = h.render().onEnter();
    // No network await even before the handler promise settles.
    expect(h.board.guesses.at(-1)).toBe(word); await responsive(pending);
  }
  expect(h.alerts).toEqual([]); expect(h.lock.current).toBe(false);
});
test('rapid characters then Enter use the complete input buffer on the first press', async () => {
  const h = harness(); const view = h.render();
  for (const letter of 'stare') view.onChar(letter);
  await responsive(view.onEnter()); expect(h.board.guesses).toEqual(['STARE']); expect(h.input.current).toBe('');
});
test('Play Again finishes the reveal immediately and starts a fresh instance despite hung background requests', async () => {
  const h = harness(); h.input.current = 'STEED'; await responsive(h.render().onEnter());
  const id = h.board.gameInstanceId; expect(h.board.isGameWon).toBe(true);
  await h.next(); expect(h.revealFinishes).toBe(1);
  expect(h.board.gameInstanceId).not.toBe(id); expect(h.board.guesses).toEqual([]);
  const nextView = h.render(); for (const letter of 'stare') nextView.onChar(letter);
  await responsive(nextView.onEnter()); expect(h.board.guesses).toEqual(['STARE']);
});
test('multiple offline wins and losses are durable, then drain in order after reconnect and a lost acknowledgement', async () => {
  const h = harness(); const outcomes = [true, true, false, true, false, true, true, true];
  for (const won of outcomes) {
    for (const word of won ? ['STARE', 'STEED'] : ['STARE', 'SLATE', 'CRANE', 'SHRUB', 'APPLE', 'PEARS']) {
      h.input.current = word; await responsive(h.render().onEnter());
    }
    expect(h.board.isGameWon).toBe(won); expect(h.board.isGameLost).toBe(!won);
    await h.next();
  }
  const pending = await getPendingWordleResults(player);
  expect(pending).toHaveLength(8); expect(new Set(pending.map(p => p.gameInstanceId)).size).toBe(8);
  expect(await getWordleCompletions(player)).toHaveLength(8);
  const committed = new Map<string, boolean>(); let loseAck = true;
  const delivery = production(['runPendingWordleResultSync'], {
    user: { id: player }, resultSyncInProgressRef: { current: false }, getPendingWordleResults, removeWordleResult,
    submitWordleResult(body: any) { return { abort() {}, unwrap: async () => {
      committed.set(body.resultId, body.guesses.includes(body.solution));
      if (committed.size === 3 && loseAck) { loseAck = false; throw new Error('response lost after commit'); }
      return { data: { resultId: body.resultId } };
    } }; },
  }).runPendingWordleResultSync;
  expect(await responsive(delivery())).toBe(2); expect(await getPendingWordleResults(player)).toHaveLength(6);
  expect(await responsive(delivery())).toBe(6); expect(await getPendingWordleResults(player)).toHaveLength(0);
  expect([...committed.values()]).toEqual(outcomes); expect(committed.size).toBe(8);
  expect(await getWordleCompletions(player)).toHaveLength(8);
  expect(h.backgroundCalls).toBeGreaterThan(0);
});
test('failed durable local storage does not acknowledge a win or clear the typed answer', async () => {
  const h = harness(); h.failStorage(); h.input.current = 'STEED';
  await responsive(h.render().onEnter()); expect(h.board.isGameWon).toBe(false); expect(h.board.guesses).toEqual([]);
  expect(h.input.current).toBe('STEED'); expect(h.alerts.at(-1)).toContain('could not be saved safely');
  expect(h.finalizing.current).toBe(false);
});
