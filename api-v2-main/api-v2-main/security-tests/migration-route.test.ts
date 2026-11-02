import { afterAll, expect, mock, test } from 'bun:test';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { protectCookieWrites } from '../src/middleware/requestOrigin.js';
let writes = 0;
mock.module('../src/controllers/player', () => ({ default: {
  migratePlayer: (_req: any,res: any) => { writes++; res.json({ok:true}); },
  addPlayer: (_req: any,res: any) => res.json({ok:true}),
} }));
mock.module('../src/controllers/accountDeletionFeedback', () => ({ default: {create: (_req: any,res: any) => res.json({ok:true})} }));
process.env.SUPABASE_PROJECT_ID = 'test'; process.env.SUPABASE_JWT_SECRET = 'route-test-secret';
const { router } = await import('../src/routes/v3/noRole.js');
const app = express(); app.use(cookieParser()); app.use('/api/v3',protectCookieWrites(['http://localhost:3000']),router);
const server = app.listen(0,'127.0.0.1');
await new Promise<void>(resolve => server.once('listening',resolve));
const base = `http://127.0.0.1:${(server.address() as any).port}/api/v3/migrate/me`;
const token = jwt.sign({sub:'user',aud:'authenticated',role:'authenticated'},process.env.SUPABASE_JWT_SECRET,{expiresIn:'5m'});
const cookie = 'sb-test-auth-token=base64-'+Buffer.from(JSON.stringify({token_type:'bearer',access_token:token})).toString('base64');
afterAll(() => new Promise<void>(resolve => server.close(() => resolve())));
test('GET and HEAD cannot migrate even with valid authentication', async () => {
  for (const method of ['GET','HEAD']) {
    const response = await fetch(base,{method,headers:{Authorization:`Bearer ${token}`}});
    expect(response.status).toBe(405); expect(response.headers.get('Allow')).toBe('POST');
  }
  expect(writes).toBe(0);
});
test('POST requires authentication and trusted cookie origin; bearer remains supported', async () => {
  expect((await fetch(base,{method:'POST'})).status).toBe(401);
  for (const origin of ['https://evil.example','null']) {
    expect((await fetch(base,{method:'POST',headers:{cookie,origin}})).status).toBe(403);
  }
  expect((await fetch(base,{method:'POST',headers:{cookie}})).status).toBe(403);
  expect(writes).toBe(0);
  expect((await fetch(base,{method:'POST',headers:{cookie,origin:'http://localhost:3000'}})).status).toBe(200);
  expect((await fetch(base,{method:'POST',headers:{Authorization:`Bearer ${token}`}})).status).toBe(200);
  expect(writes).toBe(2);
});
