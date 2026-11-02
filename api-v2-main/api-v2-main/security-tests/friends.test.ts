/// <reference path="../node_modules/@types/bun/index.d.ts" />
import { beforeEach, expect, mock, test } from 'bun:test';
const me = '11111111-1111-4111-8111-111111111111';
const other = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
let reads = 0, inserts = 0, queues = 0;
let target: any, pending: any, friend: any, fail = false;
mock.module('../src/models', () => ({ db: { from(table: string) {
  let insert = false;
  const q: any = { select() { return q; }, eq() { return q; }, limit() { return q; },
    insert() { insert = true; inserts++; return q; },
    async maybeSingle() {
      if (insert) return { data: { id: 'request' }, error: fail ? { code: '23505' } : null };
      reads++;
      return { data: table === '_players' ? target : table === '_friend_requests' ? pending : friend, error: null };
    } };
  return q;
} } }));
mock.module('../src/utils/gameLoop', () => ({ enqueue: async () => { queues++; }, createMessage: () => ({}) }));
const service = (await import('../src/services/friends.js')).default;
beforeEach(() => { reads = inserts = queues = 0; target = { id: other }; pending = friend = null; fail = false; });
test('self and invalid IDs are rejected before database writes or reads', async () => {
  for (const id of [me, 'invalid']) expect(await service.addFriendRequest(me, id)).toHaveProperty('error');
  expect(reads).toBe(0); expect(inserts).toBe(0); expect(queues).toBe(0);
});
test('nonexistent player, duplicate requests and existing friends do not insert', async () => {
  target = null;
  expect(await service.addFriendRequest(me, other)).toHaveProperty('error');
  target = { id: other }; pending = { id: 'request' };
  expect(await service.addFriendRequest(me, other)).toHaveProperty('error');
  pending = null; friend = { id: 'friend' };
  expect(await service.addFriendRequest(me, other)).toHaveProperty('error');
  expect(inserts).toBe(0);
});
test('valid request inserts once and emits invite', async () => {
  expect(await service.addFriendRequest(me, other.toUpperCase())).toHaveProperty('id', 'request');
  expect(inserts).toBe(1); expect(queues).toBe(1);
});
test('insert failure including unique conflict does not emit invite', async () => {
  fail = true;
  expect(await service.addFriendRequest(me, other)).toHaveProperty('error');
  expect(queues).toBe(0);
});
