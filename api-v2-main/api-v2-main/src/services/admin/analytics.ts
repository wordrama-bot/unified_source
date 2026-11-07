import { DateTime } from 'luxon';
import { db } from '../../models';

const ZONE = 'America/New_York';
const PAGE_SIZE = 1000;
const MAX_ROWS = 30000;
const CACHE_MS = 5 * 60 * 1000;

type DailyRow = {
  date: string;
  registrations: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  activePlayers: number;
};

const cache = new Map<number, { expires: number; result: any }>();

export async function getAdminAnalytics(days: number) {
  if (![7, 30, 90].includes(days)) throw new Error('Unsupported analytics range');

  const cached = cache.get(days);
  if (cached && cached.expires > Date.now()) return cached.result;

  const today = DateTime.now().setZone(ZONE).startOf('day');
  const start = today.minus({ days: days - 1 });
  const end = today.plus({ days: 1 });
  const rows = new Map<string, DailyRow>();

  for (let i = 0; i < days; i++) {
    const date = start.plus({ days: i }).toISODate()!;
    rows.set(date, { date, registrations: 0, gamesPlayed: 0, wins: 0, losses: 0, activePlayers: 0 });
  }

  // Limit the materialized-view query to calendar months in the requested range.
  const months: string[] = [];
  for (let m = start.startOf('month'); m < end; m = m.plus({ months: 1 })) {
    months.push(`and(year.eq.${m.year},month.eq.${m.month})`);
  }

  let offset = 0;
  do {
    const { data, error } = await db
      .from('_mv_wordle_daily_leaderboard')
      .select('year,month,day,games_played,games_won,games_lost')
      .or(months.join(','))
      .order('year', { ascending: true })
      .order('month', { ascending: true })
      .order('day', { ascending: true })
      .order('player', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) throw new Error('Unable to retrieve daily gameplay analytics');
    const batch = data ?? [];

    for (const item of batch) {
      const date = `${item.year}-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
      const row = rows.get(date);
      if (!row) continue;
      const played = Number(item.games_played) || 0;
      row.gamesPlayed += played;
      row.wins += Number(item.games_won) || 0;
      row.losses += Number(item.games_lost) || 0;
      if (played > 0) row.activePlayers++;
    }

    offset += batch.length;
    if (batch.length < PAGE_SIZE) break;
    if (offset >= MAX_ROWS) throw new Error('Analytics range exceeds safe row limit');
  } while (true);

  // Registration timestamps are stored in UTC; bucket them in the admin timezone.
  const { data: registrations, error: registrationError } = await db
    .from('_players')
    .select('created_at')
    .gte('created_at', start.toUTC().toISO()!)
    .lt('created_at', end.toUTC().toISO()!)
    .limit(MAX_ROWS + 1);

  if (registrationError) throw new Error('Unable to retrieve registration analytics');
  if ((registrations ?? []).length > MAX_ROWS) throw new Error('Registration range exceeds safe row limit');

  for (const player of registrations ?? []) {
    const date = DateTime.fromISO(player.created_at).setZone(ZONE).toISODate();
    if (date && rows.has(date)) rows.get(date)!.registrations++;
  }

  const daily = Array.from(rows.values());
  const totals = daily.reduce((sum, day) => ({
    registrations: sum.registrations + day.registrations,
    gamesPlayed: sum.gamesPlayed + day.gamesPlayed,
    wins: sum.wins + day.wins,
    losses: sum.losses + day.losses,
  }), { registrations: 0, gamesPlayed: 0, wins: 0, losses: 0 });

  const result = {
    days,
    timezone: ZONE,
    source: 'Existing daily leaderboard materialized view',
    generatedAt: new Date().toISOString(),
    daily,
    totals,
  };
  cache.set(days, { expires: Date.now() + CACHE_MS, result });
  return result;
}
