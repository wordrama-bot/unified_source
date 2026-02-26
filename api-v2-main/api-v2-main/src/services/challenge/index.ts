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

async function getMyChallenges(playerId: string, statusFilter?: string) {
  const rawFilter = String(statusFilter || "ALL").toUpperCase();

  // Canonicalize output so frontend only ever sees COMPLETE
  const normalizeStatus = (s: any) => {
    const v = String(s || "").toUpperCase();
    if (v === "COMPLETED") return "COMPLETE";
    return v;
  };

  let q = db
    .from("_v_challenge_progress")
    .select("*")
    .eq("player_id", playerId);

  // Apply filter (ALL means no filter)
  if (rawFilter && rawFilter !== "ALL") {
    // If user asks for COMPLETE, accept both COMPLETE and legacy COMPLETED
    if (rawFilter === "COMPLETE" || rawFilter === "COMPLETED") {
      q = q.in("status", ["COMPLETE", "COMPLETED"]);
    } else {
      q = q.eq("status", rawFilter);
    }
  }

  const { data, error } = await q;

  if (error) throw error;

  // Normalize statuses so UI shows trophies + labels consistently
  const normalized = (data || []).map((row: any) => ({
    ...row,
    status: normalizeStatus(row.status),
  }));

  return normalized;
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
