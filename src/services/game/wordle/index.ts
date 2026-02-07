import * as changeKeys from 'change-case/keys';
import moment from 'moment';
import { db } from '../../../models';
import { AddGameResult, CreateCustom } from '../../schema/game/wordle';
import { enqueue, createMessage } from '../../../utils/gameLoop';

//import playerService from '../../player';
import streakService from './streak';
import gameUtils from '../../../utils/game';

async function getLast30(userId: string, wordPack: string) {
  const { data, error } = await db
    .from('_v_wordle_last_30')
    .select('solution, game_was_won')
    .eq('player', userId)
    .eq('word_pack', wordPack);

  if (error) {
    console.error(error);
    return [];
  }

  return changeKeys.camelCase(data, 10);
}

async function getCustomByShareCode(shareCode: string) {
  const { data, error } = await db
    .from('_wordle_customs')
    .select('share_code, custom_word, hint')
    .eq('share_code', shareCode)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data);
}

async function submitWordleResult(userId: string, body: AddGameResult) {
  const guessCount = body.guesses.length;
  const gameWasWon = body.guesses.includes(body.solution);
  const wordLength = body.solution.length;
  const { data, error } = await db
    .from('_wordle_game_result')
    .insert(
      changeKeys.snakeCase({
        ...body,
        player: userId,
        guessCount,
        gameWasWon,
        day: new Date().getDate(),
        week: moment().week(),
        month: new Date().getMonth() + 1,
        year: new Date().getUTCFullYear(),
        wordLength,
      }),
    )
    .select('id')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  if (body.type !== 'CUSTOM') {
    await gameUtils.handleRewardWordle(
      userId,
      body.gameWasHardMode,
      guessCount,
    );
  }

  if (body.type === 'CUSTOM') {
    await gameUtils.handleIncrementCustomTimesPlayed(body.shareCode);
  }

  if (gameWasWon) {
    await streakService.incrementWordleStreak(userId, body.wordPack, body.type);
  } else {
    await streakService.resetWordleStreak(userId, body.wordPack, body.type);
  }

  // Try to enqueue challenge check message, but don't fail if service bus is unavailable
  try {
    await enqueue([
      createMessage('CHECK_WORDLE_CHALLENGES', {
        userId,
        metadata: {
          guessCount,
          gameWasWon,
          wordLength,
          ...body,
        },
      }),
    ]);
  } catch (error) {
    console.warn('Failed to enqueue challenge check message:', error instanceof Error ? error.message : String(error));
    // Continue execution even if messaging fails
  }

  //await playerService.getPlayerByUserId(userId);
  return { resultId: data.id };
}

async function createCustom(userId: string, body: CreateCustom) {
  const { data, error } = await db
    .from('_wordle_customs')
    .insert(
      changeKeys.snakeCase({
        player: userId,
        shareCode: gameUtils.generateWordleShareCode(),
        ...body,
      }),
    )
    .select('custom_word, hint, share_code')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data);
}

export default {
  getCustomByShareCode,
  submitWordleResult,
  createCustom,
  getLast30,
};
