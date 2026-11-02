/// <reference path="../node_modules/@types/bun/index.d.ts" />
import { beforeEach, expect, mock, test } from 'bun:test';
let player: any = { id: 'resolved-player' }, planCalls: any[] = [];
mock.module('../src/services/player', () => ({ default: { getPlayerByUserId: async () => player } }));
mock.module('../src/services/marketplaceV2/billing', () => ({
  changeSubscriptionPlan: async (args: any) => { planCalls.push(args); return { ok: true }; },
}));
mock.module('../src/services/challenge', () => ({ default: {} }));
const billing = (await import('../src/controllers/billing.js')).default;
const challenge = (await import('../src/controllers/challenge.js')).default;
const spellbee = (await import('../src/controllers/game/spellbee.js')).default;
function response() {
  return { code: 200, body: null as any,
    status(code: number) { this.code = code; return this; },
    json(body: any) { this.body = body; return this; }, end() { return this; } };
}
beforeEach(() => { player = { id: 'resolved-player' }; planCalls = []; });
test('billing plan uses resolved player and ignores injected player IDs', async () => {
  const res = response();
  await billing.changePlan({ userId: 'auth-user', body: { subscriptionKey: 'PLUS', playerId: 'victim' } } as any, res as any);
  expect(planCalls).toEqual([{ playerId: 'resolved-player', subscriptionKey: 'PLUS' }]);
  expect(res.code).toBe(200);
});
test('missing player and invalid plan never call billing', async () => {
  player = {};
  await billing.changePlan({ userId: 'auth', body: { subscriptionKey: 'PLUS' } } as any, response() as any);
  await billing.changePlan({ userId: 'auth', body: { subscriptionKey: 'ADMIN' } } as any, response() as any);
  expect(planCalls).toHaveLength(0);
});
test('challenge completion and forged progress cannot invoke persistence or rewards', async () => {
  for (const query of [{ status: 'COMPLETE', progress: '100' }, { progress: 'Infinity' }, {}]) {
    const res = response();
    await challenge.updateChallengeProgress({ query, params: { challengeId: 'anything' } } as any, res as any);
    expect(res.code).toBe(403);
  }
});
test('unverified Spellbee submissions fail closed, including plausible payloads', async () => {
  const res = response();
  await spellbee.submitSpellbeeResult({ userId: 'auth', body: {
    gameResultType: 'DAILY', middleLetters: 'a', score: 50,
    correctWords: ['area'], potentialWords: ['area'],
  } } as any, res as any);
  expect(res.code).toBe(503);
});

test('malformed Spellbee results return HTTP 400', async () => {
  for (const body of [{}, { score: Infinity }, { potentialWords: [] }]) {
    const res = response();
    await spellbee.submitSpellbeeResult({ userId: 'auth', body } as any, res as any);
    expect(res.code).toBe(400);
  }
});
