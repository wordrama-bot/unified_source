import { Response } from 'express';
import { ApiRequest } from '../types/auth.types';
import { getPermissions } from '../services/admin/roles';
import { getAdminOverview } from '../services/admin/overview';
import {
  getPlayerAdminProfile,
  searchPlayers,
} from '../services/admin/players';
import {
  addModeratorNote,
  getModeratorNotes,
} from '../services/admin/notes';
import { grantPlayerCoins } from '../services/admin/coins';
import {
  banPlayer,
  unbanPlayer,
} from '../services/admin/bans';
import {
  adminGrantEntitlement,
  getPlayerEntitlements,
  previewAdminGrantEntitlement,
} from '../services/marketplaceV2/entitlements';
import { getCatalogItems } from '../services/marketplaceV2/catalog';
import { getSuspiciousGameplay } from '../services/admin/suspiciousGameplay';

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

async function playerNotes(req: ApiRequest, res: Response) {
  const { playerId } = req.params;

  const data = await getModeratorNotes(playerId);

  return res.status(200).json({
    status: 200,
    count: data.length,
    data,
    message: 'Moderator notes loaded',
  });
}

async function createPlayerNote(req: ApiRequest, res: Response) {
  const { playerId } = req.params;
  const { note } = req.body;

  if (!req.userId) {
    return res.status(401).json({
      status: 401,
      count: 0,
      data: {},
      message: 'Unauthorized',
    });
  }

  const data = await addModeratorNote({
    targetPlayerId: playerId,
    adminPlayerId: req.userId,
    note: String(note ?? ''),
    requestIp: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.status(201).json({
    status: 201,
    count: 1,
    data,
    message: 'Moderator note added',
  });
}

async function grantCoins(req: ApiRequest, res: Response) {
  const { playerId } = req.params;
  const { amount, reason } = req.body;

  if (!req.userId) {
    return res.status(401).json({
      status: 401,
      count: 0,
      data: {},
      message: 'Unauthorized',
    });
  }

  const data = await grantPlayerCoins({
    targetPlayerId: playerId,
    adminPlayerId: req.userId,
    amount: Number(amount),
    reason: String(reason ?? ''),
    requestIp: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.status(201).json({
    status: 201,
    count: 1,
    data,
    message: 'Coins granted',
  });
}

async function banPlayerAccount(req: ApiRequest, res: Response) {
  const { playerId } = req.params;
  const { reason, notes, expiresAt, banTargets } = req.body;

  if (!req.userId) {
    return res.status(401).json({
      status: 401,
      count: 0,
      data: {},
      message: 'Unauthorized',
    });
  }

  const data = await banPlayer({
    targetPlayerId: playerId,
    adminPlayerId: req.userId,
    reason: String(reason ?? ''),
    notes: notes ? String(notes) : undefined,
    expiresAt: expiresAt ? String(expiresAt) : null,
    requestIp: req.ip,
    userAgent: req.headers['user-agent'],
    banTargets: Array.isArray(banTargets) ? banTargets : undefined,
  });

  return res.status(201).json({
    status: 201,
    count: 1,
    data,
    message: 'Player banned',
  });
}

async function unbanPlayerAccount(req: ApiRequest, res: Response) {
  const { playerId } = req.params;
  const { reason } = req.body;

  if (!req.userId) {
    return res.status(401).json({
      status: 401,
      count: 0,
      data: {},
      message: 'Unauthorized',
    });
  }

  const data = await unbanPlayer({
    targetPlayerId: playerId,
    adminPlayerId: req.userId,
    reason: String(reason ?? ''),
    requestIp: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.status(200).json({
    status: 200,
    count: data.length,
    data,
    message: 'Player unbanned',
  });
}

async function playerEntitlements(req: ApiRequest, res: Response) {
  const { playerId } = req.params;

  const data = await getPlayerEntitlements(playerId, {
    includeInactive: true,
  });

  return res.status(200).json({
    status: 200,
    count: data.length,
    data,
    message: 'Player entitlements loaded',
  });
}

async function catalog(req: ApiRequest, res: Response) {
  const data = getCatalogItems();

  return res.status(200).json({
    status: 200,
    count: data.length,
    data,
    message: 'Marketplace catalog loaded',
  });
}

async function previewGrantEntitlement(req: ApiRequest, res: Response) {
  const { playerId } = req.params;
  const { catalogItemId, expiresAt } = req.body;

  const data = await previewAdminGrantEntitlement({
    playerId,
    catalogItemId: String(catalogItemId ?? ''),
    expiresAt: expiresAt ? String(expiresAt) : null,
  });

  return res.status(200).json({
    status: 200,
    count: 1,
    data,
    message: 'Entitlement grant preview loaded',
  });
}

async function grantEntitlement(req: ApiRequest, res: Response) {
  const { playerId } = req.params;
  const { catalogItemId, reason, expiresAt } = req.body;

  if (!req.userId) {
    return res.status(401).json({
      status: 401,
      count: 0,
      data: {},
      message: 'Unauthorized',
    });
  }

  const data = await adminGrantEntitlement({
    playerId,
    adminPlayerId: req.userId,
    catalogItemId: String(catalogItemId ?? ''),
    reason: String(reason ?? ''),
    expiresAt: expiresAt ? String(expiresAt) : null,
    requestIp: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.status(201).json({
    status: 201,
    count: 1,
    data,
    message: 'Entitlement granted',
  });
}

async function suspiciousGameplay(req, res) {
  const data = await getSuspiciousGameplay();

  return res.status(200).json({
    message: 'Suspicious gameplay review queue loaded',
    data,
  });
}

export default {
  me,
  overview,
  playerSearch,
  playerProfile,
  playerNotes,
  createPlayerNote,
  grantCoins,
  banPlayerAccount,
  unbanPlayerAccount,
  playerEntitlements,
  catalog,
  previewGrantEntitlement,
  grantEntitlement,
  suspiciousGameplay,
};
