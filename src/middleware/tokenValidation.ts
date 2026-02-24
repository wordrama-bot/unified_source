import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { type User } from '@supabase/supabase-js';
import { ApiRequest } from '../types/auth.types';

export const roles: { [key: string]: string } = {
  PLAYER: '7b4f1418-8b83-4d9e-9972-7105b3942a07',
  STREAMER: 'f1b3f3b4-1b1b-4b3b-8b3b-1b1b3b1b3b1b',
  SERVICE_TOKEN: '2542dc0c-1160-45f9-a79d-eb094379e351',
};

export function validateToken(
  req: ApiRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.query.authMethod) {
    if (req.query.authMethod !== 'SERVICE_TOKEN')
      return res.status(401).json({
        data: {},
        count: 0,
        status: 401,
        message: 'Invalid auth method',
      });
    if (!req.query.apiKey)
      return res.status(401).json({
        data: {},
        count: 0,
        status: 401,
        message: 'apiKey required',
      });
    if (
      !['jg4nbCTbqjTuqXSx7oHZ69', 'LR8Kwk32HfW9eYCamh5yPp'].includes(
        req.query.apiKey,
      )
    )
      return res.status(401).json({
        data: {},
        count: 0,
        status: 401,
        message: 'Invalid apiKey',
      });
    if (!req.query.userId)
      return res.status(400).json({
        data: {},
        count: 0,
        status: 401,
        message: 'userId required',
      });

    if (
      req.query.apiKey === 'LR8Kwk32HfW9eYCamh5yPp' &&
      req.query.action !== 'migrate'
    )
      return res.status(400).json({
        data: {},
        count: 0,
        status: 401,
        message: 'Invalid action for this apiKey',
      });

    req.userId = req.query.userId as string;
    req.userEmail = '';
    req.role = 'SERVICE_TOKEN';
    req.roleId = roles['SERVICE_TOKEN'];
    return next();
  }
  // Validate the authorization header
  let authorizationHeader = req.headers.authorization;
  let cookie = '';
  if (!authorizationHeader) {
    for (const key in req.cookies) {
      if (
        key.startsWith(`sb-${process.env.SUPABASE_PROJECT_ID}-auth-token`) &&
        !key.includes('-code-')
      ) {
        const cookieValue = req.cookies[key];

        cookie = `${cookie}${cookieValue.replace(/base64-/g, '')}`;
      }
    }

    if (cookie) {
      const decodedValue = Buffer.from(cookie, 'base64').toString();
      const parsedValue = JSON.parse(decodedValue);
      authorizationHeader = `${parsedValue.token_type} ${parsedValue.access_token}`;
    }
  }

  if (authorizationHeader) {
    const [type, token] = authorizationHeader.split(' ');
    if (type.toLowerCase() !== 'bearer' && !token) {
      return res.status(401).json({
        data: {},
        count: 0,
        status: 401,
        message: 'Unauthorized from middleware',
      });
    }
    const jwtSecret =
  (process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET) as string;

if (!jwtSecret) {
  return res.status(500).json({
    data: {},
    count: 0,
    status: 500,
    message: "Server auth misconfigured: missing JWT secret",
  });
}

let payload: User;
try {
  payload = jwt.verify(token, jwtSecret) as User;
} catch (e) {
  return res.status(401).json({
    data: {},
    count: 0,
    status: 401,
    message: "Invalid or unverifiable token",
  });
}

    // @ts-ignore
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({
        data: {},
        count: 0,
        status: 401,
        message: 'Token has expired',
      });
    }

    // @ts-ignore
    req.userId = payload?.sub;
    req.userEmail = payload?.email;
    req.role = payload?.user_metadata?.role || 'PLAYER';
    req.roleId = roles[payload?.user_metadata?.role] || roles['PLAYER'];
    return next();
  }
  return res
    .status(401)
    .json({
      data: {},
      count: 0,
      message: 'Unauthorized from middleware',
      status: 401,
    })
    .end();
}

export function validateUserRole(allowedRoles: string[]) {
  return function (req: ApiRequest, res: Response, next: NextFunction) {
    if (allowedRoles.includes(req.role) || allowedRoles.includes(req.roleId)) {
      return next();
    }
    return res.status(403).json({
      status: 403,
      count: 0,
      data: {},
      message: 'Forbidden: You do not have permission to access this resource.',
    });
  };
}
