/// <reference path="../node_modules/@types/bun/index.d.ts" />
import { expect, test } from 'bun:test';
import { corsOrigin, parseAllowedOrigins, protectCookieWrites } from '../src/middleware/requestOrigin.js';
const allowed = ['https://wordrama.io'];
function check(method: string, headers: any, origins = allowed) {
  let status = 200, nextCalled = false;
  const res: any = { status(code: number) { status = code; return this; }, json() { return this; } };
  protectCookieWrites(origins)({ method, headers } as any, res, () => { nextCalled = true; });
  return { status, nextCalled };
}
test('cookie writes require trusted Origin or same-origin Referer', () => {
  for (const method of ['POST', 'PATCH', 'PUT', 'DELETE']) {
    for (const origin of [undefined, 'null', 'https://wordrama.io.evil.test']) {
      expect(check(method, { cookie: 'sb-auth=x', origin }).status).toBe(403);
    }
    expect(check(method, { cookie: 'sb-auth=x', origin: allowed[0] }).nextCalled).toBe(true);
    expect(check(method, { cookie: 'sb-auth=x', referer: allowed[0] + '/games' }).nextCalled).toBe(true);
    expect(check(method, { cookie: 'sb-auth=x', origin: 'null', referer: allowed[0] }).status).toBe(403);
  }
});
test('safe reads, cookie-free clients and explicit bearer clients still work', () => {
  expect(check('GET', { cookie: 'x' }).nextCalled).toBe(true);
  expect(check('POST', {}).nextCalled).toBe(true);
  expect(check('POST', { cookie: 'x', authorization: 'Bearer token' }).nextCalled).toBe(true);
  expect(check('POST', { cookie: 'x', authorization: 'Basic token' }).status).toBe(403);
});
test('missing config and invalid/reflected origins fail closed', () => {
  const callback = (expected: boolean) => (err: any, allow?: boolean) => {
    expect(err).toBeNull(); expect(allow).toBe(expected);
  };
  corsOrigin([])('https://wordrama.io', callback(false));
  corsOrigin(allowed)('https://evil.test', callback(false));
  corsOrigin(allowed)(allowed[0], callback(true));
  expect(check('POST', { cookie: 'x', origin: allowed[0] }, []).status).toBe(403);
  expect(parseAllowedOrigins()).toEqual([]);
  expect(parseAllowedOrigins(' https://wordrama.io,https://www.wordrama.io ')).toHaveLength(2);
  for (const bad of ['*', 'null', 'https://wordrama.io/path', 'https://user:pass@wordrama.io']) {
    expect(() => parseAllowedOrigins(bad)).toThrow();
  }
});
