import { db } from '../../models';

const WINDOW_MINUTES = 5;
const WINDOW_MS = WINDOW_MINUTES * 60 * 1000;
const CLOCK_SKEW_MS = 2 * 60 * 1000;
const ROW_LIMIT = 2000;
const PAGE_SIZE = 500;
const PLAYER_BATCH_SIZE = 100;

type AuditRow = {
  id: string;
  user_id: string | null;
  created_at: string;
  path: string | null;
};

type ResultRow = {
  id: string;
  player: string | null;
  created_at: string;
  client_completed_at: string | null;
  effects_completed: boolean | null;
};

async function readRecentRows<T>(
  fetchPage: (offset: number) => PromiseLike<{
    data: T[] | null;
    error: unknown;
  }>,
): Promise<T[]> {
  const rows: T[] = [];

  while (true) {
    const { data, error } = await fetchPage(rows.length);
    if (error) throw error;

    const batch = data ?? [];
    if (!batch.length) return rows;

    rows.push(...batch);

    if (rows.length > ROW_LIMIT) {
      throw new Error('Recent activity exceeded safe query limit');
    }
  }
}

export async function getRecentlyActivePlayers() {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const since = new Date(cutoff).toISOString();
  const until = new Date(now).toISOString();

  const [audit, results] = await Promise.all([
    readRecentRows<AuditRow>(offset =>
      db
        .from('_audit')
        .select('id,user_id,created_at,path')
        .gte('created_at', since)
        .lte('created_at', until)
        .not('user_id', 'is', null)
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1),
    ),
    readRecentRows<ResultRow>(offset =>
      db
        .from('_wordle_game_result')
        .select('id,player,created_at,client_completed_at,effects_completed')
        .gte('created_at', since)
        .lte('created_at', until)
        .not('player', 'is', null)
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1),
    ),
  ]);

  const latest = new Map<string, number>();

  function recordActivity(playerId: string, timestamp: number) {
    if (!Number.isFinite(timestamp)) return;
    if (timestamp < cutoff || timestamp > now) return;

    const previous = latest.get(playerId);
    if (previous === undefined || timestamp > previous) {
      latest.set(playerId, timestamp);
    }
  }

  // Preserve existing qualifying API activity. Result requests
  // and completed-instance polling are not evidence of completion.
  for (const row of audit) {
    if (!row.user_id || !row.path || !row.created_at) continue;

    const path = row.path.split('?')[0];

    if (path === '/api/v3/game/wordle/result') continue;
    if (path.includes('/completed-instance/')) continue;

    recordActivity(row.user_id, Date.parse(row.created_at));
  }

  // Persisted results cover gameplay that bypasses qualifying
  // audit activity, including continuous Infinite mode sessions.
  for (const row of results) {
    if (!row.player || !row.created_at) continue;
    if (row.effects_completed === false) continue;

    const receivedAt = Date.parse(row.created_at);
    if (!Number.isFinite(receivedAt)) continue;

    // Legacy results without completion metadata use receipt time.
    if (row.client_completed_at === null) {
      recordActivity(row.player, receivedAt);
      continue;
    }

    const completedAt = Date.parse(row.client_completed_at);

    if (!Number.isFinite(completedAt)) continue;
    if (completedAt > now || completedAt > receivedAt + CLOCK_SKEW_MS) continue;

    // Delayed uploads of old puzzles do not establish presence.
    recordActivity(row.player, Math.min(completedAt, receivedAt));
  }

  const ids = Array.from(latest.keys());

  if (!ids.length) {
    return { count: 0, players: [], windowMinutes: WINDOW_MINUTES };
  }

  const result: {
    playerId: string;
    username: string | null;
    displayName: string | null;
    lastActivityAt: string;
  }[] = [];

  for (let offset = 0; offset < ids.length; offset += PLAYER_BATCH_SIZE) {
    const { data: players, error } = await db
      .from('_players')
      .select('id,username,display_name')
      .in('id', ids.slice(offset, offset + PLAYER_BATCH_SIZE));

    if (error) throw error;

    for (const player of players ?? []) {
      const activityAt = latest.get(player.id);
      if (activityAt === undefined) continue;

      result.push({
        playerId: player.id,
        username: player.username,
        displayName: player.display_name,
        lastActivityAt: new Date(activityAt).toISOString(),
      });
    }
  }

  result.sort(
    (a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt),
  );

  return {
    count: result.length,
    players: result,
    windowMinutes: WINDOW_MINUTES,
  };
}
