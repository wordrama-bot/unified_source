import { db } from '../../models';

// A bounded, read-only approximation of recently active players.
// Do not count delayed result uploads or completed-game polling as presence.
const AUDIT_ROW_LIMIT = 2000;
const EXCLUDED_PATHS = [
  '/api/v3/game/wordle/result',
];

export async function getRecentlyActivePlayers() {
  const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data: audit, error } = await db
    .from('_audit')
    .select('user_id,created_at,path')
    .gte('created_at', since)
    .not('user_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(AUDIT_ROW_LIMIT);

  if (error) throw error;
  // Do not display a misleading partial count when the audit volume exceeds our cap.
  if ((audit?.length ?? 0) === AUDIT_ROW_LIMIT) {
    throw new Error('Recent activity exceeded safe query limit');
  }

  const latest = new Map<string, string>();
  for (const row of audit ?? []) {
    if (!row.user_id || !row.created_at || !row.path) continue;
    if (EXCLUDED_PATHS.some(path => row.path === path)) continue;
    if (row.path.includes('/completed-instance/')) continue;
    if (!latest.has(row.user_id)) latest.set(row.user_id, row.created_at);
  }

  const ids = Array.from(latest.keys());
  if (!ids.length) return { count: 0, players: [], windowMinutes: 5 };
  const { data: players, error: playersError } = await db
    .from('_players')
    .select('id,username,display_name')
    .in('id', ids);
  if (playersError) throw playersError;

  const result = (players ?? [])
    .map(player => ({
      playerId: player.id,
      username: player.username,
      displayName: player.display_name,
      lastActivityAt: latest.get(player.id) ?? null,
    }))
    .filter(player => player.lastActivityAt)
    .sort((a, b) => String(b.lastActivityAt).localeCompare(String(a.lastActivityAt)));

  return { count: result.length, players: result, windowMinutes: 5 };
}
