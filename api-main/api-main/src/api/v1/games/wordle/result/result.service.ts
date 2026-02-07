// Services
import { updateBalance } from '../../../economy/coins/coins.service';
import { 
  getPublicProfile,
  updateXpLevel
} from '../../../auth/account/account.service';

// Helpers
import { sendMessageToQueue } from '../../../../../helper/queue';

// guesses - 1 provides the index of how many coins the player should 
// be rewarded
const guessXpMapping = [ 100, 80, 60, 40, 20, 10 ];
const guessCoinMapping = [ 10, 5, 4, 3, 2, 1 ];
const baseXP = 50;
const growthFactor = 1.08;

const todaysDate = new Date();

function xpForNextLevel(level) {
  return Math.floor(baseXP * Math.pow(growthFactor, level - 1));
}

export async function addXP(userId: string, amount: number) {
  const { data } = await getPublicProfile(userId);
  let { xp, level }: { 
    xp: number, 
    level: number
  } = data;

  xp += amount;

  let nextLevel: number;
  while (xp >= xpForNextLevel(level)) {
    nextLevel = xpForNextLevel(level)
    xp -= nextLevel;
    level++;
  }

  await updateXpLevel(userId, xp, level, nextLevel);

  return { xp, level };
}

export async function submitGameResult(
  userId: string,
  isHardMode: boolean = false,
  guesses: string[],
  solution: string
) {
  let coinReward = 0;
  let xpReward = 1;

  if (guesses.length <= 6) {
    xpReward = guessXpMapping[guesses.length - 1];
    coinReward = guessCoinMapping[guesses.length - 1];
  }

  if (isHardMode) {
    xpReward = xpReward + 30
    coinReward = coinReward * 3;
  }

  await addXP(userId, xpReward);

  const gameWasWon = solution === guesses[guesses.length -1 ];
  if (!gameWasWon) return { 
    status: 400,
    statusText: 'Game was lost'
  };

  return await updateBalance(userId, coinReward, 'increment');
}

export async function submitGameForProcessing(
  userId: string,
  isDaily: boolean,
  isCustomGame: boolean,
  isHardMode: boolean,
  isDarkMode: boolean,
  isHighContrastMode: boolean,
  swapEnterAndDelete: boolean,
  isSpeedRunEnabled: boolean,
  isConfettiEnabled: boolean,
  wordLength: string,
  gameId: string,
  isGameLost: boolean,
  isGameWon: boolean,
  solution: string,
  guesses: string[]
){
  const guessesTaken = guesses.length;
  const isInfiniteMode = !isDaily && !isCustomGame;
  let coinReward = 0;
  let xpReward = 1;

  if (!isCustomGame && guessesTaken <= 6) {
    xpReward = guessXpMapping[guessesTaken - 1];
    coinReward = guessCoinMapping[guessesTaken - 1];
  }

  if (!isCustomGame && isHardMode) {
    xpReward = xpReward + 30
    coinReward = coinReward * 3;
  }

  await sendMessageToQueue('games-queue', {
    userId,
    gameId,
    day: todaysDate.getDate(),
    month: todaysDate.getMonth() + 1,
    year: todaysDate.getFullYear(),
    isInfiniteMode,
    isDaily,
    isCustomGame,
    isHardMode,
    isDarkMode,
    isHighContrastMode,
    swapEnterAndDelete,
    isSpeedRunEnabled,
    isConfettiEnabled,
    wordLength,
    isGameLost,
    isGameWon,
    solution,
    guesses,
    coinsWon: coinReward,
    xpWon: xpReward
  });

  return {
    status: 201,
    data: {
      userId,
      gameId,
      message: 'Added to queue'
    }
  }
}