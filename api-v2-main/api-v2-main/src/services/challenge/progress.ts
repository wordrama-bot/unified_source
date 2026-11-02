import * as changeKeys from 'change-case/keys';
import { db } from '../../models';
import { awardPrestigeFrames } from '../prestigeFrames.js';

type Progress = {
  progressId?: string;
  playerId: string;
  challengeId: string;
  status: string;
  progress: number;
};

async function getChallengeProgress(
  playerId: string,
  challengeId: string,
): Promise<{
  id?: string;
  status?: string;
  progress?: number;
}> {
  const { data, error } = await db
    .from('_challenge_progress')
    .select(`id, status, progress`)
    .eq('player_id', playerId)
    .eq('challenge_id', challengeId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10) as {
    id: string;
    status: string;
    progress: number;
  };
}

async function insertChallengeProgress({
  playerId,
  challengeId,
  status,
  progress,
}: Progress) {
  const { data, error } = await db
    .from('_challenge_progress')
    .insert({
      player_id: playerId,
      challenge_id: challengeId,
      status,
      progress,
    })
    .select(`id, status, progress`);

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

// Trusted award scripts only. HTTP routes cannot invoke this service.
async function updateChallengeProgress(challengeId: string, playerId: string, status: string, progress: number) {
  if (!['UNLOCKED', 'IN_PROGRESS', 'COMPLETE'].includes(status) ||
      !Number.isSafeInteger(progress) || progress < 0 || progress > 100 ||
      (status === 'COMPLETE') !== (progress === 100)) {
    throw new Error('Invalid challenge progress');
  }
  const { data, error } = await db.rpc('wordrama_update_challenge_progress', {
    p_player: playerId, p_challenge: challengeId, p_status: status, p_progress: progress,
  });
  if (error || !data?.id) throw new Error('Unable to update challenge progress');
  if (Number.isSafeInteger(data.prestige)) {
    try { await awardPrestigeFrames(playerId, data.prestige); }
    catch (error) { console.error('Challenge prestige frames pending', error); }
  }
  return changeKeys.camelCase(data, 10);
}

export default {
  insertChallengeProgress,
  updateChallengeProgress,
};
