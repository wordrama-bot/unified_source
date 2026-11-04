import { expect, test } from 'bun:test';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { z } from '../../api-v2-main/api-v2-main/node_modules/zod';
import { successfulResponse, unauthorizedResponse } from '../../api-v2-main/api-v2-main/src/utils/responses';

const source = ts.createSourceFile('index.ts', readFileSync(new URL(
  '../../api-v2-main/api-v2-main/src/controllers/game/wordle/index.ts', import.meta.url), 'utf8'),
  ts.ScriptTarget.Latest, true);
const fn = source.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'getCompletedInstance')!;
const js = ts.transpileModule(fn.getText(source), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
function controller(service: (player: string, id: string) => Promise<any>) {
  return new Function('z', 'gameService', 'successfulResponse', 'unauthorizedResponse',
    `${js}; return getCompletedInstance;`)(z, { getCompletedInstance: service }, successfulResponse, unauthorizedResponse);
}
function response() {
  return { code: 200, body: null as any, headers: {} as any,
    status(code: number) { this.code = code; return this; },
    set(key: string, value: string) { this.headers[key] = value; return this; },
    json(body: any) { this.body = body; return this; },
    send(body: any) { this.body = body; return this; }, end() { return this; } };
}
const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
test('completion endpoint rejects missing auth and malformed IDs before accessing data', async () => {
  let calls = 0;
  const handler = controller(async () => { calls++; return null; });
  const unauthorized = response(); await handler({ params: { gameInstanceId: id } }, unauthorized);
  expect(unauthorized.code).toBe(401);
  const invalid = response(); await handler({ userId: 'actor', params: { gameInstanceId: 'bad' } }, invalid);
  expect(invalid.code).toBe(400); expect(calls).toBe(0);
});
test('negative completion answers are authenticated, explicit and not cacheable', async () => {
  const handler = controller(async (player, instance) => {
    expect(player).toBe('actor'); expect(instance).toBe(id); return null;
  });
  const res = response();
  await handler({ userId: 'actor', params: { gameInstanceId: id }, query: { player: 'victim' } }, res);
  expect(res.code).toBe(200); expect(res.body.data).toBeNull();
  expect(res.headers['Cache-Control']).toBe('no-store');
});
test('database failure cannot masquerade as an unplayed puzzle', async () => {
  const res = response();
  await controller(async () => { throw new Error('unavailable'); })({ userId: 'actor', params: { gameInstanceId: id } }, res);
  expect(res.code).toBe(503); expect(res.body.data).toBeUndefined();
});
