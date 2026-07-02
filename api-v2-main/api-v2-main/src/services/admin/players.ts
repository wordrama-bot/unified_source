import { db } from '../../models';

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function searchPlayers(query: string, limit = 20) {
  const q = query.trim();

  if (!q) return [];

  const safeLimit = Math.min(Math.max(limit, 1), 50);

  const filters = [
    `username.ilike.%${q}%`,
    `display_name.ilike.%${q}%`,
  ];

  if (isUuid(q)) {
    filters.push(`id.eq.${q}`);
  }

  const { data, error } = await db
    .from('_players')
    .select(`
      id,
      username,
      display_name,
      created_at,
      discord_connected,
      _discord_link (
        username,
        user_id
      )
    `)
    .or(filters.join(','))
    .order('created_at', { ascending: false })
    .limit(safeLimit);

  if (error) {
    console.error('[admin.players] searchPlayers error', error);
    throw new Error('Unable to search players.');
  }

  return data ?? [];
}

export async function getPlayerAdminProfile(playerId: string) {
  const [
    identity,
    streaks,
    coinBalance,
    coinLedger,
    entitlements,
    subscriptions,
    moderationActions,
    auditHistory,
    activePlayerBans,
    recentGames,
    gameCount,
    winCount,
  ] = await Promise.all([
    db
      .from('_players')
      .select(`
        id,
        username,
        display_name,
        first_name,
        last_name,
        profile_image,
        discord_connected,
        created_at,
        _discord_link (
          username,
          user_id,
          code,
          created_at
        )
      `)
      .eq('id', playerId)
      .maybeSingle(),

    db
      .from('_wordle_streak')
      .select('*')
      .eq('player', playerId),

    db
      .from('_player_coin_balances')
      .select('*')
      .eq('player_id', playerId),

    db
      .from('_coin_ledger')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false })
      .limit(25),

    db
      .from('_player_entitlements')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false }),

    db
      .from('_player_subscriptions')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false }),

    db
      .from('_moderation_actions')
      .select('*')
      .eq('target_user_id', playerId)
      .order('performed_at', { ascending: false })
      .limit(50),

    db
      .from('_audit')
      .select('id, created_at, user_id, ip, type, path, headers')
      .eq('user_id', playerId)
      .order('created_at', { ascending: false })
      .limit(50),

    db
      .from('_admin_bans')
      .select('*')
      .eq('ban_type', 'PLAYER')
      .eq('ban_value', playerId)
      .eq('is_active', true),

    db
      .from('_wordle_game_result')
      .select('id, created_at, word_length, guess_count, solution, game_was_won, game_was_hard_mode, type, day, month, year, week, word_pack')
      .eq('player', playerId)
      .order('created_at', { ascending: false })
      .limit(25),

    db
      .from('_wordle_game_result')
      .select('id', { count: 'exact', head: true })
      .eq('player', playerId),

    db
      .from('_wordle_game_result')
      .select('id', { count: 'exact', head: true })
      .eq('player', playerId)
      .eq('game_was_won', true),
  ]);

  if (identity.error) {
    console.error('[admin.players] identity error', identity.error);
    throw new Error('Unable to load player profile.');
  }

  if (!identity.data) {
    return null;
  }

  const { data: authUserData } = await db.auth.admin.getUserById(playerId);

  const discordLink = Array.isArray(identity.data._discord_link)
    ? identity.data._discord_link[0]
    : identity.data._discord_link;

  const authUser = authUserData?.user;

  const email = authUser?.email ?? null;

  const authProvider = authUser?.app_metadata?.provider;

  const discordId =
    discordLink?.user_id ??
    authUser?.user_metadata?.provider_id ??
    (
      authProvider === 'discord'
        ? authUser?.user_metadata?.sub
        : null
    ) ??
    null;

  const recentIps = Array.from(
    new Set(
      (auditHistory.data ?? [])
        .map((row: any) => row.ip)
        .filter(Boolean),
    ),
  ).slice(0, 10);

  const banTargets = {
    playerId,
    username: identity.data.username,
    displayName: identity.data.display_name,
    email,
    discordId,
    recentIps,
  };

  const authIdentity = {
    email,
    provider: authUser?.app_metadata?.provider ?? null,
    providers: authUser?.app_metadata?.providers ?? [],
    discordId,
    discordUsername:
      authUser?.user_metadata?.full_name ??
      authUser?.user_metadata?.name ??
      null,
    discordGlobalName:
      authUser?.user_metadata?.custom_claims?.global_name ??
      null,
    discordAvatar:
      authUser?.user_metadata?.avatar_url ??
      authUser?.user_metadata?.picture ??
      null,
  };

  const gamesPlayed = gameCount.count ?? 0;
  const wins = winCount.count ?? 0;

  return {
    identity: identity.data,
    authIdentity,
    banTargets,
    gameplaySummary: {
      gamesPlayed,
      wins,
      losses: Math.max(gamesPlayed - wins, 0),
      winPercentage: gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 10000) / 100 : 0,
    },
    streaks: streaks.data ?? [],
    coinBalance: coinBalance.data ?? [],
    coinLedger: coinLedger.data ?? [],
    entitlements: entitlements.data ?? [],
    subscriptions: subscriptions.data ?? [],
    moderationActions: moderationActions.data ?? [],
    auditHistory: auditHistory.data ?? [],
    activeBans: activePlayerBans.data ?? [],
    recentGames: recentGames.data ?? [],
  };
}
