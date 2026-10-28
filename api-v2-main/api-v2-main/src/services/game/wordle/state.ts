import { db } from '../../../models';
import gameService from './';

async function getGameState(userId: string) {
  const { data, error } = await db
    .from('_wordle_saved_state')
    .select('game_state, state_revision')
    .eq('player', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return {
    gameState: data?.game_state ?? {},
    revision: data?.state_revision ?? 0,
  };
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
  const { gameState, expectedRevision } = input ?? {};

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
  const firstSave = await saveAtRevision(
    gameState,
    expectedRevision,
  );

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
    shareCode: '',
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
    return firstSave;
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