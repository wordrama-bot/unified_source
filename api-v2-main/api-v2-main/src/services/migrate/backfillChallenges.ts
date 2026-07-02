import { db } from "../../models";

type BackfillOptions = {
  dryRun?: boolean;
  offset?: number;
  limit?: number;
  logEvery?: number;
  singlePage?: boolean;
  targetPlayerId?: string;
};

type BackfillResult = {
  dryRun: boolean;
  offset: number;
  limit: number;
  playersProcessed: number;
  writes: number;
  errors: any[];
};

const CH = {
  FIRST_GAME: "4d8b44d9-c06d-4eb1-8a13-68273649acee",
  FIRST_WORDLE: "6e0b4736-434f-441a-bd15-f1e6af871a9c",
  WIN_1: "5bc14e33-c61e-41ed-bdd5-f008ef3cdc69",
  WIN_2: "d298a278-583f-4470-ae2d-f214b14d3a29",
  WIN_3: "1b3fc220-585b-4f1b-9dc9-e5753c791078",
  WIN_4: "30e18999-303c-4ab6-b5dc-559b757c1903",
  WIN_5: "c9f2f782-6b9e-471a-9c36-41946ddaa600",
  WIN_6: "f3f24c6e-913c-4893-a74f-d28d2a0dd179",
  LOSE_WORDLE: "f6fcebf0-97c9-4374-98f8-062a737b8601",
  STREAK_100: "930824d0-e727-45a0-b7d7-ae366ddd9aaa",
  KEBAB: "d82d4465-5d6a-4a92-9256-06933522a754",
  KING: "08fa66af-723a-4e74-8963-5aaf700b4fa0",
  DISCORD: "e2bbc084-5137-453b-87a2-d8f6308bcdc7",
  INVITE: "1c897692-483d-4e48-99bb-3d0227201c13",
  SOCIALS: "6586c8da-543f-4970-9bb5-e9d924378706",
  USERNAME: "f3675b82-0d1e-450f-aa53-37c3e958a5d6",
};

const STATUS = {
  LOCKED: "LOCKED",
  UNLOCKED: "UNLOCKED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETE: "COMPLETE",
} as const;

function safePositiveInt(value: any, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function safeNonNegativeInt(value: any, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

function isNonEmptyString(v: any) {
  return typeof v === "string" && v.trim().length > 0;
}

function normalizeExistingStatus(status?: string) {
  if (status === "COMPLETED") return STATUS.COMPLETE;
  return status;
}

function isTransientNetworkError(err: any): boolean {
  const code = String(err?.code || "");
  const msg = String(err?.message || "");
  return (
    code === "ECONNRESET" ||
    msg.includes("socket connection was closed unexpectedly") ||
    msg.includes("fetch()")
  );
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function columnExists(table: string, column: string): Promise<boolean> {
  const { error } = await db.from(table).select(column).limit(1);
  return !error;
}

async function getPlayersPage(
  offset: number,
  limit: number
): Promise<{ playerIds: string[]; source: string; error?: any }> {
  let lastErr: any = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error, count } = await db
      .from("_players")
      .select("id", { count: "exact" })
      .order("created_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error && (error as any).code === "PGRST103") {
      return { playerIds: [], source: "_players" };
    }

    if (!error) {
      const ids = (data || []).map((r: any) => r.id).filter(Boolean);

      console.log(
        `[backfillChallenges] getPlayersPage offset=${offset} limit=${limit} count=${count ?? "n/a"} rows=${ids.length}`
      );

      return { playerIds: ids, source: "_players" };
    }

    lastErr = error;

    if (!isTransientNetworkError(error)) break;
    await sleep(250 * Math.pow(2, attempt));
  }

  return { playerIds: [], source: "_players", error: lastErr };
}

async function getExistingStatuses(playerId: string, challengeIds: string[]) {
  const { data, error } = await db
    .from("_challenge_progress")
    .select("challenge_id,status")
    .eq("player_id", playerId)
    .in("challenge_id", challengeIds);

  const m = new Map<string, string>();

  if (error) return m;

  for (const row of data || []) {
    m.set((row as any).challenge_id, normalizeExistingStatus((row as any).status) || "");
  }

  return m;
}

async function getPlayerProfile(playerId: string): Promise<{
  usernameOk: boolean;
  discordConnected: boolean;
}> {
  const { data, error } = await db
    .from("_players")
    .select("id,username,display_name,discord_connected")
    .eq("id", playerId)
    .maybeSingle();

  if (error || !data) {
    return { usernameOk: false, discordConnected: false };
  }

  const usernameOk =
    isNonEmptyString((data as any).username) ||
    isNonEmptyString((data as any).display_name);

  return {
    usernameOk,
    discordConnected: (data as any).discord_connected === true,
  };
}

async function getWordleStats(playerId: string) {
  const anyGame = await db
    .from("_wordle_game_result")
    .select("id", { count: "exact", head: true })
    .eq("player", playerId);

  const anyLoss = await db
    .from("_wordle_game_result")
    .select("id", { count: "exact", head: true })
    .eq("player", playerId)
    .eq("game_was_won", false);

  const winByGuess: Record<number, boolean> = {};

  for (let n = 1; n <= 6; n++) {
    const r = await db
      .from("_wordle_game_result")
      .select("id", { count: "exact", head: true })
      .eq("player", playerId)
      .eq("game_was_won", true)
      .eq("guess_count", n);

    winByGuess[n] = (r.count || 0) > 0;
  }

  const kebab = await db
    .from("_wordle_game_result")
    .select("id", { count: "exact", head: true })
    .eq("player", playerId)
    .eq("game_was_won", true)
    .eq("solution", "KEBAB");

  const streak = await db
    .from("_wordle_streak")
    .select("best_streak")
    .eq("player", playerId)
    .order("best_streak", { ascending: false })
    .limit(1)
    .maybeSingle();

  const bestStreak = (streak.data as any)?.best_streak ?? 0;

  return {
    hasAnyGame: (anyGame.count || 0) > 0,
    hasLoss: (anyLoss.count || 0) > 0,
    winByGuess,
    hasKebab: (kebab.count || 0) > 0,
    bestStreak,
  };
}

async function hasDiscordLink(playerId: string): Promise<boolean> {
  const { count, error } = await db
    .from("_discord_link")
    .select("id", { count: "exact", head: true })
    .eq("player", playerId);

  if (error) return false;
  return (count || 0) > 0;
}

async function isKingSomewhere(playerId: string): Promise<boolean> {
  const views = [
    "_v_leaderboard_daily",
    "_v_leaderboard_weekly",
    "_v_leaderboard_monthly",
    "_v_leaderboard_yearly",
    "_v_leaderboard_alltime",
  ];

  for (const v of views) {
    try {
      const r1 = await db
        .from(v)
        .select("*")
        .eq("rank", 1)
        .eq("player_id", playerId)
        .limit(1);

      if (!r1.error && (r1.data?.length || 0) > 0) return true;
    } catch {}

    try {
      const r2 = await db
        .from(v)
        .select("*")
        .eq("rank", 1)
        .eq("player", playerId)
        .limit(1);

      if (!r2.error && (r2.data?.length || 0) > 0) return true;
    } catch {}

    try {
      const r3 = await db
        .from(v)
        .select("*")
        .eq("position", 1)
        .eq("player_id", playerId)
        .limit(1);

      if (!r3.error && (r3.data?.length || 0) > 0) return true;
    } catch {}

    try {
      const r4 = await db
        .from(v)
        .select("*")
        .eq("position", 1)
        .eq("player", playerId)
        .limit(1);

      if (!r4.error && (r4.data?.length || 0) > 0) return true;
    } catch {}
  }

  return false;
}

function resolvedStatus(existing: string | undefined, computedComplete: boolean) {
  const normalized = normalizeExistingStatus(existing);

  if (normalized === STATUS.COMPLETE) return STATUS.COMPLETE;
  return computedComplete ? STATUS.COMPLETE : STATUS.UNLOCKED;
}

function makeRow(
  playerId: string,
  challengeId: string,
  computedComplete: boolean,
  existingMap: Map<string, string>,
  progressColExists: boolean
) {
  const status = resolvedStatus(existingMap.get(challengeId), computedComplete);
  const row: any = { player_id: playerId, challenge_id: challengeId, status };

  if (progressColExists) {
    row.progress = status === STATUS.COMPLETE ? 100 : 0;
  }

  return row;
}

async function processOnePlayer(
  playerId: string,
  dryRun: boolean,
  progressColExists: boolean,
  touched: string[],
  result: BackfillResult
) {
  const existing = await getExistingStatuses(playerId, touched);
  const stats = await getWordleStats(playerId);
  const profile = await getPlayerProfile(playerId);
  const king = await isKingSomewhere(playerId);
  const discordLinked = profile.discordConnected || (await hasDiscordLink(playerId));

  const rows = [
    makeRow(playerId, CH.FIRST_GAME, stats.hasAnyGame, existing, progressColExists),
    makeRow(playerId, CH.FIRST_WORDLE, stats.hasAnyGame, existing, progressColExists),
    makeRow(playerId, CH.LOSE_WORDLE, stats.hasLoss, existing, progressColExists),

    makeRow(playerId, CH.WIN_1, stats.winByGuess[1], existing, progressColExists),
    makeRow(playerId, CH.WIN_2, stats.winByGuess[2], existing, progressColExists),
    makeRow(playerId, CH.WIN_3, stats.winByGuess[3], existing, progressColExists),
    makeRow(playerId, CH.WIN_4, stats.winByGuess[4], existing, progressColExists),
    makeRow(playerId, CH.WIN_5, stats.winByGuess[5], existing, progressColExists),
    makeRow(playerId, CH.WIN_6, stats.winByGuess[6], existing, progressColExists),

    makeRow(playerId, CH.KEBAB, stats.hasKebab, existing, progressColExists),
    makeRow(playerId, CH.STREAK_100, stats.bestStreak >= 100, existing, progressColExists),

    makeRow(playerId, CH.KING, king, existing, progressColExists),

    makeRow(playerId, CH.USERNAME, profile.usernameOk, existing, progressColExists),
    makeRow(playerId, CH.DISCORD, discordLinked, existing, progressColExists),

    makeRow(playerId, CH.INVITE, false, existing, progressColExists),
    makeRow(playerId, CH.SOCIALS, false, existing, progressColExists),
  ];

  if (!dryRun) {
    const up = await db
      .from("_challenge_progress")
      .upsert(rows, { onConflict: "player_id,challenge_id" });

    if (up.error) throw up.error;

    result.writes += rows.length;
  }

  result.playersProcessed += 1;
}

export async function backfillChallenges(
  opts: BackfillOptions = {}
): Promise<BackfillResult> {
  const dryRun = !!opts.dryRun;
  const startOffset = safeNonNegativeInt(opts.offset, 0);
  const limit = safePositiveInt(opts.limit, 250);
  const logEvery = safePositiveInt(opts.logEvery, 50);

  const result: BackfillResult = {
    dryRun,
    offset: startOffset,
    limit,
    playersProcessed: 0,
    writes: 0,
    errors: [],
  };

  console.log(
    `[backfillChallenges] START dryRun=${dryRun} offset=${startOffset} limit=${limit} singlePage=${!!opts.singlePage} target=${opts.targetPlayerId || "none"}`
  );

  const progressColExists = await columnExists("_challenge_progress", "progress");
  const touched = Object.values(CH);

  console.log(
    `[backfillChallenges] progressColExists=${progressColExists} challengesTouched=${touched.length}`
  );

  const targetPlayerId = opts.targetPlayerId?.trim();

  if (targetPlayerId) {
    console.log(`[backfillChallenges] TARGET player=${targetPlayerId}`);

    try {
      await processOnePlayer(targetPlayerId, dryRun, progressColExists, touched, result);
    } catch (e: any) {
      console.log(`[backfillChallenges] ERROR player=${targetPlayerId}`, e);
      result.errors.push({
        stage: "process_player",
        playerId: targetPlayerId,
        error: e,
      });
    }

    console.log(
      `[backfillChallenges] DONE processed=${result.playersProcessed} writes=${result.writes} errors=${result.errors.length}`
    );

    return result;
  }

  let offset = startOffset;

  for (;;) {
    const page = await getPlayersPage(offset, limit);

    console.log(
      `[backfillChallenges] page offset=${offset} limit=${limit} source=${page.source} fetched=${page.playerIds.length} first=${page.playerIds[0] || "n/a"}`
    );

    if (page.error) {
      console.log(`[backfillChallenges] ERROR selecting players`, page.error);
      result.errors.push({ stage: "select_players", offset, error: page.error });
      break;
    }

    if (page.playerIds.length === 0) break;

    for (const playerId of page.playerIds) {
      try {
        await processOnePlayer(playerId, dryRun, progressColExists, touched, result);

        if (result.playersProcessed % logEvery === 0) {
          console.log(
            `[backfillChallenges] processed=${result.playersProcessed} writes=${result.writes} lastPlayer=${playerId}`
          );
        }
      } catch (e: any) {
        console.log(`[backfillChallenges] ERROR player=${playerId}`, e);
        result.errors.push({
          stage: "process_player",
          playerId,
          error: e,
        });
      }
    }

    if (page.playerIds.length < limit) break;
    if (opts.singlePage) break;

    offset += limit;
  }

  console.log(
    `[backfillChallenges] DONE processed=${result.playersProcessed} writes=${result.writes} errors=${result.errors.length}`
  );

  return result;
}
