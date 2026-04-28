import * as changeKeys from 'change-case/keys';
import moment from 'moment';
import { db } from '../../../models';

import FOUR_LETTER from '../../../utils/wordPacks/FOUR_LETTER';
import FIVE_LETTER from '../../../utils/wordPacks/FIVE_LETTER';
import SIX_LETTER from '../../../utils/wordPacks/SIX_LETTER';
import SEVEN_LETTER from '../../../utils/wordPacks/SEVEN_LETTER';
import EIGHT_LETTER from '../../../utils/wordPacks/EIGHT_LETTER';
import NINE_LETTER from '../../../utils/wordPacks/NINE_LETTER';
import TEN_LETTER from '../../../utils/wordPacks/TEN_LETTER';
import ELEVEN_LETTER from '../../../utils/wordPacks/ELEVEN_LETTER';
import ELEVEN_LETTER_EXTENDED from '../../../utils/wordPacks/ELEVEN_LETTER_EXTENDED';
import TWELVE_LETTER from '../../../utils/wordPacks/TWELVE_LETTER';
import THIRTEEN_LETTER from '../../../utils/wordPacks/THIRTEEN_LETTER';
import FOURTEEN_LETTER from '../../../utils/wordPacks/FOURTEEN_LETTER';
import FIFTEEN_LETTER from '../../../utils/wordPacks/FIFTEEN_LETTER';
import SIXTEEN_LETTER from '../../../utils/wordPacks/SIXTEEN_LETTER';
import SEVENTEEN_LETTER from '../../../utils/wordPacks/SEVENTEEN_LETTER';
import EIGHTEEN_LETTER from '../../../utils/wordPacks/EIGHTEEN_LETTER';
import NINETEEN_LETTER from '../../../utils/wordPacks/NINETEEN_LETTER';
import TWENTY_LETTER from '../../../utils/wordPacks/TWENTY_LETTER';
import TWENTYONE_LETTER from '../../../utils/wordPacks/TWENTYONE_LETTER';
import TWENTYTWO_LETTER from '../../../utils/wordPacks/TWENTYTWO_LETTER';
import TWENTYTHREE_LETTER from '../../../utils/wordPacks/TWENTYTHREE_LETTER';
import CUSTOM from '../../../utils/wordPacks/CUSTOM';

type WordPacks = {
  [key: string]: {
    WORD_LIST: string[];
    WORD_LIST_LENGTH: number;
    VALID_GUESSES: string[];
    VALID_GUESSES_LENGTH: number;
    DAILY_WORD_LIST: string[];
    DAILY_WORD_LIST_LENGTH: number;
  };
};

const wordPacks: WordPacks = {
  FOUR_LETTER,
  FIVE_LETTER,
  SIX_LETTER,
  SEVEN_LETTER,
  EIGHT_LETTER,
  NINE_LETTER,
  TEN_LETTER,
  ELEVEN_LETTER,
  ELEVEN_LETTER_EXTENDED,
  TWELVE_LETTER,
  THIRTEEN_LETTER,
  FOURTEEN_LETTER,
  FIFTEEN_LETTER,
  SIXTEEN_LETTER,
  SEVENTEEN_LETTER,
  EIGHTEEN_LETTER,
  NINETEEN_LETTER,
  TWENTY_LETTER,
  TWENTYONE_LETTER,
  TWENTYTWO_LETTER,
  TWENTYTHREE_LETTER,
  CUSTOM,
};

const wordPackItemIdMap: { [key: string]: string } = {
  TWELVE_LETTER: '7f06b10e-d52a-4ae3-b77f-a7e9a7c5e5fb',
  THIRTEEN_LETTER: 'b8c73f14-79ad-4495-9fd9-a4be65d5fcbc',
  FOURTEEN_LETTER: '3159552d-8c96-4bb5-aafa-ebf36aa5a2c2',
  FIFTEEN_LETTER: 'fef67eba-96db-4f5e-8b25-81487a1dbc9d',
  SIXTEEN_LETTER: '1ee2de50-072f-4718-b8ac-7663f3069f2e',
  SEVENTEEN_LETTER: '80e197a9-0829-4074-8e85-a88e6e8b7ea0',
  EIGHTEEN_LETTER: '425c96ab-beff-40ef-9774-feb6db135644',
  NINETEEN_LETTER: '1d348c05-c51e-4ea3-a888-d4823436704f',
  TWENTY_LETTER: '6e66a620-8e17-4f75-aa0b-1c282aafb9d8',
  TWENTYONE_LETTER: '72215e5b-6638-4388-84bc-55dcd36c0e05',
  TWENTYTWO_LETTER: 'db526774-11da-47de-b410-5b47a4168db8',
  TWENTYTHREE_LETTER: 'ab14511c-f2ac-4b16-a8ef-7cb8ed61a2cc',
  ELEVEN_LETTER_EXTENDED: 'b1b96d0e-5b1a-403e-80be-88f3d2bae873',
};

const itemIdWordPackMap: { [key: string]: string } = {
  'b1b96d0e-5b1a-403e-80be-88f3d2bae873': 'ELEVEN_LETTER_EXTENDED',
  '7f06b10e-d52a-4ae3-b77f-a7e9a7c5e5fb': 'TWELVE_LETTER',
  'b8c73f14-79ad-4495-9fd9-a4be65d5fcbc': 'THIRTEEN_LETTER',
  '3159552d-8c96-4bb5-aafa-ebf36aa5a2c2': 'FOURTEEN_LETTER',
  'fef67eba-96db-4f5e-8b25-81487a1dbc9d': 'FIFTEEN_LETTER',
  '1ee2de50-072f-4718-b8ac-7663f3069f2e': 'SIXTEEN_LETTER',
  '80e197a9-0829-4074-8e85-a88e6e8b7ea0': 'SEVENTEEN_LETTER',
  '425c96ab-beff-40ef-9774-feb6db135644': 'EIGHTEEN_LETTER',
  '1d348c05-c51e-4ea3-a888-d4823436704f': 'NINETEEN_LETTER',
  '6e66a620-8e17-4f75-aa0b-1c282aafb9d8': 'TWENTY_LETTER',
  '72215e5b-6638-4388-84bc-55dcd36c0e05': 'TWENTYONE_LETTER',
  'db526774-11da-47de-b410-5b47a4168db8': 'TWENTYTWO_LETTER',
  'ab14511c-f2ac-4b16-a8ef-7cb8ed61a2cc': 'TWENTYTHREE_LETTER',
};

const FREE_WORDPACKS = [
  'FIVE_LETTER',
  'SIX_LETTER',
  'SEVEN_LETTER',
  'EIGHT_LETTER',
  'NINE_LETTER',
  'TEN_LETTER',
  'ELEVEN_LETTER',
];

async function getPurchasedWordPacks(userId: string): Promise<string[]> {
  const playersPacks: string[] = [...FREE_WORDPACKS];

  const { data, error } = await db
    .from('_purchased_items')
    .select('item_id')
    .eq('player_id', userId);

  if (error) {
    console.error('Error fetching purchased items', error);
    return playersPacks;
  }

  const purchasedWordPacks = data.reduce(
    (acc: string[], curr: { item_id: string }) => [...acc, curr.item_id],
    [],
  );

  if (purchasedWordPacks.includes('ba8671aa-7481-43e5-a1ac-f2b73433a315')) {
    playersPacks.push('FOUR_LETTER');
  }

  if (purchasedWordPacks.includes('3d3ff93b-65c1-4d36-902e-3a889c71ac86')) {
    playersPacks.push(...Object.keys(wordPackItemIdMap));
    if (playersPacks.length >= 19) return playersPacks;
  }

  Object.keys(itemIdWordPackMap).forEach((itemId) => {
    if (purchasedWordPacks.includes(itemId)) {
      playersPacks.push(itemIdWordPackMap[itemId]);
    }
  });

  return playersPacks;
}

async function checkIfUserHasAccessToWordPack(
  userId: string,
  wordPack: string,
): Promise<boolean> {
  if (FREE_WORDPACKS.includes(wordPack)) return true;

  const { data, error } = await db
    .from('_purchased_items')
    .select('item_id')
    .eq('player_id', userId);

  if (error) {
    console.error('Error fetching purchased items', error);
    return false;
  }

  const purchasedWordPacks = data.reduce(
    (acc: string[], curr: { item_id: string }) => [...acc, curr.item_id],
    [],
  );

  if (
    wordPack === 'FOUR_LETTER' &&
    purchasedWordPacks.includes('ba8671aa-7481-43e5-a1ac-f2b73433a315')
  )
    return true;

  if (
    wordPack !== 'FOUR_LETTER' &&
    purchasedWordPacks.includes('3d3ff93b-65c1-4d36-902e-3a889c71ac86')
  )
    return true;

  return purchasedWordPacks.includes(wordPackItemIdMap[wordPack]);
}

async function getWordPack(wordPack: string) {
  return changeKeys.camelCase(wordPacks[wordPack], 10);
}

function getDaysSinceStart(
  year: number = 2024,
  month: number = 8,
  day: number = 14,
) {
  return moment().diff(moment([year, month - 1, day]), 'days');
}

// TODO: Implement reshuffle logic
async function getTodaysWord(wordPack: string) {
  const todaysIndex = getDaysSinceStart();
  const dailyWordList = wordPacks[wordPack].DAILY_WORD_LIST;
  
  // Use modulo to wrap around if index exceeds array length
  const wrappedIndex = todaysIndex % dailyWordList.length;
  const todaysWord = dailyWordList[wrappedIndex];
  
  const yesterdaysIndex = (todaysIndex - 1) % dailyWordList.length;
  const yesterdaysWord = dailyWordList[yesterdaysIndex] || '';

  return changeKeys.camelCase(
    {
      wordPack,
      todaysIndex,
      todaysWord: todaysWord ? todaysWord.toUpperCase() : '',
      yesterdaysIndex: todaysIndex - 1,
      yesterdaysWord: yesterdaysWord ? yesterdaysWord.toUpperCase() : '',
    },
    10,
  );
}

export default {
  getPurchasedWordPacks,
  getWordPack,
  getTodaysWord,
  checkIfUserHasAccessToWordPack,
};
