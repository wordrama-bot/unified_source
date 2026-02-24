import { Response } from 'express';
import { ApiRequest } from '../../../types';
import { successfulResponse } from '../../../utils/responses';

import stateService from '../../../services/ui/state';

async function getUiState(req: ApiRequest, res: Response) {
  const uiState = await stateService.getUiState(req.userId);
  return successfulResponse(req, res, uiState || {}, '[Ui] State', 1);
}

async function updateUiState(req: ApiRequest, res: Response) {
  const uiState = await stateService.updateUiState(req.userId, req.body);
  return successfulResponse(req, res, uiState || {}, '[Ui] State Updated', 1);
}

export default {
  getUiState,
  updateUiState,
};