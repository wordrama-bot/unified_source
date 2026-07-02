import { db } from '../../models';

function startOfTodayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function startOfHourIso() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return d.toISOString();
}

export async function getAdminOverview() {
  const today = startOfTodayIso();
  const hour = startOfHourIso();

  const [
    totalPlayers,
    gamesToday,
    gamesThisHour,
    registrationsToday,
    recentBans,
    activeSubscriptions,
  ] = await Promise.all([
    db.from('_players').select('id', { count: 'exact', head: true }),

    db
      .from('_wordle_game_result')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', today),

    db
      .from('_wordle_game_result')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', hour),

    db
      .from('_players')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', today),

    db
      .from('_admin_bans')
      .select('id, ban_type, ban_value, reason, created_at, expires_at, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10),

    db
      .from('_player_subscriptions')
      .select('id', { count: 'exact', head: true })
      .in('status', ['TRIALING', 'ACTIVE', 'PAST_DUE']),
  ]);

  return {
    totalPlayers: totalPlayers.count ?? 0,
    playersOnline: null,
    gamesToday: gamesToday.count ?? 0,
    gamesThisHour: gamesThisHour.count ?? 0,
    dailyRegistrations: registrationsToday.count ?? 0,
    suspiciousAccounts: 0,
    recentBans: recentBans.data ?? [],
    marketplacePurchasesToday: null,
    stripeSubscriptions: activeSubscriptions.count ?? 0,
    coinsGrantedToday: null,
    errorsRequiringReview: 0,
  };
}
