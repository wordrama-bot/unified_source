import { Response } from 'express';
import { ApiRequest } from '../../../types';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../../../utils/responses';

import stateService from '../../../services/ui/state';

async function getUiState(req: ApiRequest, res: Response) {
  const uiState = await stateService.getUiState(req.userId);
  if (!uiState) return notFoundResponse(req, res);

  return successfulResponse(req, res, uiState, '[Ui] State Found', 1);
}

async function updateUiState(req: ApiRequest, res: Response) {
  const uiState = await stateService.updateUiState(req.userId, req.body);
  if (!uiState) return notFoundResponse(req, res);

  return successfulResponse(req, res, uiState, '[Ui] State Updated', 1);
}

export default {
  getUiState,
  updateUiState,
};
