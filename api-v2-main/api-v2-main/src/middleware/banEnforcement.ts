import { NextFunction, Response } from 'express';
import { ApiRequest } from '../types/auth.types';
import { db } from '../models';

export async function validatePlayerNotBanned(
  req: ApiRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userId) {
      return next();
    }

    const now = new Date().toISOString();

    const { data, error } = await db
      .from('_admin_bans')
      .select('id, ban_type, ban_value, reason, expires_at')
      .eq('ban_type', 'PLAYER')
      .eq('ban_value', req.userId)
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .limit(1);

    if (error) {
      console.error('[banEnforcement] lookup error', error);
      return res.status(500).json({
        status: 500,
        count: 0,
        data: {},
        message: 'Unable to verify account status.',
      });
    }

    if (data && data.length > 0) {
      return res.status(403).json({
        status: 403,
        count: 0,
        data: {
          ban: data[0],
        },
        message: 'Account access restricted.',
      });
    }

    return next();
  } catch (error) {
    console.error('[banEnforcement] unexpected error', error);
    return res.status(500).json({
      status: 500,
      count: 0,
      data: {},
      message: 'Unable to verify account status.',
    });
  }
}
