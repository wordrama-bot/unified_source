import { expect, test, mock, beforeEach, afterEach } from 'bun:test';

const originalDateNow = Date.now;

const NOW = Date.parse('2026-11-28T02:00:00Z');

let audit: any[] = [];
let results: any[] = [];
let databaseError: string | null = null;

const timestamp = (secondsAgo: number) =>
  new Date(NOW - secondsAgo * 1000).toISOString();

function auditRow(player: string, secondsAgo = 60, path = '/api/v3/player/profile') {
  return {
    id: crypto.randomUUID(),
    user_id: player,
    created_at: timestamp(secondsAgo),
    path,
  };
}

function resultRow(player: string, secondsAgo = 60, overrides = {}) {
  return {
    id: crypto.randomUUID(),
    player,
    created_at: timestamp(secondsAgo),
    client_completed_at: timestamp(secondsAgo),
    effects_completed: true,
    ...overrides,
  };
}

mock.module('../src/models', () => ({
  db: {
    from(table: string) {
      let rows = table === '_audit'
        ? [...audit]
        : table === '_wordle_game_result'
          ? [...results]
          : [];

      const query = {
        select() { return this; },
        gte(field: string, value: string) {
          rows = rows.filter(row => row[field] >= value);
          return this;
        },
        lte(field: string, value: string) {
          rows = rows.filter(row => row[field] <= value);
          return this;
        },
        not(field: string) {
          rows = rows.filter(row => row[field] != null);
          return this;
        },
        order() { return this; },
        range(start: number, end: number) {
          return Promise.resolve({
            data: rows.slice(start, end + 1),
            error: databaseError ? new Error(databaseError) : null,
          });
        },
        in(_field: string, ids: string[]) {
          if (table !== '_players') {
            throw new Error('Unexpected player lookup');
          }

          return Promise.resolve({
            data: ids.map(id => ({
              id,
              username: id,
              display_name: id,
            })),
            error: null,
          });
        },
      };

      return query;
    },
  },
}));

const { getRecentlyActivePlayers } =
  await import('../src/services/admin/recentlyActivePlayers.js');

beforeEach(() => {
  audit = [];
  results = [];
  databaseError = null;
  Date.now = () => NOW;
});

afterEach(() => {
  Date.now = originalDateNow;
});

test('includes players with only persisted puzzle submissions', async () => {
  results = [resultRow('player-one')];

  const response = await getRecentlyActivePlayers();

  expect(response.count).toBe(1);
  expect(response.players[0].playerId).toBe('player-one');
});

test('preserves qualifying audit activity', async () => {
  audit = [auditRow('player-one')];

  expect((await getRecentlyActivePlayers()).count).toBe(1);
});

test('deduplicates players and retains latest activity', async () => {
  audit = [auditRow('player-one', 90)];
  results = [
    resultRow('player-one', 60),
    resultRow('player-one', 30),
    resultRow('player-two', 45),
  ];

  const response = await getRecentlyActivePlayers();

  expect(response.count).toBe(2);
  expect(response.players[0].playerId).toBe('player-one');
  expect(response.players[0].lastActivityAt).toBe(timestamp(30));
});

test('excludes result requests without persisted results', async () => {
  audit = [
    auditRow('player-one', 30, '/api/v3/game/wordle/result'),
    auditRow('player-two', 30, '/api/v3/game/wordle/result?retry=true'),
    auditRow('player-three', 30, '/api/v3/game/wordle/completed-instance/example'),
  ];

  expect((await getRecentlyActivePlayers()).count).toBe(0);
});

test('excludes delayed uploads of old completions', async () => {
  results = [
    resultRow('player-one', 30, {
      client_completed_at: timestamp(3600),
    }),
  ];

  expect((await getRecentlyActivePlayers()).count).toBe(0);
});

test('excludes results outside the five-minute window', async () => {
  results = [resultRow('player-one', 301)];

  expect((await getRecentlyActivePlayers()).count).toBe(0);
});

test('includes results exactly at the five-minute boundary', async () => {
  results = [resultRow('player-one', 300)];

  expect((await getRecentlyActivePlayers()).count).toBe(1);
});

test('includes legacy results without completion timestamps', async () => {
  results = [
    resultRow('player-one', 30, {
      client_completed_at: null,
      effects_completed: null,
    }),
  ];

  expect((await getRecentlyActivePlayers()).count).toBe(1);
});

test('excludes future and invalid completion timestamps', async () => {
  results = [
    resultRow('player-one', 30, {
      client_completed_at: timestamp(-60),
    }),
    resultRow('player-two', 30, {
      client_completed_at: 'invalid',
    }),
    resultRow('player-three', 180, {
      client_completed_at: timestamp(30),
    }),
  ];

  expect((await getRecentlyActivePlayers()).count).toBe(0);
});

test('excludes unfinished transactional effects', async () => {
  results = [
    resultRow('player-one', 30, {
      effects_completed: false,
    }),
  ];

  expect((await getRecentlyActivePlayers()).count).toBe(0);
});

test('reads more than 1000 records without truncating players', async () => {
  results = Array.from({ length: 1201 }, (_, i) =>
    resultRow(`player-${i}`),
  );

  expect((await getRecentlyActivePlayers()).count).toBe(1201);
});

test('accepts exactly the safe row limit', async () => {
  results = Array.from({ length: 2000 }, () =>
    resultRow('player-one'),
  );

  expect((await getRecentlyActivePlayers()).count).toBe(1);
});

test('rejects overflow instead of returning a partial count', async () => {
  results = Array.from({ length: 2001 }, () =>
    resultRow('player-one'),
  );

  await expect(getRecentlyActivePlayers()).rejects.toThrow(
    'Recent activity exceeded safe query limit',
  );
});

test('propagates database errors', async () => {
  databaseError = 'Mock database failure';

  await expect(getRecentlyActivePlayers()).rejects.toThrow(
    'Mock database failure',
  );
});
