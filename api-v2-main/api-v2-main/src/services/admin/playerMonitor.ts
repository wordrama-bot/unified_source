import { db } from '../../models';

// Read the stored snapshot directly. Do NOT call the regular game-state service:
// its pending-result recovery path may write game results and advance revisions.
export async function getPlayerLiveGameSnapshot(playerId: string) {
  const { data, error } = await db
    .from('_wordle_saved_state')
    .select('game_state, state_revision')
    .eq('player', playerId)
    .maybeSingle();

  if (error) {
    console.error('[admin.playerMonitor] snapshot lookup failed', { code: error.code });
    throw new Error('Unable to load saved game snapshot.');
  }

  const state = data?.game_state;
  const mode = typeof state?.gameMode === 'string' ? state.gameMode : null;
  const pack = typeof state?.wordPack === 'string' ? state.wordPack : null;
  const board = mode === 'CUSTOM'
    ? state?.custom
    : mode && pack ? state?.modes?.[mode]?.[pack] : null;

  const guesses = Array.isArray(board?.guesses)
    ? board.guesses.filter((guess: unknown): guess is string => typeof guess === 'string').slice(0, 30)
    : [];

  return {
    playerId,
    observedAt: new Date().toISOString(),
    // No updated_at exists on _wordle_saved_state; observedAt is query time, NOT save time.
    stateRevision: data?.state_revision ?? null,
    hasSavedState: Boolean(data),
    gameMode: mode,
    wordPack: pack,
    gameInstanceId: typeof board?.gameInstanceId === 'string' ? board.gameInstanceId : null,
    guesses,
    solution: typeof board?.solution === 'string' ? board.solution : null,
    isGameWon: board?.isGameWon === true,
    isGameLost: board?.isGameLost === true,
    // This is the last submitted/saved snapshot; unsaved typing is never included.
  };
}
