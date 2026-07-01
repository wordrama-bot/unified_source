import { NextFunction, Response } from 'express';
import { ApiRequest } from '../types/auth.types';
import { db } from '../models';

export async function auditAuthenticatedRequest(
  req: ApiRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    if (req.userId && req.role !== 'SERVICE_TOKEN') {
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
