import { db } from '../../../models';
import gameService from './';

async function getGameState(userId: string) {
  const { data, error } = await db
    .from('_wordle_saved_state')
    .select('game_state')
    .eq('player', userId)
    .maybeSingle();

  // If the row doesn't exist yet (common after server/auth moves),
  // treat it as "no saved state" instead of an error.
  if (error) {
    console.error(error);
    return {};
  }

  return data?.game_state ?? {};
}

async function updateGameState(userId: string, gameState: any) {
  // IMPORTANT: use upsert so existing users who are missing the _wordle_saved_state row
  // don't get 404s / empty history. This will either update the row or create it.
  // Your DB already has a unique index on (player), so onConflict:'player' is valid.
  const { data, error } = await db
    .from('_wordle_saved_state')
    .upsert(
      {
        player: userId,
        game_state: gameState,
      },
      { onConflict: 'player' },
    )
    .select('game_state')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  // Preserve existing behavior: when a game ends and resultSave is true,
  // write a result row via the shared service.
  const currentGame =
    gameState?.gameMode === 'CUSTOM'
      ? gameState?.custom
      : gameState?.modes?.[gameState?.gameMode]?.[gameState?.wordPack];

  if (
    currentGame &&
    (currentGame.isGameWon || currentGame.isGameLost) &&
    currentGame.resultSave
  ) {
    await gameService.submitWordleResult(userId, {
      shareCode: '',
      gameWasHardMode: false,
      guesses: currentGame.guesses,
      solution: currentGame.solution,
      gameWasWon: currentGame.isGameWon,
      type: gameState.gameMode,
      wordPack: gameState.wordPack,
    });
  }

  return data?.game_state ?? {};
}

export default {
  getGameState,
  updateGameState,
};