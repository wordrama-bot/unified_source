import * as changeKeys from 'change-case/keys';

import { db } from '../models';

async function getWordleWrappedById(playerId: string) {
  const { data, error } = await db
    .from('_wordle_wrapped_2024')
    .select(
      `
      challenge_xp_reward,
      challenge_coin_reward,
      challenges_completed,
      most_wins_month,
      most_games_month,
      favorite_starting_word,
      average_guess_count,
      longest_win_word_length,
      longest_win_word,
      total_games,
      best_streak
    `,
    )
    .eq('player', playerId)
    .maybeSingle();

  if (error || !data) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

export default {
  getWordleWrappedById,
};
