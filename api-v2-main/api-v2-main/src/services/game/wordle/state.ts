import { db } from '../../../models';
import gameService from './';
import { isLegacyWordleState, mergeLegacyWordleState } from './legacy-state';

async function getGameState(
  userId: string,
  recoverPending = true,
): Promise<{ gameState: any; revision: number } | null> {
  const { data, error } = await db
    .from('_wordle_saved_state')
    .select('game_state, state_revision')
    .eq('player', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  const snapshot = {
    gameState: data?.game_state ?? {},
    revision: data?.state_revision ?? 0,
  };
  const state = snapshot.gameState;
  const game = state.gameMode === 'CUSTOM'
    ? state.custom : state.modes?.[state.gameMode]?.[state.wordPack];
  if (recoverPending && game?.resultSave && (game._legacyResultId || game.gameInstanceId) &&
      (game.isGameWon || game.isGameLost)) {
    // State-only clients have no outbox. A later read/save retries the durable
    // pending completion before it can be replaced by another game.
    const recovered = await updateGameState(userId, {
      gameState: state, expectedRevision: snapshot.revision,
    });
    if (recovered.status === 'saved' || recovered.status === 'conflict') {
      return { gameState: recovered.gameState, revision: recovered.revision };
    }
    // The checkpoint may have advanced before result processing failed.
    // Return its actual revision without recursively retrying the completion.
    return getGameState(userId, false);
  }
  return snapshot;
}

type WordleStateSaveResult =
  | { status: 'saved'; gameState: any; revision: number }
  | { status: 'conflict'; gameState: any; revision: number }
  | { status: 'invalid' }
  | { status: 'error' };

async function updateGameState(
  userId: string,
  input: any,
): Promise<WordleStateSaveResult> {
  // An explicit envelope must be validated as an envelope. Never interpret a
  // malformed modern request as a legacy snapshot and bypass its revision.
  const isEnvelope = input && typeof input === 'object' &&
    ('gameState' in input || 'expectedRevision' in input);
  const legacy = !isEnvelope;
  let gameState = input?.gameState;
  let expectedRevision = input?.expectedRevision;

  if (legacy) {
    if (!isLegacyWordleState(input)) return { status: 'invalid' };
    const current = await getGameState(userId);
    if (!current) return { status: 'error' };
    const merged = mergeLegacyWordleState(input, current.gameState);
    if (!merged) return { status: 'conflict', ...current };
    gameState = merged;
    expectedRevision = current.revision;
  }

  if (
    !Number.isSafeInteger(expectedRevision) ||
    expectedRevision < 0 ||
    !gameState ||
    typeof gameState !== 'object' ||
    Array.isArray(gameState)
  ) {
    return { status: 'invalid' };
  }

  async function saveAtRevision(
    state: any,
    revision: number,
  ): Promise<WordleStateSaveResult> {
    const { data, error } = await db.rpc(
      'wordrama_save_wordle_state',
      {
        p_player: userId,
        p_game_state: state,
        p_expected_revision: revision,
      },
    );

    if (error) {
      console.error('[wordle] revision-checked save failed', error);
      return { status: 'error' };
    }

    const result = Array.isArray(data) ? data[0] : data;

    if (!result) {
      console.error('[wordle] saved-state RPC returned no result');
      return { status: 'error' };
    }

    return {
      status: result.saved ? 'saved' : 'conflict',
      gameState: result.current_game_state,
      revision: Number(result.current_revision),
    };
  }

  // Initial write: PostgreSQL atomically verifies the
  // expected server revision before accepting the state.
  let firstSave = await saveAtRevision(gameState, expectedRevision);
  // Recompute against the winning snapshot after contention. Never attach a
  // newer revision to the same stale legacy payload and overwrite it blindly.
  for (let attempt = 0; legacy && firstSave.status === 'conflict' && attempt < 2; attempt++) {
    const merged = mergeLegacyWordleState(input, firstSave.gameState);
    if (!merged) return firstSave;
    gameState = merged;
    firstSave = await saveAtRevision(merged, firstSave.revision);
  }

  if (firstSave.status !== 'saved') {
    return firstSave;
  }

  // Preserve the existing legacy resultSave mechanism.
  // Modern clients normally use the independent result outbox.
  const currentGame =
    gameState.gameMode === 'CUSTOM'
      ? gameState.custom
      : gameState.modes?.[gameState.gameMode]?.[gameState.wordPack];

  if (
    !currentGame ||
    !(currentGame.isGameWon || currentGame.isGameLost) ||
    !currentGame.resultSave
  ) {
    return firstSave;
  }

  const result = await gameService.submitWordleResult(userId, {
    shareCode: gameState.gameMode === 'CUSTOM' ? (currentGame.joinCode ?? '') : '',
    ...(currentGame._legacyResultId ? { resultId: currentGame._legacyResultId } : {}),
    gameWasHardMode: false,
    guesses: currentGame.guesses,
    solution: currentGame.solution,
    type: gameState.gameMode,
    wordPack: gameState.wordPack,
    ...(currentGame.gameInstanceId
      ? { gameInstanceId: currentGame.gameInstanceId }
      : {}),
  });

  if (!result?.resultId) {
    // Leave resultSave true on the server so the legacy
    // completion is not silently treated as consumed.
    return { status: 'error' };
  }

  // Construct a new state rather than mutating the request.
  const consumedGame = {
    ...currentGame,
    resultSave: false,
  };

  const consumedState =
    gameState.gameMode === 'CUSTOM'
      ? {
          ...gameState,
          custom: consumedGame,
        }
      : {
          ...gameState,
          modes: {
            ...gameState.modes,
            [gameState.gameMode]: {
              ...gameState.modes[gameState.gameMode],
              [gameState.wordPack]: consumedGame,
            },
          },
        };

  // A second revision-checked write prevents this legacy
  // cleanup from overwriting a newer game checkpoint.
  return saveAtRevision(
    consumedState,
    firstSave.revision,
  );
}

export default {
  getGameState,
  updateGameState,
};