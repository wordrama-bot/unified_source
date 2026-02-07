import { db } from '../../../models';
import gameService from './';

async function getGameState(userId: string) {
  const { data, error } = await db
    .from('_wordle_saved_state')
    .select('game_state')
    .eq('player', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return data?.game_state;
}

async function updateGameState(userId: string, gameState: any) {
  const { data, error } = await db
    .from('_wordle_saved_state')
    .update({
      game_state: gameState,
    })
    .eq('player', userId)
    .select('game_state')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  const currentGame =
    gameState.gameMode === 'CUSTOM'
      ? gameState.custom
      : gameState.modes[gameState.gameMode][gameState.wordPack];
  if (
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

  return data?.game_state;
}

export default {
  getGameState,
  updateGameState,
};
