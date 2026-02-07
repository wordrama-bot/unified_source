import { Response } from 'express';
import { ApiRequest } from '../types';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../utils/responses';

import wordsService from '../services/game/wordle/words';

function checkIfValidWordPack(wordPack: string): boolean {
  const validWordPacks: string[] = [
    'FIVE_LETTER',
    'SIX_LETTER',
    'SEVEN_LETTER',
    'EIGHT_LETTER',
    'NINE_LETTER',
    'TEN_LETTER',
    'ELEVEN_LETTER',
  ];
  return validWordPacks.includes(wordPack);
}

async function getWordPack(req: ApiRequest, res: Response) {
  const { wordPack } = req.params;
  const isValidWordPack = checkIfValidWordPack(wordPack);
  if (!isValidWordPack) return badRequest(req, res, {}, 'Invalid Word Pack', 0);

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

async function getTodaysWord(req: ApiRequest, res: Response) {
  const { wordPack } = req.params;
  const isValidWordPack = checkIfValidWordPack(wordPack);
  if (!isValidWordPack) return badRequest(req, res, {}, 'Invalid Word Pack', 0);

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
  getWordPack,
  getTodaysWord,
};
