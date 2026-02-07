import { supabase as db } from './utils/client';

async function getChallenges(): Promise<void> {
  const { data, error } = await db.from('_challenges').select('*');
  console.log(data, error);
}

async function getChallengesByGame(game: string) {
  const { data, error } = await db
    .from('_challenges')
    .select('*')
    .eq('is_game_specific', true)
    .eq('game', game);

  if (error) {
    console.error(error);
    return {};
  }

  return data;
}

async function getMyChallenges(): Promise<void> {
  const { data, error } = await db
    .from('_challenge_progress')
    .select(
      `
        _challenges (
          id,
          name,
          description,
          unlocks_at_level,
          coins_to_unlock,
          item_reward,
          coin_reward,
          xp_reward
        ),
        id,
        player_id,
        status,
        progress
      `,
    )
    .neq('status', 'COMPLETED')
    .eq('player_id', 'e7cf6445-2b24-4841-b9e2-7581e9f13a76');

  console.log(data, error);
}

function checker(
  comparator: string,
  stats: any,
  parameter: string,
  value: number,
) {
  switch (comparator) {
    case '=':
      return stats[parameter] === value;
    case '>':
      return stats[parameter] > value;
    case '<':
      return stats[parameter] < value;
    case '<=':
      return stats[parameter] <= value;
    case '>=':
      return stats[parameter] >= value;
  }
}

async function wordleEngine(allTimeStats: any) {
  const challenges = await getChallengesByGame('WORDLE');
  for (const challenge of challenges) {
    const { id, name, description, param, value, comparator } = challenge;
    if (checker(comparator, allTimeStats, param, value)) {
      //handleReward();
    }
  }
}

async function engine(game: string, gameResult: any) {
  switch (game) {
    case 'WORDLE':
      return await wordleEngine(gameResult);
    default:
      return {};
  }
}

await engine('WORDLE', {
  id: 'a18eef80-815f-4073-ba50-a2a1c1926a2c',
  created_at: '2024-06-21 11:39:40.14506+00',
  player: 'e7cf6445-2b24-4841-b9e2-7581e9f13a76',
  games_played: 723,
  games_won: 635,
  games_lost: 88,
  best_wordle_infinite_streak: 0,
  wordle_games_won: 635,
  wordle_games_lost: 88,
  wordle_success_rate: 0,
  wordle_wins_in_1: 315,
  wordle_wins_in_2: 105,
  wordle_wins_in_3: 57,
  wordle_wins_in_4: 115,
  wordle_wins_in_5: 35,
  wordle_wins_in_6: 7,
  wordle_coins_won: 4734,
  wordle_xp_won: 825,
  dark_mode_wins: 0,
  dark_mode_lost: 0,
  wordle_hard_mode_wins: 0,
  wordle_hard_mode_lost: 0,
  light_mode_wins: 0,
  light_mode_lost: 0,
  wordle_5_letter_wins: 431,
  wordle_5_letter_lost: 80,
  wordle_6_letter_wins: 68,
  wordle_6_letter_lost: 0,
  wordle_7_letter_wins: 17,
  wordle_7_letter_lost: 0,
  wordle_8_letter_wins: 19,
  wordle_8_letter_lost: 0,
  wordle_9_letter_wins: 15,
  wordle_9_letter_lost: 0,
  wordle_10_letter_wins: 14,
  wordle_10_letter_lost: 1,
  wordle_11_letter_wins: 71,
  wordle_11_letter_lost: 7,
  wordle_custom_wins: 0,
  wordle_custom_lost: 0,
  spellbee_games_daily_won: 0,
  best_wordle_daily_streak: 0,
  wordle_daily_games_won: 268,
  wordle_daily_games_lost: 35,
  wordle_infinite_games_won: 367,
  wordle_infinite_games_lost: 53,
  wordle_5_letter_daily_wins: 197,
  wordle_5_letter_daily_lost: 32,
  wordle_5_letter_infinite_wins: 234,
  wordle_5_letter_infinite_lost: 48,
  wordle_6_letter_daily_wins: 24,
  wordle_6_letter_daily_lost: 0,
  wordle_6_letter_infinite_wins: 44,
  wordle_6_letter_infinite_lost: 0,
  wordle_7_letter_daily_wins: 9,
  wordle_7_letter_daily_lost: 0,
  wordle_7_letter_infinite_wins: 8,
  wordle_7_letter_infinite_lost: 0,
  wordle_8_letter_daily_wins: 10,
  wordle_8_letter_daily_lost: 0,
  wordle_8_letter_infinite_wins: 9,
  wordle_8_letter_infinite_lost: 0,
  wordle_9_letter_daily_wins: 8,
  wordle_9_letter_daily_lost: 0,
  wordle_9_letter_infinite_wins: 7,
  wordle_10_letter_daily_wins: 7,
  wordle_10_letter_daily_lost: 0,
  wordle_10_letter_infinite_wins: 7,
  wordle_11_letter_daily_wins: 13,
  wordle_11_letter_daily_lost: 3,
  wordle_11_letter_infinite_wins: 58,
  spellbee_games_daily_average: 0,
  spellbee_games_infinite_won: 0,
  spellbee_games_infinite_average: 0,
  wordle_daily_coins_won: 0,
  wordle_daily_xp_won: 0,
  wordle_infinite_coins_won: 0,
  wordle_infinite_xp_won: 0,
  spellbee_infinite_xp_won: 0,
  spellbee_infinite_coins_won: 0,
  spellbee_daily_xp_won: 0,
  spellbee_daily_coins_won: 0,
  wordle_10_letter_infinite_lost: 1,
  wordle_11_letter_infinite_lost: 4,
  wordle_9_letter_infinite_lost: 0,
});
