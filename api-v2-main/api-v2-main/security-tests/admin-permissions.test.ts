/// <reference path="../node_modules/@types/bun/index.d.ts" />
import { expect, test, mock } from 'bun:test';

mock.module('../src/models', () => ({
  db: { from() { throw new Error('Admin permission checks must not access the database'); } },
}));

const { getPermissions, hasPermission } = await import('../src/services/admin/roles');
const { requireAdminPermission } = await import('../src/middleware/adminAuth');

test('admin roles enforce least privilege for sensitive operations', () => {
  expect(hasPermission('SUPER_ADMIN', 'economy:write')).toBe(true);
  expect(hasPermission('ADMINISTRATOR', 'economy:write')).toBe(true);
  expect(hasPermission('ADMINISTRATOR', 'players:live-monitor')).toBe(true);
  for (const role of ['MODERATOR', 'SUPPORT', 'READ_ONLY', 'UNKNOWN', '']) {
    expect(hasPermission(role, 'economy:write')).toBe(false);
    expect(hasPermission(role, 'players:live-monitor')).toBe(false);
  }
  expect(hasPermission('MODERATOR', 'moderation:write')).toBe(true);
  expect(hasPermission('SUPPORT', 'support:write')).toBe(true);
  expect(hasPermission('READ_ONLY', 'moderation:write')).toBe(false);
  expect(hasPermission('READ_ONLY', 'players:read')).toBe(true);
  expect(getPermissions('UNKNOWN')).toEqual([]);
});

test('permission middleware denies missing or insufficient role without invoking handler', () => {
  for (const role of [undefined, 'READ_ONLY', 'MODERATOR', 'SUPPORT']) {
    let status = 200;
    let nextCalled = false;
    const res: any = {
      status(code: number) { status = code; return this; },
      json() { return this; },
    };
    requireAdminPermission('economy:write')({ adminRole: role } as any, res, () => { nextCalled = true; });
    expect(status).toBe(403);
    expect(nextCalled).toBe(false);
  }
  let nextCalled = false;
  const res: any = { status() { throw new Error('Unexpected denial'); }, json() { return this; } };
  requireAdminPermission('economy:write')({ adminRole: 'ADMINISTRATOR' } as any, res, () => { nextCalled = true; });
  expect(nextCalled).toBe(true);
});
