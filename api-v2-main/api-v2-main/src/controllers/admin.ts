import { Response } from 'express';
import { ApiRequest } from '../types/auth.types';
import { getPermissions } from '../services/admin/roles';
import { getAdminOverview } from '../services/admin/overview';
import {
  getPlayerAdminProfile,
  searchPlayers,
} from '../services/admin/players';

async function me(req: ApiRequest, res: Response) {
  return res.status(200).json({
    status: 200,
    count: 1,
    data: {
      playerId: req.userId,
      role: req.adminRole,
      permissions: getPermissions(req.adminRole ?? ''),
    },
    message: 'Admin profile loaded',
  });
}

async function overview(req: ApiRequest, res: Response) {
  const data = await getAdminOverview();

  return res.status(200).json({
    status: 200,
    count: 1,
    data,
    message: 'Admin overview loaded',
  });
}

async function playerSearch(req: ApiRequest, res: Response) {
  const q = String(req.query.q ?? '');
  const limit = Number(req.query.limit ?? 20);

  const data = await searchPlayers(q, limit);

  return res.status(200).json({
    status: 200,
    count: data.length,
    data,
    message: 'Player search complete',
  });
}

async function playerProfile(req: ApiRequest, res: Response) {
  const { playerId } = req.params;

  const data = await getPlayerAdminProfile(playerId);

  if (!data) {
    return res.status(404).json({
      status: 404,
      count: 0,
      data: {},
      message: 'Player not found',
    });
  }

  return res.status(200).json({
    status: 200,
    count: 1,
    data,
    message: 'Player admin profile loaded',
  });
}

export default {
  me,
  overview,
  playerSearch,
  playerProfile,
};
