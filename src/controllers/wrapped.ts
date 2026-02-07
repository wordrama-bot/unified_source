import { Response } from 'express';
import { ApiRequest } from '../types';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../utils/responses';

import wrappedService from '../services/wrapped';

async function getWordleWrappedById(req: ApiRequest, res: Response) {
  const wrapped = await wrappedService.getWordleWrappedById(req.userId);
  if (!wrapped) return notFoundResponse(req, res);

  return successfulResponse(req, res, wrapped, `Wordle Wrapped Returned`, 1);
}

export default {
  getWordleWrappedById,
};
