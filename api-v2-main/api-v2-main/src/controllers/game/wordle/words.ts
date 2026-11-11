import { Response } from 'express';
import moment from 'moment';
import { ApiRequest } from '../../../types';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../../../utils/responses';

import wordsService from '../../../services/game/wordle/words';
import { PLANNED_WORD_PACKS } from '../../../services/marketplaceV2/plannedWordPackPolicy';
import THREE_LETTER from '../../../utils/wordPacks/THREE_LETTER';
import THREE_LETTER_CRAZY from '../../../utils/wordPacks/THREE_LETTER_CRAZY';
import FIVE_LETTER_UNHINGED from '../../../utils/wordPacks/FIVE_LETTER_UNHINGED';

export function checkIfValidWordPack(wordPack: string): boolean {
  const validWordPacks: string[] = [
    'FOUR_LETTER',
    'FIVE_LETTER',
    'FIVE_LETTER_CRAZY',
    'SIX_LETTER',
    'SEVEN_LETTER',
    'EIGHT_LETTER',
    'NINE_LETTER',
    'TEN_LETTER',
    'ELEVEN_LETTER',
    'ELEVEN_LETTER_EXTENDED',
    'TWELVE_LETTER',
    'THIRTEEN_LETTER',
    'FOURTEEN_LETTER',
    'FIFTEEN_LETTER',
    'SIXTEEN_LETTER',
    'SEVENTEEN_LETTER',
    'EIGHTEEN_LETTER',
    'NINETEEN_LETTER',
    'TWENTY_LETTER',
    'TWENTYONE_LETTER',
    'TWENTYTWO_LETTER',
    'TWENTYTHREE_LETTER',
  ];
  if (validWordPacks.includes(wordPack)) return true;

  const planned = PLANNED_WORD_PACKS as Record<string, { enabled: boolean }>;
  const dictionaries: Record<string, { WORD_LIST_LENGTH: number; VALID_GUESSES_LENGTH: number; DAILY_WORD_LIST_LENGTH: number }> = {
    THREE_LETTER,
    THREE_LETTER_CRAZY,
    FIVE_LETTER_UNHINGED,
  };
  const config = planned[wordPack];
  const dictionary = dictionaries[wordPack];
  return Boolean(config?.enabled && dictionary &&
    dictionary.WORD_LIST_LENGTH > 0 &&
    dictionary.VALID_GUESSES_LENGTH > 0 &&
    dictionary.DAILY_WORD_LIST_LENGTH > 0);

}

async function getWordPack(req: ApiRequest, res: Response) {
  const { wordPack } = req.params;
  const isValidWordPack = checkIfValidWordPack(wordPack);
  if (!isValidWordPack) return badRequest(req, res, {}, 'Invalid Word Pack', 0);

  const hasAccess = await wordsService.checkIfUserHasAccessToWordPack(
    req.userId,
    wordPack,
  );
  if (!hasAccess)
    return badRequest(
      req,
      res,
      {},
      'User does not have access to this word pack',
      0,
    );

  const words = await wordsService.getWordPack(wordPack);
  if (!words) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    words,
    `Word Pack (${wordPack}) Returned`,
    1,
  );
}

async function getMyWordPacks(req: ApiRequest, res: Response) {
  const wordPacks = await wordsService.getPurchasedWordPacks(req.userId);
  if (!wordPacks) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    wordPacks,
    `${wordPacks.length} wordpack(s) Returned`,
    wordPacks.length,
  );
}

async function getTodaysWord(req: ApiRequest, res: Response) {
  const { wordPack } = req.params;
  const isValidWordPack = checkIfValidWordPack(wordPack);
  if (!isValidWordPack) return badRequest(req, res, {}, 'Invalid Word Pack', 0);

  const hasAccess = await wordsService.checkIfUserHasAccessToWordPack(
    req.userId,
    wordPack,
  );

  if (!hasAccess)
  return badRequest(
    req,
    res,
    'User does not have access to this word pack',
  );

  // Word of The Day
  const wotd = await wordsService.getTodaysWord(wordPack);
  if (!wotd) return notFoundResponse(req, res);

  if (!wotd.todaysWord || wotd.todaysWord === '')
    return badRequest(req, res, {}, 'Out of words, reshuffle required.', 0);

  return successfulResponse(
    req,
    res,
    wotd,
    `Todays Word for (${wordPack}) returned`,
    1,
  );
}

export default {
  getMyWordPacks,
  getWordPack,
  getTodaysWord,
};
