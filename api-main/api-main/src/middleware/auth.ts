import { UserToken } from 'src/api/v1/auth/auth.types';
import jwt_decode from 'jwt-decode';
import { Request, Response, NextFunction } from 'express';

export type RequestWithUserId = Request & { userId: string };

export async function authWithSupabaseJWT(req: RequestWithUserId, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({
      status: 401,
      statusText: 'Token missing or malformed'
    });

    const [method, token] = authorization.split(' ');
    if (method.toLowerCase() !== 'bearer' || !token) return res.status(401).json({
      status: 401,
      statusText: 'Token missing or malformed'
    });

    const decodedToken: UserToken = await jwt_decode(token);
    if (decodedToken.exp < Math.floor(Date.now() / 1000)) return res.status(401).json({
      status: 401,
      statusText: 'Token has expired'
    }); 

    req.userId = decodedToken.sub;
    return next();
}
