import { Response } from 'express';
import { ApiRequest } from '../types';
import {
  type UpdateStreamerSettings,
  updateStreamerSettings as updateStreamerSettingsSchema,
} from '../schema/streamer';
import { 
  badRequest,
  notFoundResponse,
  successfulResponse
} from '../utils/responses';

import streamerService from '../services/streamer';

async function updateSettings(req: ApiRequest, res: Response) {
  const validated = updateStreamerSettingsSchema.safeParse(req.body);
  if (!validated.success) return badRequest(req, res, validated.error.message);
  else if (Object.keys(validated.data).length === 0) return badRequest(req, res, 'No fields to update');
  
  //@ts-ignore
  const settings = await streamerService.updateSettings(req.userId, validated.data);
  if (!settings && settings?.id) return notFoundResponse(req, res);

  return successfulResponse(req, res, settings, 'Settings Updated', 1);
}

export default {
  updateSettings
};
