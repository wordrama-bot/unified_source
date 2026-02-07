import { db } from '../models';
import randomString from './random';
import levelService from '../services/levels';
import ledgerService from '../services/ledger';

async function handleRewardWordle(
  userId: string,
  isHardMode: boolean = false,
  numberOfGuesses: number,
) {
  let coinReward = 0;
  let xpReward = 1;
  const guessXpMapping = [1000, 150, 100, 50, 30, 20];
  const guessCoinMapping = [25, 15, 5, 4, 3, 2];

  if (numberOfGuesses < 1 || numberOfGuesses > 6) return; // Game Lost

  xpReward = guessXpMapping[numberOfGuesses - 1];
  coinReward = guessCoinMapping[numberOfGuesses - 1];

  /*if (isHardMode) {
    xpReward = xpReward + 10;
    coinReward = coinReward * 2;
    }*/

  const levelResponse = await levelService.changeXp(userId, 'up', xpReward);
  if (!levelResponse) return;

  const ledgerResponse = await ledgerService.changeBalance(
    userId,
    'up',
    coinReward,
  );
  if (!ledgerResponse) return;
}

async function handleRewardSpellbee(
  userId: string,
  wordsFoundPercentage: number,
) {
  let coinReward = 0;
  let xpReward = 1;

  if (wordsFoundPercentage < 10)
    return; // Game Lost
  else if (wordsFoundPercentage < 25) {
    xpReward = 10;
    coinReward = 10;
  } else if (wordsFoundPercentage < 50) {
    xpReward = 25;
    coinReward = 50;
  } else if (wordsFoundPercentage < 75) {
    xpReward = 75;
    coinReward = 80;
  } else if (wordsFoundPercentage < 85) {
    xpReward = 85;
    coinReward = 90;
  } else if (wordsFoundPercentage < 95) {
    xpReward = 95;
    coinReward = 100;
  } else if (wordsFoundPercentage < 100) {
    xpReward = 100;
    coinReward = 150;
  } else if (wordsFoundPercentage === 100) {
    xpReward = 150;
    coinReward = 200;
  }

  const levelResponse = await levelService.changeXp(userId, 'up', xpReward);
  if (!levelResponse) return;

  const ledgerResponse = await ledgerService.changeBalance(
    userId,
    'up',
    coinReward,
  );
  if (!ledgerResponse) return;
}

async function handleIncrementCustomTimesPlayed(shareCode: string) {
  const { data, error: customError } = await db
    .from('_wordle_customs')
    .select('times_played')
    .eq('share_code', shareCode)
    .maybeSingle();

  if (customError) {
    console.error(customError);
    return {};
  }

  const { error } = await db
    .from('_wordle_customs')
    .update({
      times_played: data?.times_played || 0 + 1,
    })
    .eq('share_code', shareCode)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }
}

function generateWordleShareCode() {
  const partA = randomString();
  const partB = randomString();
  return `${partA}${partB}`;
}

export default {
  handleRewardWordle,
  handleRewardSpellbee,
  generateWordleShareCode,
  handleIncrementCustomTimesPlayed,
};
