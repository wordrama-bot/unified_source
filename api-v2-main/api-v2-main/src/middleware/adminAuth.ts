import { NextFunction, Response } from 'express';
import { ApiRequest } from '../types/auth.types';
import {
  getActiveAdminRole,
  hasPermission,
} from '../services/admin/roles';

export async function requireAdmin(
  req: ApiRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        status: 401,
        count: 0,
        data: {},
        message: 'Unauthorized',
      });
    }

    const adminRole = await getActiveAdminRole(req.userId);

    if (!adminRole) {
      return res.status(403).json({
        status: 403,
        count: 0,
        data: {},
        message: 'Forbidden: admin access required.',
      });
    }

    req.adminRole = adminRole.role;
    req.adminRoleId = adminRole.id;

    return next();
  } catch (error) {
    console.error('[adminAuth] requireAdmin error', error);
    return res.status(500).json({
      status: 500,
      count: 0,
      data: {},
      message: 'Unable to verify admin access.',
    });
  }
}

export function requireAdminPermission(permission: string) {
  return function (req: ApiRequest, res: Response, next: NextFunction) {
    if (!req.adminRole || !hasPermission(req.adminRole, permission)) {
      return res.status(403).json({
        status: 403,
        count: 0,
        data: {},
        message: 'Forbidden: insufficient admin permission.',
      });
    }

    return next();
  };
}
