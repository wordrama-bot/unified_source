import { db } from '../models';
import * as changeKeys from 'change-case/keys';

const baseXP = 50;
const baseGrowthFactor = 1.08;

function xpForNextLevel(level: number) {
  let growthFactor = baseGrowthFactor;
  if (level >= 50) growthFactor = 1.061;
  return Math.floor(baseXP * Math.pow(growthFactor, level - 1));
}

function roundDownToHundred(level: number) {
  return Math.floor(level / 100) * 100;
}

async function changeXp(
  userId: string,
  direction: string = 'up',
  amount: number,
) {
  const { data: currentLevel, error: currentLevelError } = await db
    .from('_levels')
    .select('xp, level, xp_to_next_level')
    .eq('player', userId)
    .maybeSingle();

  if (currentLevelError) {
    console.error(currentLevelError);
    return {};
  }

  let xp = currentLevel?.xp;
  let level = currentLevel?.level % 100;
  if (direction === 'up') {
    xp += amount;
  } else if (direction === 'down') {
    xp -= amount;
  }

  let xpToNextLevel: number = xpForNextLevel(level);
  while (xp >= xpForNextLevel(level)) {
    xpToNextLevel = xpForNextLevel(level);
    xp = xp - xpToNextLevel;
    level++;
  }

  if (currentLevel?.level >= 100) {
    level = roundDownToHundred(currentLevel?.level) + level;
  }

  const prestige = Math.floor(level / 100);
  const { data: updatedData, error: updatedError } = await db
    .from('_levels')
    .update({
      xp,
      level,
      prestige: prestige,
      xp_to_next_level: xpToNextLevel,
    })
    .eq('player', userId)
    .select('xp, level, xp_to_next_level')
    .maybeSingle();
  //console.log(updatedData);

  if (updatedError) {
    console.error(updatedError);
    return {};
  }

  return updatedData;
}

async function getLevel(userId: string) {
  const { data: level, error: levelError } = await db
    .from('_levels')
    .select('xp, level, xp_to_next_level')
    .eq('player', userId)
    .maybeSingle();

  if (levelError) {
    console.error(levelError);
    return {};
  }

  return changeKeys.camelCase(level, 10);
}

export default {
  getLevel,
  changeXp,
};
