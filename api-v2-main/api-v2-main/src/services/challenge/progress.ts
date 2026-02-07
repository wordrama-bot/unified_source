import * as changeKeys from 'change-case/keys';
import { db } from '../../models';
import challengeService from './';
import ledgerService from '../ledger';
import levelService from '../levels';

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

async function updateChallengeProgress(
  challengeId: string,
  playerId: string,
  status: string,
  progress: number,
) {
  const currentProgress = await getChallengeProgress(playerId, challengeId);
  if (
    currentProgress?.status === 'COMPLETE' ||
    currentProgress?.progress === 100
  )
    return currentProgress;

  const { data, error } = await db
    .from('_challenge_progress')
    .update({
      status,
      progress,
    })
    .eq('player_id', playerId)
    .eq('challenge_id', challengeId)
    .select(`id, status, progress`)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  if (currentProgress?.progress !== 100 && progress === 100) {
    const reward = await challengeService.getChallengeReward(challengeId);
    if (reward?.coinReward) {
      await ledgerService.changeBalance(playerId, 'up', reward?.coinReward);
    }
    if (reward?.xpReward) {
      await levelService.changeXp(playerId, 'up', reward?.xpReward);
    }
  }

  return changeKeys.camelCase(data, 10);
}

export default {
  insertChallengeProgress,
  updateChallengeProgress,
};
