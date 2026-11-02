/// <reference path="../node_modules/@types/bun/index.d.ts" />
import { beforeEach, expect, mock, test } from 'bun:test';
let calls: any[] = [], fail = false, frames = 0;
mock.module('../src/models', () => ({ db: { async rpc(name: string, args: any) {
  calls.push({ name, args });
  return { data: { id: 'progress', status: 'COMPLETE', progress: 100, prestige: 1 }, error: fail ? new Error('transaction failed') : null };
} } }));
mock.module('../src/services/prestigeFrames', () => ({ awardPrestigeFrames: async () => { frames++; } }));
const progress = (await import('../src/services/challenge/progress.js')).default;
beforeEach(() => { calls = []; fail = false; frames = 0; });
test('trusted award uses transactional RPC and preserves prestige frame grant', async () => {
  expect(await progress.updateChallengeProgress('challenge', 'player', 'COMPLETE', 100)).toHaveProperty('status', 'COMPLETE');
  expect(calls).toEqual([{ name: 'wordrama_update_challenge_progress', args: { p_challenge: 'challenge', p_player: 'player', p_status: 'COMPLETE', p_progress: 100 } }]);
  expect(frames).toBe(1);
});
test('invalid or inconsistent progress never calls RPC', async () => {
  for (const [status, value] of [['BAD', 0], ['COMPLETE', 90], ['IN_PROGRESS', 100], ['COMPLETE', Infinity]]) {
    await expect(progress.updateChallengeProgress('challenge', 'player', String(status), Number(value))).rejects.toThrow();
  }
  expect(calls).toHaveLength(0);
});
test('transaction failure is not acknowledged or followed by frame grant', async () => {
  fail = true;
  await expect(progress.updateChallengeProgress('challenge', 'player', 'COMPLETE', 100)).rejects.toThrow();
  expect(frames).toBe(0);
});
