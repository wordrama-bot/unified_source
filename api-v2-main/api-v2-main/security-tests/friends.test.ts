import { beforeEach, expect, mock, test } from 'bun:test';
const me = '11111111-1111-4111-8111-111111111111';
const other = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
let calls: any[] = [], queues = 0, fail = false, queueFails = false, ack: any;
mock.module('../src/models', () => ({ db: {
  from() { throw new Error('Nontransactional friend writes forbidden'); },
  async rpc(name: string, args: any) { calls.push({name,args}); return { data: ack, error: fail ? new Error('unavailable') : null }; },
} }));
mock.module('../src/utils/gameLoop', () => ({ enqueue: async () => { queues++; if (queueFails) throw new Error('queue offline'); }, createMessage: () => ({}) }));
const service = (await import('../src/services/friends.js')).default;
beforeEach(() => { calls = []; queues = 0; fail = queueFails = false; ack = { id: other }; });
test('self and invalid invites never call database or queue', async () => {
  for (const id of [me,'invalid']) expect(await service.addFriendRequest(me,id)).toHaveProperty('error');
  expect(calls).toHaveLength(0); expect(queues).toBe(0);
});
test('invite uses one transaction, normalized IDs, and emits notification after commit', async () => {
  expect(await service.addFriendRequest(me,other.toUpperCase())).toHaveProperty('id',other);
  expect(calls).toEqual([{name:'wordrama_friend_action',args:{p_player:me,p_target:other,p_action:'invite'}}]);
  expect(queues).toBe(1);
});
test('failed or malformed invite never emits notification', async () => {
  fail = true;
  expect(await service.addFriendRequest(me,other)).toHaveProperty('error');
  fail = false; ack = {};
  expect(await service.addFriendRequest(me,other)).toHaveProperty('error');
  expect(queues).toBe(0);
});
test('notification outage preserves committed success', async () => {
  queueFails = true;
  expect(await service.addFriendRequest(me,other)).toHaveProperty('id',other);
});
test('every lifecycle action uses the atomic RPC and validates its acknowledgement', async () => {
  for (const [method,action,status] of [['acceptFriendRequest','accept','accepted'],['declineFriendRequest','decline','declined'],['cancelFriendRequest','cancel','cancelled'],['removeFriend','remove',null]] as const) {
    ack = action === 'remove' ? {id:other} : {requestId:other,status};
    expect(await (service as any)[method](me,other)).toEqual(ack);
    expect(calls.at(-1)).toEqual({name:'wordrama_friend_action',args:{p_player:me,p_target:other,p_action:action}});
    ack = {}; expect(await (service as any)[method](me,other)).toEqual({});
    ack = {requestId:me,status}; expect(await (service as any)[method](me,other)).toEqual({});
  }
});
test('invalid IDs and database failures cannot acknowledge lifecycle actions', async () => {
  for (const method of ['acceptFriendRequest','declineFriendRequest','cancelFriendRequest','removeFriend']) {
    expect(await (service as any)[method](me,'bad')).toEqual({});
  }
  expect(calls).toHaveLength(0); fail = true;
  for (const method of ['acceptFriendRequest','declineFriendRequest','cancelFriendRequest','removeFriend']) {
    expect(await (service as any)[method](me,other)).toEqual({});
  }
});
