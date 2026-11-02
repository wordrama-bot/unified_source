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
  generateWordleShareCode,
  handleIncrementCustomTimesPlayed,
};
