import { randomUUID } from 'node:crypto';

type State = Record<string, any>;
const object = (value: any): value is State =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const complete = (game: any) => game?.isGameWon === true || game?.isGameLost === true;
const prefix = (a: string[], b: string[]) =>
  a.length <= b.length && a.every((guess, index) => guess === b[index]);
const key = (value: any) => typeof value === 'string' && /^[A-Z][A-Z0-9_]*$/.test(value);

export function isLegacyWordleState(value: any): value is State {
  if (!object(value) || !['DAILY', 'INFINITE', 'CUSTOM'].includes(value.gameMode) || !key(value.wordPack)) return false;
  const game = value.gameMode === 'CUSTOM' ? value.custom : value.modes?.[value.gameMode]?.[value.wordPack];
  return object(game) && typeof game.solution === 'string' &&
    Array.isArray(game.guesses) && game.guesses.length <= 6 &&
    game.guesses.every((guess: any) => typeof guess === 'string') &&
    typeof game.isGameWon === 'boolean' && typeof game.isGameLost === 'boolean' &&
    game.isGameWon === game.guesses.includes(game.solution) &&
    game.isGameLost === (!game.isGameWon && game.guesses.length === 6);
}

/** Old clients submit whole snapshots without a revision. Merge ONLY their
 * active board into the current snapshot; never trust their inactive boards.
 * The caller must CAS this result and recompute it if the revision changes.
 */
export function mergeLegacyWordleState(incoming: State, current: State): State | null {
  const mode = incoming.gameMode;
  const pack = incoming.wordPack;
  const proposed = mode === 'CUSTOM' ? incoming.custom : incoming.modes[mode][pack];
  const stored = mode === 'CUSTOM' ? current.custom : current.modes?.[mode]?.[pack];
  let board: State;

  if (!stored?.solution) {
    // A stale legacy snapshot must not populate a slot with a forged modern ID.
    if (proposed.gameInstanceId) return null;
    board = { ...proposed };
    delete board._legacyResultId;
    delete board._legacyParentInstanceId;
    delete board._legacySeenSolutions;
  } else {
    if (!Array.isArray(stored.guesses)) return null;
    // Revisionless writes cannot replace an identified modern game. A legacy
    // tab that hydrated that exact ID can extend it or start a clean successor.
    if (stored.gameInstanceId && proposed.gameInstanceId !== stored.gameInstanceId) return null;
    if (!stored.gameInstanceId && proposed.gameInstanceId &&
        proposed.gameInstanceId !== stored._legacyParentInstanceId) return null;
    const sameBoard = proposed.solution === stored.solution &&
      (mode !== 'CUSTOM' || proposed.joinCode === stored.joinCode);
    if (sameBoard) {
      // Empty same-word resets cannot be distinguished from an old snapshot.
      if (complete(stored) && !complete(proposed) && proposed.guesses.length === 0) return null;
      if (prefix(proposed.guesses, stored.guesses)) {
        // Ignore a stale/identical board, including replay of resultSave=true
        // after the server has already consumed that completion.
        board = { ...stored };
      } else if (!complete(stored) && prefix(stored.guesses, proposed.guesses)) {
        board = { ...proposed };
        delete board._legacyResultId;
        delete board._legacyParentInstanceId;
        delete board._legacySeenSolutions;
        if (stored._legacySeenSolutions) board._legacySeenSolutions = stored._legacySeenSolutions;
        if (stored._legacyParentInstanceId) board._legacyParentInstanceId = stored._legacyParentInstanceId;
        if (stored._legacyResultId) board._legacyResultId = stored._legacyResultId;
        if (stored.gameInstanceId) board.gameInstanceId = stored.gameInstanceId;
        else delete board.gameInstanceId;
      } else return null;
    } else {
      // Permit only an observed clean next-game transition from a completed
      // board. If a legacy tab hydrated a modern ID it will reuse that ID:
      // remember the alias internally instead of treating it as a new modern ID.
      if (!complete(stored) || stored.resultSave ||
          proposed.guesses.length !== 0 || complete(proposed)) return null;
      const seen: string[] = stored._legacySeenSolutions ?? [];
      // A delayed empty snapshot of an earlier legacy game is not Play Again.
      // Keep bounded server-owned history; ambiguous repeats require refresh.
      if (seen.includes(proposed.solution) || seen.length >= 256) return null;
      board = { ...proposed };
      board._legacySeenSolutions = [...seen, stored.solution];
      delete board._legacyResultId;
      delete board.gameInstanceId;
      delete board._legacyParentInstanceId;
      const parentId = stored.gameInstanceId ?? stored._legacyParentInstanceId;
      if (parentId) board._legacyParentInstanceId = parentId;
    }
  }

  if (complete(board) && board.resultSave && !board.gameInstanceId && !board._legacyResultId) {
    // Persist before attempting results. Retries of very old state-only clients
    // must reuse this UUID even after a result insert/processing failure.
    board._legacyResultId = randomUUID();
  }

  // Bootstrap only when no server snapshot exists. Thereafter, preserve all
  // server-owned inactive boards and settings instead of replaying old copies.
  const base = Object.keys(current).length ? current : incoming;
  return mode === 'CUSTOM'
    ? { ...base, gameMode: mode, wordPack: pack, wordLength: incoming.wordLength, custom: board }
    : { ...base, gameMode: mode, wordPack: pack, wordLength: incoming.wordLength,
        modes: { ...base.modes, [mode]: { ...base.modes?.[mode], [pack]: board } } };
}
