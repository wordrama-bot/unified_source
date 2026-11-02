// Each suite gets an isolated process because Bun module mocks are process-wide.
const suites = ['origin', 'controllers', 'friends', 'store', 'challenge', 'entitlements', 'migration-route', 'friend-controllers'];
for (const name of suites) {
  const proc = Bun.spawn([process.execPath, 'test', `security-tests/${name}.test.ts`], {
    cwd: new URL('..', import.meta.url).pathname,
    stdout: 'inherit', stderr: 'inherit',
  });
  if (await proc.exited !== 0) process.exit(1);
}
