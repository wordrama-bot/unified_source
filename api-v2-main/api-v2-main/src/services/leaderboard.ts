import * as changeKeys from 'change-case/keys';
import { db } from '../models';
import moment from 'moment-timezone';
import { isWordramaOwner } from '../config/owner';

const ALLOWED_ORDER_COLUMNS = new Set([
  'alltime_rank',
  'yearly_rank',
  'monthly_rank',
  'weekly_rank',
  'daily_rank',

  'alltime_rank_three_letter',
  'alltime_rank_three_letter_crazy',
  'alltime_rank_five_letter_unhinged',
  'alltime_rank_4_letter',
  'alltime_rank_5_letter',
  'alltime_rank_five_letter_crazy',
  'alltime_rank_6_letter',
  'alltime_rank_7_letter',
  'alltime_rank_8_letter',
  'alltime_rank_9_letter',
  'alltime_rank_10_letter',
  'alltime_rank_11_letter',
  'alltime_rank_11_letter_extended',
  'alltime_rank_12_letter',
  'alltime_rank_13_letter',
  'alltime_rank_14_letter',
  'alltime_rank_15_letter',
  'alltime_rank_16_letter',
  'alltime_rank_17_letter',
  'alltime_rank_18_letter',
  'alltime_rank_19_letter',
  'alltime_rank_20_letter',
  'alltime_rank_21_letter',
  'alltime_rank_22_letter',
  'alltime_rank_23_letter',

  'yearly_rank_three_letter',
  'yearly_rank_three_letter_crazy',
  'yearly_rank_five_letter_unhinged',
  'yearly_rank_4_letter',
  'yearly_rank_5_letter',
  'yearly_rank_five_letter_crazy',
  'yearly_rank_6_letter',
  'yearly_rank_7_letter',
  'yearly_rank_8_letter',
  'yearly_rank_9_letter',
  'yearly_rank_10_letter',
  'yearly_rank_11_letter',
  'yearly_rank_12_letter',
  'yearly_rank_13_letter',
  'yearly_rank_14_letter',
  'yearly_rank_15_letter',
  'yearly_rank_16_letter',
  'yearly_rank_17_letter',
  'yearly_rank_18_letter',
  'yearly_rank_19_letter',
  'yearly_rank_20_letter',
  'yearly_rank_21_letter',
  'yearly_rank_22_letter',
  'yearly_rank_23_letter',

  'monthly_rank_three_letter',
  'monthly_rank_three_letter_crazy',
  'monthly_rank_five_letter_unhinged',
  'monthly_rank_4_letter',
  'monthly_rank_5_letter',
  'monthly_rank_five_letter_crazy',
  'monthly_rank_6_letter',
  'monthly_rank_7_letter',
  'monthly_rank_8_letter',
  'monthly_rank_9_letter',
  'monthly_rank_10_letter',
  'monthly_rank_11_letter',
  'monthly_rank_12_letter',
  'monthly_rank_13_letter',
  'monthly_rank_14_letter',
  'monthly_rank_15_letter',
  'monthly_rank_16_letter',
  'monthly_rank_17_letter',
  'monthly_rank_18_letter',
  'monthly_rank_19_letter',
  'monthly_rank_20_letter',
  'monthly_rank_21_letter',
  'monthly_rank_22_letter',
  'monthly_rank_23_letter',

  'weekly_rank_three_letter',
  'weekly_rank_three_letter_crazy',
  'weekly_rank_five_letter_unhinged',
  'weekly_rank_4_letter',
  'weekly_rank_5_letter',
  'weekly_rank_five_letter_crazy',
  'weekly_rank_6_letter',
  'weekly_rank_7_letter',
  'weekly_rank_8_letter',
  'weekly_rank_9_letter',
  'weekly_rank_10_letter',
  'weekly_rank_11_letter',
  'weekly_rank_12_letter',
  'weekly_rank_13_letter',
  'weekly_rank_14_letter',
  'weekly_rank_15_letter',
  'weekly_rank_16_letter',
  'weekly_rank_17_letter',
  'weekly_rank_18_letter',
  'weekly_rank_19_letter',
  'weekly_rank_20_letter',
  'weekly_rank_21_letter',
  'weekly_rank_22_letter',
  'weekly_rank_23_letter',

  'daily_rank_three_letter',
  'daily_rank_three_letter_crazy',
  'daily_rank_five_letter_unhinged',
  'daily_rank_4_letter',
  'daily_rank_5_letter',
  'daily_rank_five_letter_crazy',
  'daily_rank_6_letter',
  'daily_rank_7_letter',
  'daily_rank_8_letter',
  'daily_rank_9_letter',
  'daily_rank_10_letter',
  'daily_rank_11_letter',
  'daily_rank_12_letter',
  'daily_rank_13_letter',
  'daily_rank_14_letter',
  'daily_rank_15_letter',
  'daily_rank_16_letter',
  'daily_rank_17_letter',
  'daily_rank_18_letter',
  'daily_rank_19_letter',
  'daily_rank_20_letter',
  'daily_rank_21_letter',
  'daily_rank_22_letter',
  'daily_rank_23_letter',
]);

// Rank columns are whitelisted above. Only derive filters from whitelisted ranks.
const PACK_STAT_PREFIX: Record<string, string> = {
  'three_letter': 'three_letter',
  'three_letter_crazy': 'three_letter_crazy',
  'five_letter_unhinged': 'five_letter_unhinged',
  'five_letter_crazy': 'five_letter_crazy',
  '11_letter_extended': 'eleven_letter_extended',
};
const NUMBER_WORDS = [
  '', '', '', '', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
  'twentyone', 'twentytwo', 'twentythree',
];

function participationColumns(safeOrderBy: string): [string, string] {
  const suffix = safeOrderBy.replace(/^(alltime|yearly|monthly|weekly|daily)_rank/, '').replace(/^_/, '');
  let prefix = 'games';
  if (suffix) {
    const match = /^(\d+)_letter$/.exec(suffix);
    prefix = PACK_STAT_PREFIX[suffix] ??
      (match && Number(match[1]) >= 4 && Number(match[1]) <= 23
        ? `${NUMBER_WORDS[Number(match[1])]}_letter`
        : '');
    if (!prefix) throw new Error(`Unsupported leaderboard rank: ${safeOrderBy}`);
  }
  return [prefix === 'games' ? 'games_won' : `${prefix}_games_won`,
          prefix === 'games' ? 'games_lost' : `${prefix}_games_lost`];
}

// Keep the selected pack's rank independent from the statistic used for ordering.
// The rank whitelist also guards all derived participation columns.
function sanitizeOrderBy(orderBy: string, fallback: string) {
  const rank = orderBy.split('__sort__')[0];
  return ALLOWED_ORDER_COLUMNS.has(rank) ? rank : fallback;
}

function resolveSort(orderBy: string, rank: string) {
  const [requestedRank, statistic, extra] = orderBy.split('__sort__');
  if (requestedRank !== rank || extra !== undefined || !statistic) {
    return { column: rank, ascending: true };
  }
  const [won, lost] = participationColumns(rank);
  const permitted = [won, lost];
  if (['alltime_rank', 'daily_rank', 'weekly_rank', 'monthly_rank', 'yearly_rank'].includes(rank)) {
    permitted.push('games_played');
  }
  return permitted.includes(statistic)
    ? { column: statistic, ascending: false }
    : { column: rank, ascending: true };
}

// Lifetime streaks live in the regular All-Time view, not the period MVs.
function streakColumn(orderBy: string, rank: string): string | null {
  const [requestedRank, statistic, extra] = orderBy.split('__sort__');
  if (requestedRank !== rank || extra !== undefined || !statistic) return null;
  const [won] = participationColumns(rank);
  const prefix = won === 'games_won' ? '' : won.slice(0, -'_games_won'.length);
  if (!prefix) return statistic === 'overall_best_streak' ? statistic : null;
  return statistic === `${prefix}_current_streak` ||
    statistic === `${prefix}_best_streak` ||
    statistic === `${prefix}_games_played`
    ? statistic : null;
}

async function fetchStreakSortedPage(
  period: string, rank: string, statistic: string,
  offset: number, limit: number,
  dates: { year?: number; month?: number; week?: number; day?: number } = {},
) {
  const { data, error } = await db.rpc('wordrama_leaderboard_streak_page', {
    p_period: period, p_rank: rank, p_streak: statistic.endsWith('_games_played') ? 'games_played' : statistic.endsWith('_current_streak') ? 'current_streak' : 'best_streak',
    p_offset: offset, p_limit: limit,
    p_year: dates.year ?? null, p_month: dates.month ?? null,
    p_week: dates.week ?? null, p_day: dates.day ?? null,
  });
  if (error) throw new Error(`Streak leaderboard query failed: ${error.message}`);
  return data ?? [];
}

async function enrichLifetimeStreaks(rows: any[]) {
  const ids = [...new Set(rows.map(row => row.player).filter(Boolean))];
  if (!ids.length) return rows;
  const { data, error } = await db.from('_mv_wordle_alltime_leaderboard')
    .select('*').in('player', ids);
  if (error) throw new Error(`Lifetime streak lookup failed: ${error.message}`);
  const byPlayer = new Map((data ?? []).map((row: any) => [row.player, row]));
  return rows.map(row => {
    const lifetime = byPlayer.get(row.player) as any;
    if (!lifetime) return row;
    const streakFields = Object.fromEntries(Object.entries(lifetime).filter(([key]) =>
      key === 'overall_best_streak' || /_(current|best)_streak$/.test(key)
    ));
    return { ...row, ...streakFields };
  });
}

async function getProfileImagesByPlayerIds(playerIds: string[]) {
  const profileImageByPlayerId = new Map<string, string | null>();

  if (playerIds.length === 0) {
    return profileImageByPlayerId;
  }

  const uniquePlayerIds = [...new Set(playerIds)];

  const { data: playerRows, error } = await db
    .from('_players')
    .select('id, profile_image')
    .in('id', uniquePlayerIds);

  if (error) {
    console.error('[leaderboard] unable to load profile images:', error);
    return profileImageByPlayerId;
  }

  for (const playerRow of playerRows ?? []) {
    profileImageByPlayerId.set(
      playerRow.id,
      playerRow.profile_image ?? null,
    );
  }

  return profileImageByPlayerId;
}

type LeaderboardSubscriptionTier = 'PLUS' | 'CREATOR' | null;
const subscriptionTierCache = new Map<string, { tier: LeaderboardSubscriptionTier; expires: number }>();
const SUBSCRIPTION_CACHE_MS = 60_000;
const SUBSCRIPTION_CACHE_MAX = 1500;

async function getSubscriptionKeysByPlayerIds(playerIds: string[]) {
  const result = new Map<string, LeaderboardSubscriptionTier>();
  const nowMs = Date.now();
  const missing: string[] = [];
  for (const id of new Set(playerIds.filter(Boolean))) {
    const cached = subscriptionTierCache.get(id);
    if (cached && cached.expires > nowMs) result.set(id, cached.tier);
    else missing.push(id);
  }
  if (missing.length) {
    const { data, error } = await db
      .from('_player_subscriptions')
      .select('player_id, subscription_key')
      .in('player_id', missing)
      .in('subscription_key', ['PLUS', 'CREATOR'])
      .in('status', ['TRIALING', 'ACTIVE', 'PAST_DUE'])
      .gt('current_period_end', new Date().toISOString());
    if (error) {
      console.error('[leaderboard] subscription tier lookup failed:', error);
      // Fail closed, but do not cache a transient failure.
      for (const id of missing) result.set(id, null);
    } else {
      for (const id of missing) result.set(id, null);
      for (const row of data ?? []) {
        const tier: LeaderboardSubscriptionTier = row.subscription_key === 'CREATOR' ? 'CREATOR' : 'PLUS';
        if (tier === 'CREATOR' || result.get(row.player_id) !== 'CREATOR') result.set(row.player_id, tier);
      }
      for (const id of missing) subscriptionTierCache.set(id, { tier: result.get(id) ?? null, expires: nowMs + SUBSCRIPTION_CACHE_MS });
      while (subscriptionTierCache.size > SUBSCRIPTION_CACHE_MAX) {
        const first = subscriptionTierCache.keys().next().value;
        if (first === undefined) break;
        subscriptionTierCache.delete(first);
      }
    }
  }
  return result;
}

async function getPlayerLeaderboardPositionAllTime(userId: string) {
  const { data, error } = await db
    .from('_mv_wordle_alltime_leaderboard')
    .select('*')
    .eq('player', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  if (!data) {
    return null;
  }

  const camel = changeKeys.camelCase(data, 10) as any;

  const profileImageByPlayerId = await getProfileImagesByPlayerIds(
    data.player ? [data.player] : [],
  );


  const playerIds = data.player ? [data.player] : [];
  const { avatarStyleByPlayerId, avatarFrameByPlayerId } =
    await getAvatarCosmeticsByPlayerIds(playerIds);
  const subscriptionKeyByPlayerId = await getSubscriptionKeysByPlayerIds(playerIds);

  return {
    ...camel,
    profileImage: profileImageByPlayerId.get(data.player) ?? null,
    avatarStyleKey: avatarStyleByPlayerId.get(data.player) ?? null,
    avatarFrameKey: avatarFrameByPlayerId.get(data.player) ?? null,
    subscriptionKey: subscriptionKeyByPlayerId.get(data.player) ?? null,
  };
}

async function getPlayerLeaderboardPositionThisYear(
  userId: string,
  year: number = new Date().getFullYear(),
) {
  const { data, error } = await db
    .from('_mv_wordle_yearly_leaderboard')
    .select('*')
    .eq('player', userId)
    .eq('year', year)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  if (!data) {
    return null;
  }

  const camel = changeKeys.camelCase(data, 10) as any;

  const profileImageByPlayerId = await getProfileImagesByPlayerIds(
    data.player ? [data.player] : [],
  );


  const playerIds = data.player ? [data.player] : [];
  const { avatarStyleByPlayerId, avatarFrameByPlayerId } =
    await getAvatarCosmeticsByPlayerIds(playerIds);
  const subscriptionKeyByPlayerId = await getSubscriptionKeysByPlayerIds(playerIds);

  return {
    ...camel,
    profileImage: profileImageByPlayerId.get(data.player) ?? null,
    avatarStyleKey: avatarStyleByPlayerId.get(data.player) ?? null,
    avatarFrameKey: avatarFrameByPlayerId.get(data.player) ?? null,
    subscriptionKey: subscriptionKeyByPlayerId.get(data.player) ?? null,
  };
}

async function getPlayerLeaderboardPositionThisMonth(
  userId: string,
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear(),
) {
  const { data, error } = await db
    .from('_mv_wordle_monthly_leaderboard')
    .select('*')
    .eq('player', userId)
    .eq('month', month)
    .eq('year', year)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  if (!data) {
    return null;
  }

  const camel = changeKeys.camelCase(data, 10) as any;

  const profileImageByPlayerId = await getProfileImagesByPlayerIds(
    data.player ? [data.player] : [],
  );


  const playerIds = data.player ? [data.player] : [];
  const { avatarStyleByPlayerId, avatarFrameByPlayerId } =
    await getAvatarCosmeticsByPlayerIds(playerIds);
  const subscriptionKeyByPlayerId = await getSubscriptionKeysByPlayerIds(playerIds);

  return {
    ...camel,
    profileImage: profileImageByPlayerId.get(data.player) ?? null,
    avatarStyleKey: avatarStyleByPlayerId.get(data.player) ?? null,
    avatarFrameKey: avatarFrameByPlayerId.get(data.player) ?? null,
    subscriptionKey: subscriptionKeyByPlayerId.get(data.player) ?? null,
  };
}

async function getPlayerLeaderboardPositionThisWeek(
  userId: string,
  week: number = moment().week(),
  year: number = new Date().getFullYear(),
) {
  const { data, error } = await db
    .from('_mv_wordle_weekly_leaderboard')
    .select('*')
    .eq('player', userId)
    .eq('week', week)
    .eq('year', year)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  if (!data) {
    return null;
  }

  const camel = changeKeys.camelCase(data, 10) as any;

  const profileImageByPlayerId = await getProfileImagesByPlayerIds(
    data.player ? [data.player] : [],
  );


  const playerIds = data.player ? [data.player] : [];
  const { avatarStyleByPlayerId, avatarFrameByPlayerId } =
    await getAvatarCosmeticsByPlayerIds(playerIds);
  const subscriptionKeyByPlayerId = await getSubscriptionKeysByPlayerIds(playerIds);

  return {
    ...camel,
    profileImage: profileImageByPlayerId.get(data.player) ?? null,
    avatarStyleKey: avatarStyleByPlayerId.get(data.player) ?? null,
    avatarFrameKey: avatarFrameByPlayerId.get(data.player) ?? null,
    subscriptionKey: subscriptionKeyByPlayerId.get(data.player) ?? null,
  };
}

async function getPlayerLeaderboardPositionToday(
  userId: string,
  day: number = new Date().getDate(),
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear(),
) {
  const { data, error } = await db
    .from('_mv_wordle_daily_leaderboard')
    .select('*')
    .eq('player', userId)
    .eq('day', day)
    .eq('month', month)
    .eq('year', year)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  if (!data) {
    return null;
  }

  const camel = changeKeys.camelCase(data, 10) as any;

  const profileImageByPlayerId = await getProfileImagesByPlayerIds(
    data.player ? [data.player] : [],
  );


  const playerIds = data.player ? [data.player] : [];
  const { avatarStyleByPlayerId, avatarFrameByPlayerId } =
    await getAvatarCosmeticsByPlayerIds(playerIds);
  const subscriptionKeyByPlayerId = await getSubscriptionKeysByPlayerIds(playerIds);

  return {
    ...camel,
    profileImage: profileImageByPlayerId.get(data.player) ?? null,
    avatarStyleKey: avatarStyleByPlayerId.get(data.player) ?? null,
    avatarFrameKey: avatarFrameByPlayerId.get(data.player) ?? null,
    subscriptionKey: subscriptionKeyByPlayerId.get(data.player) ?? null,
  };
}

async function getAvatarCosmeticsByPlayerIds(playerIds: string[]) {
  const avatarStyleByPlayerId = new Map<string, string | null>();
  const avatarFrameByPlayerId = new Map<string, string | null>();

  if (playerIds.length === 0) {
    return { avatarStyleByPlayerId, avatarFrameByPlayerId };
  }

  const uniquePlayerIds = [...new Set(playerIds)];

  const { data: avatarRows, error: avatarError } = await db
    .from('_player_avatar')
    .select(
      'player_id, equipped_avatar_style_key, equipped_avatar_frame_key',
    )
    .in('player_id', uniquePlayerIds);

  if (avatarError) {
    console.error(
      '[leaderboard] unable to load equipped avatar cosmetics:',
      avatarError,
    );
    return { avatarStyleByPlayerId, avatarFrameByPlayerId };
  }

  const rows = avatarRows ?? [];

  for (const row of rows) {
    avatarStyleByPlayerId.set(
      row.player_id,
      row.equipped_avatar_style_key ?? null,
    );
    avatarFrameByPlayerId.set(row.player_id, null);
  }

  const equippedFrames = rows.filter(
    (row) => !!row.equipped_avatar_frame_key,
  );

  if (equippedFrames.length === 0) {
    return { avatarStyleByPlayerId, avatarFrameByPlayerId };
  }

  const framePlayerIds = equippedFrames.map((row) => row.player_id);
  const now = new Date().toISOString();

  try {
    const { data: entitlements, error: entitlementError } = await db
      .from('_player_entitlements')
      .select(
        'player_id, entitlement_key, status, revoked_at, starts_at, expires_at',
      )
      .in('player_id', framePlayerIds)
      .eq('status', 'ACTIVE')
      .is('revoked_at', null)
      .lte('starts_at', now)
      .or(`expires_at.is.null,expires_at.gt.${now}`);

    if (entitlementError) throw entitlementError;

    const validEntitlements = new Set(
      (entitlements ?? []).map(
        (row) => `${row.player_id}:${row.entitlement_key}`,
      ),
    );

    const subscriptionPlayers = equippedFrames
      .filter(
        (row) =>
          row.equipped_avatar_frame_key === 'FRAME:PLUS' ||
          row.equipped_avatar_frame_key === 'FRAME:CREATOR',
      )
      .map((row) => row.player_id);

    const subscriptionKeys = await getSubscriptionKeysByPlayerIds(subscriptionPlayers);
    const validSubscriptions = new Set<string>();
    for (const id of subscriptionPlayers) {
      const tier = subscriptionKeys.get(id);
      if (tier) validSubscriptions.add(`${id}:${tier}`);
    }

    for (const row of equippedFrames) {
      const frameKey = row.equipped_avatar_frame_key;
      if (!frameKey) continue;

      if (
        !validEntitlements.has(`${row.player_id}:${frameKey}`)
      ) {
        continue;
      }

      if (
        frameKey === 'FRAME:OWNER' &&
        !isWordramaOwner(row.player_id)
      ) {
        continue;
      }

      if (
        frameKey === 'FRAME:PLUS' &&
        !validSubscriptions.has(`${row.player_id}:PLUS`)
      ) {
        continue;
      }

      if (
        frameKey === 'FRAME:CREATOR' &&
        !validSubscriptions.has(`${row.player_id}:CREATOR`)
      ) {
        continue;
      }

      avatarFrameByPlayerId.set(row.player_id, frameKey);
    }
  } catch (error) {
    console.error(
      '[leaderboard] unable to authorize avatar frames:',
      error,
    );
    // Fail closed: leave frames hidden if verification fails.
  }

  return { avatarStyleByPlayerId, avatarFrameByPlayerId };
}

async function getPlayerLeaderboardAllTime(
  orderBy: string = 'alltime_rank',
  offset: number = 0,
  limit: number = 10,
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'alltime_rank');
  const sorting = resolveSort(orderBy, safeOrderBy);
  const streak = streakColumn(orderBy, safeOrderBy);

  let rows: any[] = [];
  if (streak) {
    rows = await enrichLifetimeStreaks(await fetchStreakSortedPage('alltime', safeOrderBy, streak, offset, limit, {}));
  } else {
    const { data, error } = await db
      .from('_mv_wordle_alltime_leaderboard')
      .select('*')
      .not(safeOrderBy, 'is', null)
      .or(participationColumns(safeOrderBy).map((column) => `${column}.gt.0`).join(','))
      .order(sorting.column, { ascending: sorting.ascending })
      .order(safeOrderBy, { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error(error);
      return {};
    }

    rows = await enrichLifetimeStreaks(data ?? []);
  }

  const playerIds = rows
    .map((row: any) => row.player)
    .filter(
      (playerId: string | null | undefined): playerId is string =>
        Boolean(playerId),
    );

  const profileImageByPlayerId = await getProfileImagesByPlayerIds(playerIds);

  const {
    avatarStyleByPlayerId,
    avatarFrameByPlayerId,
  } = await getAvatarCosmeticsByPlayerIds(playerIds);
  const subscriptionKeyByPlayerId = await getSubscriptionKeysByPlayerIds(playerIds);

  return rows.map((row: any) => {
    const camel = changeKeys.camelCase(row, 10) as any;

    return {
      ...camel,
      profileImage: profileImageByPlayerId.get(row.player) ?? null,
      avatarStyleKey: avatarStyleByPlayerId.get(row.player) ?? null,
      avatarFrameKey: avatarFrameByPlayerId.get(row.player) ?? null,
      subscriptionKey: subscriptionKeyByPlayerId.get(row.player) ?? null,
      bestStreak: camel.overallBestStreak ?? 0,
      players: {
        levels: {
          level: camel.level ?? 0,
        },
        ledger: {
          coinBalance: camel.coinBalance ?? 0,
        },
      },
    };
  });
}

async function getPlayerLeaderboardForTheYear(
  orderBy: string = 'yearly_rank',
  offset: number = 0,
  limit: number = 10,
  year: number = new Date().getFullYear(),
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'yearly_rank');
  const sorting = resolveSort(orderBy, safeOrderBy);
  const streak = streakColumn(orderBy, safeOrderBy);

  let rows: any[] = [];
  if (streak) {
    rows = await enrichLifetimeStreaks(await fetchStreakSortedPage('yearly', safeOrderBy, streak, offset, limit, { year }));
  } else {
    const { data, error } = await db
      .from('_mv_wordle_yearly_leaderboard')
      .select('*')
      .eq('year', year)
      .not(safeOrderBy, 'is', null)
      .or(participationColumns(safeOrderBy).map((column) => `${column}.gt.0`).join(','))
      .order(sorting.column, { ascending: sorting.ascending })
      .order(safeOrderBy, { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error(error);
      return {};
    }

    rows = await enrichLifetimeStreaks(data ?? []);
  }

  const playerIds = rows
    .map((row: any) => row.player)
    .filter(
      (playerId: string | null | undefined): playerId is string =>
        Boolean(playerId),
    );

  const profileImageByPlayerId = await getProfileImagesByPlayerIds(playerIds);

  const {
    avatarStyleByPlayerId,
    avatarFrameByPlayerId,
  } = await getAvatarCosmeticsByPlayerIds(playerIds);
  const subscriptionKeyByPlayerId = await getSubscriptionKeysByPlayerIds(playerIds);

  return rows.map((row: any) => {
    const camel = changeKeys.camelCase(row, 10) as any;

    return {
      ...camel,
      profileImage: profileImageByPlayerId.get(row.player) ?? null,
      avatarStyleKey: avatarStyleByPlayerId.get(row.player) ?? null,
      avatarFrameKey: avatarFrameByPlayerId.get(row.player) ?? null,
      subscriptionKey: subscriptionKeyByPlayerId.get(row.player) ?? null,
      bestStreak: camel.overallBestStreak ?? 0,
      players: {
        levels: {
          level: camel.level ?? 0,
        },
        ledger: {
          coinBalance: camel.coinBalance ?? 0,
        },
      },
    };
  });
}

async function getPlayerLeaderboardForTheMonth(
  orderBy: string = 'monthly_rank',
  offset: number = 0,
  limit: number = 10,
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear(),
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'monthly_rank');
  const sorting = resolveSort(orderBy, safeOrderBy);
  const streak = streakColumn(orderBy, safeOrderBy);

  let rows: any[] = [];
  if (streak) {
    rows = await enrichLifetimeStreaks(await fetchStreakSortedPage('monthly', safeOrderBy, streak, offset, limit, { year, month }));
  } else {
    const { data, error } = await db
      .from('_mv_wordle_monthly_leaderboard')
      .select('*')
      .eq('month', month)
      .eq('year', year)
      .not(safeOrderBy, 'is', null)
      .or(participationColumns(safeOrderBy).map((column) => `${column}.gt.0`).join(','))
      .order(sorting.column, { ascending: sorting.ascending })
      .order(safeOrderBy, { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error(error);
      return {};
    }

    rows = await enrichLifetimeStreaks(data ?? []);
  }

  const playerIds = rows
    .map((row: any) => row.player)
    .filter(
      (playerId: string | null | undefined): playerId is string =>
        Boolean(playerId),
    );

  const profileImageByPlayerId = await getProfileImagesByPlayerIds(playerIds);

  const {
    avatarStyleByPlayerId,
    avatarFrameByPlayerId,
  } = await getAvatarCosmeticsByPlayerIds(playerIds);
  const subscriptionKeyByPlayerId = await getSubscriptionKeysByPlayerIds(playerIds);

  return rows.map((row: any) => {
    const camel = changeKeys.camelCase(row, 10) as any;

    return {
      ...camel,
      profileImage: profileImageByPlayerId.get(row.player) ?? null,
      avatarStyleKey: avatarStyleByPlayerId.get(row.player) ?? null,
      avatarFrameKey: avatarFrameByPlayerId.get(row.player) ?? null,
      subscriptionKey: subscriptionKeyByPlayerId.get(row.player) ?? null,
      bestStreak: camel.overallBestStreak ?? 0,
      players: {
        levels: {
          level: camel.level ?? 0,
        },
        ledger: {
          coinBalance: camel.coinBalance ?? 0,
        },
      },
    };
  });
}

async function getPlayerLeaderboardForThisWeek(
  orderBy: string = 'weekly_rank',
  offset: number = 0,
  limit: number = 10,
  week: number = moment().week(),
  year: number = new Date().getFullYear(),
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'weekly_rank');
  const sorting = resolveSort(orderBy, safeOrderBy);
  const streak = streakColumn(orderBy, safeOrderBy);

  let rows: any[] = [];
  if (streak) {
    rows = await enrichLifetimeStreaks(await fetchStreakSortedPage('weekly', safeOrderBy, streak, offset, limit, { year, week }));
  } else {
    const { data, error } = await db
      .from('_mv_wordle_weekly_leaderboard')
      .select('*')
      .eq('week', week)
      .eq('year', year)
      .not(safeOrderBy, 'is', null)
      .or(participationColumns(safeOrderBy).map((column) => `${column}.gt.0`).join(','))
      .order(sorting.column, { ascending: sorting.ascending })
      .order(safeOrderBy, { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error(error);
      return {};
    }

    rows = await enrichLifetimeStreaks(data ?? []);
  }

  const playerIds = rows
    .map((row: any) => row.player)
    .filter(
      (playerId: string | null | undefined): playerId is string =>
        Boolean(playerId),
    );

  const profileImageByPlayerId = await getProfileImagesByPlayerIds(playerIds);

  const {
    avatarStyleByPlayerId,
    avatarFrameByPlayerId,
  } = await getAvatarCosmeticsByPlayerIds(playerIds);
  const subscriptionKeyByPlayerId = await getSubscriptionKeysByPlayerIds(playerIds);

  return rows.map((row: any) => {
    const camel = changeKeys.camelCase(row, 10) as any;

    return {
      ...camel,
      profileImage: profileImageByPlayerId.get(row.player) ?? null,
      avatarStyleKey: avatarStyleByPlayerId.get(row.player) ?? null,
      avatarFrameKey: avatarFrameByPlayerId.get(row.player) ?? null,
      subscriptionKey: subscriptionKeyByPlayerId.get(row.player) ?? null,
      bestStreak: camel.overallBestStreak ?? 0,
      players: {
        levels: {
          level: camel.level ?? 0,
        },
        ledger: {
          coinBalance: camel.coinBalance ?? 0,
        },
      },
    };
  });
}

async function getPlayerLeaderboardForToday(
  orderBy: string = 'daily_rank',
  offset: number = 0,
  limit: number = 10,
  day: number = new Date().getDate(),
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear(),
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'daily_rank');
  const sorting = resolveSort(orderBy, safeOrderBy);
  const streak = streakColumn(orderBy, safeOrderBy);

  let rows: any[] = [];
  if (streak) {
    rows = await enrichLifetimeStreaks(await fetchStreakSortedPage('daily', safeOrderBy, streak, offset, limit, { year, month, day }));
  } else {
    const { data, error } = await db
      .from('_mv_wordle_daily_leaderboard')
      .select('*')
      .eq('day', day)
      .eq('month', month)
      .eq('year', year)
      .not(safeOrderBy, 'is', null)
      .or(participationColumns(safeOrderBy).map((column) => `${column}.gt.0`).join(','))
      .order(sorting.column, { ascending: sorting.ascending })
      .order(safeOrderBy, { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error(error);
      return {};
    }

    rows = await enrichLifetimeStreaks(data ?? []);
  }

  const playerIds = rows
    .map((row: any) => row.player)
    .filter(
      (playerId: string | null | undefined): playerId is string =>
        Boolean(playerId),
    );

  const profileImageByPlayerId = await getProfileImagesByPlayerIds(playerIds);

  const {
    avatarStyleByPlayerId,
    avatarFrameByPlayerId,
  } = await getAvatarCosmeticsByPlayerIds(playerIds);
  const subscriptionKeyByPlayerId = await getSubscriptionKeysByPlayerIds(playerIds);

  return rows.map((row: any) => {
    const camel = changeKeys.camelCase(row, 10) as any;

    return {
      ...camel,
      profileImage: profileImageByPlayerId.get(row.player) ?? null,
      avatarStyleKey: avatarStyleByPlayerId.get(row.player) ?? null,
      avatarFrameKey: avatarFrameByPlayerId.get(row.player) ?? null,
      subscriptionKey: subscriptionKeyByPlayerId.get(row.player) ?? null,
      bestStreak: camel.overallBestStreak ?? 0,
      players: {
        levels: {
          level: camel.level ?? 0,
        },
        ledger: {
          coinBalance: camel.coinBalance ?? 0,
        },
      },
    };
  });
}

async function getPlayerLeaderboardAllTimeLength(
  orderBy: string = 'alltime_rank',
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'alltime_rank');

  const { count, error } = await db
    .from('_mv_wordle_alltime_leaderboard')
    .select('player', { count: 'exact', head: true })
    .not(safeOrderBy, 'is', null)
    .or(participationColumns(safeOrderBy).map((column) => `${column}.gt.0`).join(','));

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getPlayerLeaderboardYearlyLength(
  orderBy: string = 'yearly_rank',
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'yearly_rank');

  const { count, error } = await db
    .from('_mv_wordle_yearly_leaderboard')
    .select('player', { count: 'exact', head: true })
    .eq('year', new Date().getFullYear())
    .not(safeOrderBy, 'is', null)
    .or(participationColumns(safeOrderBy).map((column) => `${column}.gt.0`).join(','));

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getPlayerLeaderboardMonthlyLength(
  orderBy: string = 'monthly_rank',
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'monthly_rank');

  const { count, error } = await db
    .from('_mv_wordle_monthly_leaderboard')
    .select('player', { count: 'exact', head: true })
    .eq('month', new Date().getMonth() + 1)
    .eq('year', new Date().getFullYear())
    .not(safeOrderBy, 'is', null)
    .or(participationColumns(safeOrderBy).map((column) => `${column}.gt.0`).join(','));

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getPlayerLeaderboardWeeklyLength(
  orderBy: string = 'weekly_rank',
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'weekly_rank');

  const { count, error } = await db
    .from('_mv_wordle_weekly_leaderboard')
    .select('player', { count: 'exact', head: true })
    .eq('week', moment().week())
    .eq('year', new Date().getFullYear())
    .not(safeOrderBy, 'is', null)
    .or(participationColumns(safeOrderBy).map((column) => `${column}.gt.0`).join(','));

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getPlayerLeaderboardDailyLength(
  orderBy: string = 'daily_rank',
) {
  const safeOrderBy = sanitizeOrderBy(orderBy, 'daily_rank');

  const { count, error } = await db
    .from('_mv_wordle_daily_leaderboard')
    .select('player', { count: 'exact', head: true })
    .eq('day', new Date().getDate())
    .eq('month', new Date().getMonth() + 1)
    .eq('year', new Date().getFullYear())
    .not(safeOrderBy, 'is', null)
    .or(participationColumns(safeOrderBy).map((column) => `${column}.gt.0`).join(','));

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

export default {
  getPlayerLeaderboardAllTimeLength,
  getPlayerLeaderboardYearlyLength,
  getPlayerLeaderboardMonthlyLength,
  getPlayerLeaderboardWeeklyLength,
  getPlayerLeaderboardDailyLength,
  getPlayerLeaderboardPositionAllTime,
  getPlayerLeaderboardPositionThisYear,
  getPlayerLeaderboardPositionThisMonth,
  getPlayerLeaderboardPositionThisWeek,
  getPlayerLeaderboardPositionToday,
  getPlayerLeaderboardAllTime,
  getPlayerLeaderboardForTheYear,
  getPlayerLeaderboardForTheMonth,
  getPlayerLeaderboardForThisWeek,
  getPlayerLeaderboardForToday,
};
