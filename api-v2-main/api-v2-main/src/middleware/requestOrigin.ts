import type { Request, Response, NextFunction } from 'express';

export function parseAllowedOrigins(value = ''): string[] {
  return value.split(',').map((s) => s.trim()).filter(Boolean).map((origin) => {
    const url = new URL(origin);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) {
      throw new Error('CORS_ORIGIN must contain exact HTTP(S) origins');
    }
    return origin;
  });
}

export function corsOrigin(allowed: string[]) {
  return (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    // No implicit wildcard when configuration is absent, in any environment.
    callback(null, !origin || allowed.includes(origin));
  };
}

export function protectCookieWrites(allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    // Explicit bearer authentication does not fall back to cookies in validateToken.
    if (/^Bearer\s+\S+$/i.test(req.headers.authorization || '')) return next();
    if (!req.headers.cookie) return next();

    const origin = req.headers.origin;
    if (typeof origin === 'string' && allowed.includes(origin)) return next();
    // Older same-origin browsers may supply Referer but no Origin. A literal
    // Origin:null must never be rescued by Referer.
    if (origin === undefined && req.headers.referer) {
      try {
        if (allowed.includes(new URL(req.headers.referer).origin)) return next();
      } catch { /* Invalid referrers fail closed. */ }
    }
    return res.status(403).json({ status: 403, count: 0, data: {}, message: 'Untrusted request origin' });
  };
}
