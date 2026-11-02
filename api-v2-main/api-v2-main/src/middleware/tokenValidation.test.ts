import { afterAll, expect, test } from 'bun:test';
import jwt from 'jsonwebtoken';
import { roles, validateToken, validateUserRole } from './tokenValidation';

const originalSupabaseSecret = process.env.SUPABASE_JWT_SECRET;
const originalJwtSecret = process.env.JWT_SECRET;
const secret = 'wordrama-local-auth-test-secret';

process.env.SUPABASE_JWT_SECRET = secret;

afterAll(() => {
  if (originalSupabaseSecret === undefined) {
    delete process.env.SUPABASE_JWT_SECRET;
  } else {
    process.env.SUPABASE_JWT_SECRET = originalSupabaseSecret;
  }

  if (originalJwtSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalJwtSecret;
  }
});

function sign(payload: Record<string, unknown>) {
  return jwt.sign(payload, secret, { algorithm: 'HS256' });
}

function runAuth(
  authorization?: string,
  cookies: Record<string, unknown> = {},
) {
  const req: any = {
    headers: authorization ? { authorization } : {},
    cookies,
  };

  let status = 200;
  let body: any;
  let nextCalled = false;

  const res: any = {
    status(code: number) {
      status = code;
      return this;
    },
    json(value: any) {
      body = value;
      return this;
    },
    end() {
      return this;
    },
  };

  validateToken(req, res, () => {
    nextCalled = true;
  });

  return { req, status, body, nextCalled };
}

function runRole(
  role: string | undefined,
  roleId: string | undefined,
  allowed: string[],
) {
  const req: any = { role, roleId };
  let status = 200;
  let nextCalled = false;

  const res: any = {
    status(code: number) {
      status = code;
      return this;
    },
    json() {
      return this;
    },
  };

  validateUserRole(allowed)(req, res, () => {
    nextCalled = true;
  });

  return { status, nextCalled };
}

const validPayload = {
  sub: 'test-player-id',
  email: 'test@example.invalid',
  user_metadata: { role: 'PLAYER' },
};

test('valid Bearer token authenticates player', () => {
  const result = runAuth(`Bearer ${sign(validPayload)}`);

  expect(result.nextCalled).toBe(true);
  expect(result.req.userId).toBe('test-player-id');
  expect(result.req.role).toBe('PLAYER');
});

test('lowercase bearer token is accepted', () => {
  const result = runAuth(`bearer ${sign(validPayload)}`);

  expect(result.nextCalled).toBe(true);
});

test('missing authorization returns 401', () => {
  const result = runAuth();

  expect(result.status).toBe(401);
  expect(result.nextCalled).toBe(false);
});

test('incorrect authorization scheme returns 401', () => {
  const result = runAuth(`Basic ${sign(validPayload)}`);

  expect(result.status).toBe(401);
  expect(result.nextCalled).toBe(false);
});

test('missing token returns 401', () => {
  const result = runAuth('Bearer');

  expect(result.status).toBe(401);
});

test('extra authorization fields return 401', () => {
  const result = runAuth(`Bearer ${sign(validPayload)} extra`);

  expect(result.status).toBe(401);
});

test('invalid JWT returns 401', () => {
  const result = runAuth('Bearer not-a-valid-jwt');

  expect(result.status).toBe(401);
});

test('expired JWT returns 401', () => {
  const token = sign({
    ...validPayload,
    exp: Math.floor(Date.now() / 1000) - 60,
  });

  const result = runAuth(`Bearer ${token}`);

  expect(result.status).toBe(401);
});

test('valid Supabase-style cookie authenticates', () => {
  const value = Buffer.from(
    JSON.stringify({
      token_type: 'bearer',
      access_token: sign(validPayload),
    }),
  ).toString('base64');

  const result = runAuth(undefined, {
    'sb-test-auth-token': `base64-${value}`,
  });

  expect(result.nextCalled).toBe(true);
});

test('malformed authentication cookie returns 401', () => {
  const value = Buffer.from('not-json').toString('base64');

  const result = runAuth(undefined, {
    'sb-test-auth-token': `base64-${value}`,
  });

  expect(result.status).toBe(401);
});

test('non-string authentication cookie returns 401', () => {
  const result = runAuth(undefined, {
    'sb-test-auth-token': { invalid: true },
  });

  expect(result.status).toBe(401);
});

test('missing JWT subject must not authenticate', () => {
  const result = runAuth(
    `Bearer ${sign({ email: 'test@example.invalid' })}`,
  );

  expect(result.nextCalled).toBe(false);
  expect(result.status).toBe(401);
});

test('allowed player role passes', () => {
  const result = runRole('PLAYER', roles.PLAYER, ['PLAYER']);

  expect(result.nextCalled).toBe(true);
});

test('missing role and role ID are forbidden', () => {
  const result = runRole(undefined, undefined, ['PLAYER']);

  expect(result.status).toBe(403);
  expect(result.nextCalled).toBe(false);
});

test('unauthorized role is forbidden', () => {
  const result = runRole('PLAYER', roles.PLAYER, ['STREAMER']);

  expect(result.status).toBe(403);
  expect(result.nextCalled).toBe(false);
});
