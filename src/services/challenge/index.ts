import * as changeKeys from 'change-case/keys';
import { db } from '../../models';

async function getChallengeReward(challengeId: string) {
  const { data, error } = await db
    .from('_challenges')
    .select('coin_reward, xp_reward')
    .eq('id', challengeId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getMyChallenges(playerId: string, statusFilter: string) {
  //status can be 'LOCKED',  'UNLOCKED', 'IN_PROGRESS', 'COMPLETED'
  if (statusFilter && statusFilter !== 'ALL') {
    const { data, error } = await db
      .from('_v_challenge_progress')
      .select(
        `
          challenge_id,
          name,
          description,
          unlocks_at_level,
          coins_to_unlock,
          item_reward,
          coin_reward,
          xp_reward,
          challenge_progress_id,
          status,
          progress
        `,
      )
      .eq('player_id', playerId)
      .eq('status', statusFilter);

    if (error) {
      console.error(error);
      return {};
    }

    return data.map((row: any) => changeKeys.camelCase(row, 10));
  }

  const { data, error } = await db
    .from('_v_challenge_progress')
    .select(
      `
        challenge_id,
        name,
        description,
        unlocks_at_level,
        coins_to_unlock,
        item_reward,
        coin_reward,
        xp_reward,
        challenge_progress_id,
        status,
        progress
      `,
    )
    .eq('player_id', playerId);

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((row: any) => changeKeys.camelCase(row, 10));
}

async function getAllChallenges(
  orderBy: string = 'completed',
  offset: number = 0,
  limit: number = 25,
) {
  const { data, error } = await db.from('_challenges').select(
    `
        id,
        name,
        description,
        unlocks_at_level,
        coins_to_unlock,
        item_reward,
        coin_reward,
        xp_reward
      `,
  );

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((row: any) => changeKeys.camelCase(row, 10));
}

export default {
  getChallengeReward,
  getMyChallenges,
  getAllChallenges,
};
