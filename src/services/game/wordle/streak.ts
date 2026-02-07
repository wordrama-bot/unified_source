import * as changeKeys from 'change-case/keys';
import { db } from '../../../models';

async function getStreak(
  userId: string,
  wordPack: string,
  type: string,
): Promise<{
  currentStreak?: number;
  bestStreak?: number;
}> {
  const { data, error } = await db
    .from('_wordle_streak')
    .select('id, current_streak, best_streak')
    .eq('player', userId)
    .eq('word_pack', wordPack)
    .eq('type', type)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10) as {
    currentStreak?: number;
    bestStreak?: number;
  };
}

async function incrementWordleStreak(
  userId: string,
  wordPack: string,
  type: string,
): Promise<{
  currentStreak?: number;
  bestStreak?: number;
}> {
  let streak = await getStreak(userId, wordPack, type);
  if (!streak) {
    const { data, error } = await db
      .from('_wordle_streak')
      .insert({
        current_streak: 0,
        best_streak: 0,
        player: userId,
        word_pack: wordPack,
        type,
      })
      .select('id, current_streak, best_streak')
      .maybeSingle();

    if (error) {
      console.error(error);
      return {};
    }

    streak = changeKeys.camelCase(data, 10) as {
      currentStreak?: number;
      bestStreak?: number;
    };
  }

  const currentStreak = streak?.currentStreak || 0;
  const currentBestStreak = streak?.bestStreak || 0;
  const newStreak = currentStreak + 1;
  const bestStreak =
    newStreak > currentBestStreak ? newStreak : currentBestStreak;

  const { data, error } = await db
    .from('_wordle_streak')
    .update({
      current_streak: newStreak,
      best_streak: bestStreak,
    })
    .eq('player', userId)
    .eq('word_pack', wordPack)
    .eq('type', type)
    .select('best_streak, current_streak')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10) as {
    currentStreak?: number;
    bestStreak?: number;
  };
}

async function resetWordleStreak(
  userId: string,
  wordPack: string,
  type: string,
) {
  const { data, error } = await db
    .from('_wordle_streak')
    .update({
      current_streak: 0,
    })
    .eq('player', userId)
    .eq('word_pack', wordPack)
    .eq('type', type)
    .select('best_streak, current_streak')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

export default {
  getStreak,
  incrementWordleStreak,
  resetWordleStreak,
};
