import { NextFunction, Response } from 'express';
import { ApiRequest } from '../types/auth.types';
import { db } from '../models';

const UNAUDITED_EXACT_REQUESTS = new Set([
  'GET /api/v3/game/wordle/game-state',
  'POST /api/v3/game/wordle/game-state',
  'GET /api/v3/player/me',
  'GET /api/v3/player/me/entitlements',
  'GET /api/v3/ui/state',
  'POST /api/v3/ui/state',
]);

function shouldSkipAudit(req: ApiRequest) {
  const path = req.originalUrl.split('?')[0];
  const requestKey = `${req.method.toUpperCase()} ${path}`;

  if (UNAUDITED_EXACT_REQUESTS.has(requestKey)) {
    return true;
  }

  if (
    req.method.toUpperCase() === 'GET' &&
    path.startsWith('/api/v3/game/wordle/last-30/')
  ) {
    return true;
  }

  return false;
}

export async function auditAuthenticatedRequest(
  req: ApiRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    if (
      req.userId &&
      req.role !== 'SERVICE_TOKEN' &&
      !shouldSkipAudit(req)
    ) {
      await db.from('_audit').insert({
        user_id: req.userId,
        ip: req.ip,
        type: req.method,
        path: req.originalUrl,
        headers: {
          user_agent: req.headers['user-agent'] ?? null,
          x_forwarded_for: req.headers['x-forwarded-for'] ?? null,
        },
      });
    }
  } catch (error) {
    console.error('[requestAudit] failed to write audit row', error);
  }

  return next();
}
