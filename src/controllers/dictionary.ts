import { Response } from 'express';
import { ApiRequest } from '../types';

import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../utils/responses';

import dictionaryService from '../services/dictionary';

async function getWord(req: ApiRequest, res: Response) {
  const definition = await dictionaryService.getWord(
    req.params.word.toLowerCase(),
  );
  if (!definition) return notFoundResponse(req, res);

  return successfulResponse(req, res, definition, 'Definition found', 1);
}

async function searchWords(req: ApiRequest, res: Response) {
  if (!req.query.query && !req.query.letter)
    return badRequest(req, res, 'No query provided');

  if (req.query.query) {
    const words = await dictionaryService.searchWord(
      req.query.query.toLowerCase(),
    );
    if (!words) return notFoundResponse(req, res);

    return successfulResponse(req, res, words, 'Words found', words.length);
  }

  if (req.query.letter) {
    const words = await dictionaryService.getStartsWith(
      req.query.letter.toLowerCase(),
    );
    if (!words) return notFoundResponse(req, res);

    return successfulResponse(
      req,
      res,
      words.map(({ word }) => word),
      'Words found',
      words.length,
    );
  }
}

async function getStartsWith(req: ApiRequest, res: Response) {
  const definitions = await dictionaryService.getStartsWith(
    req.params.letter.toLowerCase(),
  );
  if (!definitions) return notFoundResponse(req, res);

  return successfulResponse(
    req,
    res,
    definitions,
    'Definitions found',
    definitions.length,
  );
}
async function getAllWords(req: ApiRequest, res: Response) {
  const words = await dictionaryService.getAllWords();
  if (!words) return notFoundResponse(req, res);

  return successfulResponse(req, res, words, 'Words found', words.length);
}

export default {
  getWord,
  getAllWords,
  searchWords,
  getStartsWith,
};
