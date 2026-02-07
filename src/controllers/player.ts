import { Response } from 'express';
import { ApiRequest } from '../types';
import {
  type AddPlayer,
  addPlayer as addSchema,
  type UpdatePlayer,
  updatePlayer as updateSchema,
  type UpdateSettings,
  updateSettings as updateSettingsSchema,
} from '../schema/player';
import {
  badRequest,
  notFoundResponse,
  successfulResponse,
} from '../utils/responses';

import playerService from '../services/player';

async function getPlayerProfile(req: ApiRequest, res: Response) {
  //@ts-ignore
  const player = await playerService.getPlayerByUserId(req.userId);
  if (!player || !player?.id) return notFoundResponse(req, res);

  return successfulResponse(req, res, player, 'Player found', 1);
}

async function getPublicPlayerProfile(req: ApiRequest, res: Response) {
  const { playerId } = req.params;
  if (!playerId) return badRequest(req, res, 'No player id provided');
  //@ts-ignore
  const player = await playerService.getPublicPlayerProfileByUserId(playerId);
  if (player && player.hasMigrated === false)
    return successfulResponse(req, res, player, 'Player found', 1);
  if (!player || !player?.id) return notFoundResponse(req, res);

  return successfulResponse(req, res, player, 'Player found', 1);
}

async function getPublicPlayerProfileByUsername(
  req: ApiRequest,
  res: Response,
) {
  const username = req.query.username as string;
  if (!username) return badRequest(req, res, 'No username provided');

  //@ts-ignore
  const player = await playerService.getPublicPlayerProfileByUsername(username);
  if (!player || !player?.id) return notFoundResponse(req, res);

  return successfulResponse(req, res, player, 'Player found', 1);
}

async function addPlayer(req: ApiRequest, res: Response) {
  const validated: AddPlayer = addSchema.safeParse(req.body);
  if (!validated.success) return badRequest(req, res, validated.error.message);
  else if (Object.keys(validated.data).length === 0)
    return badRequest(req, res, 'No fields to update');

  const playerExists = await playerService.getPlayerByUserId(req.userId);
  if (playerExists && playerExists?.id === req.userId)
    return badRequest(req, res, 'Player already exists');

  //@ts-ignore
  const player = await playerService.addPlayer(req.userId, {
    ...validated.data,
    role: 'PLAYER',
  });
  if (player?.id != req.userId) return notFoundResponse(req, res);

  return successfulResponse(req, res, player, 'Player Added', 1);
}

async function updatePlayer(req: ApiRequest, res: Response) {
  const validated = updateSchema.safeParse(req.body);
  if (!validated.success) return badRequest(req, res, validated.error.message);
  else if (Object.keys(validated.data).length === 0)
    return badRequest(req, res, 'No fields to update');

  //@ts-ignore
  const player = await playerService.updatePlayer(req.userId, validated.data);
  if (!player && player?.id) return notFoundResponse(req, res);

  return successfulResponse(req, res, player, 'Player Updated', 1);
}

async function updatePlayerSettings(req: ApiRequest, res: Response) {
  const validated = updateSettingsSchema.safeParse(req.body);
  if (!validated.success) return badRequest(req, res, validated.error.message);
  else if (Object.keys(validated.data).length === 0)
    return badRequest(req, res, 'No fields to update');

  //@ts-ignore
  const settings = await playerService.updatePlayerSettings(
    req.userId,
    validated.data,
  );
  if (!settings && settings?.id) return notFoundResponse(req, res);

  return successfulResponse(req, res, settings, 'Settings Updated', 1);
}

async function deletePlayer(req: ApiRequest, res: Response) {
  //@ts-ignore
  const player = await playerService.deletePlayer(req.userId);

  return successfulResponse(req, res, player, 'Player deleted', 1);
}

async function migratePlayer(req: ApiRequest, res: Response) {
  //@ts-ignore
  const player = await playerService.migratePlayer(req.userId);
  if (!player && player?.id) return notFoundResponse(req, res);

  return successfulResponse(req, res, player, 'Player Migrated', 1);
}

export default {
  getPlayerProfile,
  getPublicPlayerProfile,
  getPublicPlayerProfileByUsername,
  addPlayer,
  updatePlayer,
  updatePlayerSettings,
  deletePlayer,
  migratePlayer,
};
