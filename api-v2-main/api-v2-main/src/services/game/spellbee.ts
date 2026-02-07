import * as changeKeys from 'change-case/keys';
import { db } from '../../models';
import { AddGameResult } from '../schema/game/spellbee';

import playerService from '../player';
import gameUtils from '../../utils/game';

async function submitSpellbeeResult(userId: string, body: AddGameResult) {
  const wordsFoundPercentage =
    body.correct_words.length / body.potential_words.length;
  const { error } = await db
    .from('_spellbee_game_result')
    .insert(
      changeKeys.snakeCase({
        player: userId,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        correctWordCount: body.correct_words.length,
        potential_word_count: body.potential_words.length,
        words_found_percentage: wordsFoundPercentage,
        ...body,
      }),
    )
    .select('id')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  await gameUtils.handleRewardSpellbee(userId, wordsFoundPercentage);

  return await playerService.getPlayerByUserId(userId);
}

export default {
  submitSpellbeeResult,
};
