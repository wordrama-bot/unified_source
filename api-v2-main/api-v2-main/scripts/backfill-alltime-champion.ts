import { db } from '../src/models';
import challengeProgressService from '../src/services/challenge/progress';

const ALL_TIME_CHAMPION_CHALLENGE_ID =
  'eb7590cc-d2a8-4952-a5e5-17e2bbe15202';

const ALL_TIME_CHAMPION_ENTITLEMENT_KEY =
  'AVATAR:CROWN_ALLTIME_CHAMPION';

const APPLY = process.argv.includes('--apply');

const ALL_TIME_RANK_COLUMNS = [
  'alltime_rank',
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
];

async function getQualifiedPlayers() {
  const rankOneFilter = ALL_TIME_RANK_COLUMNS
    .map((column) => `${column}.eq.1`)
    .join(',');

  const { data, error } = await db
    .from('_mv_wordle_alltime_leaderboard')
    .select(
      [
        'player',
        'display_name',
        ...ALL_TIME_RANK_COLUMNS,
      ].join(','),
    )
    .or(rankOneFilter);

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function getExistingProgress(playerIds: string[]) {
  if (playerIds.length === 0) return [];

  const { data, error } = await db
    .from('_challenge_progress')
    .select('id, player_id, status, progress')
    .eq('challenge_id', ALL_TIME_CHAMPION_CHALLENGE_ID)
    .in('player_id', playerIds);

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function getExistingEntitlements(playerIds: string[]) {
  if (playerIds.length === 0) return [];

  const { data, error } = await db
    .from('_player_entitlements')
    .select(
      'id, player_id, entitlement_type, source_type, status, starts_at, expires_at, revoked_at',
    )
    .eq('entitlement_key', ALL_TIME_CHAMPION_ENTITLEMENT_KEY)
    .in('player_id', playerIds);

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function main() {
  const qualifiedPlayers = await getQualifiedPlayers();

  const playerIds = qualifiedPlayers.map(
    (row: any) => row.player,
  );

  const [progressRows, entitlementRows] =
    await Promise.all([
      getExistingProgress(playerIds),
      getExistingEntitlements(playerIds),
    ]);

  const progressByPlayer = new Map(
    progressRows.map((row: any) => [
      row.player_id,
      row,
    ]),
  );

  const entitlementsByPlayer = new Map<string, any[]>();

  for (const entitlement of entitlementRows as any[]) {
    const existing =
      entitlementsByPlayer.get(entitlement.player_id) ?? [];

    existing.push(entitlement);

    entitlementsByPlayer.set(
      entitlement.player_id,
      existing,
    );
  }

  const preview = qualifiedPlayers.map((player: any) => {
    const winningRanks = ALL_TIME_RANK_COLUMNS.filter(
      (column) => Number(player[column]) === 1,
    );

    return {
      playerId: player.player,
      displayName: player.display_name,
      winningRanks,
      challengeProgress:
        progressByPlayer.get(player.player) ?? null,
      crownEntitlements:
        entitlementsByPlayer.get(player.player) ?? [],
    };
  });

  console.table(
    preview.map((row) => ({
      playerId: row.playerId,
      displayName: row.displayName,
      winningRanks: row.winningRanks.join(', '),
      challengeStatus:
        row.challengeProgress?.status ?? 'MISSING',
      challengeProgress:
        row.challengeProgress?.progress ?? null,
      crownEntitlements:
        row.crownEntitlements.length,
    })),
  );

  console.log(
    `Qualified All-Time Champions: ${preview.length}`,
  );

  if (!APPLY) {
    console.log(
      'Preview only. Re-run with --apply to complete eligible challenges.',
    );
    return;
  }

  for (const player of preview) {
    if (
      player.challengeProgress?.status === 'COMPLETE' ||
      player.challengeProgress?.progress === 100
    ) {
      console.log(
        `Skipping ${player.displayName}: challenge already complete.`,
      );
      continue;
    }

    console.log(
      `Completing All-Time Champion challenge for ${player.displayName} (${player.playerId})`,
    );

    const result =
      await challengeProgressService.updateChallengeProgress(
        ALL_TIME_CHAMPION_CHALLENGE_ID,
        player.playerId,
        'COMPLETE',
        100,
      );

    if (
      !result ||
      result.status !== 'COMPLETE' ||
      Number(result.progress) !== 100
    ) {
      throw new Error(
        `Failed to complete challenge for ${player.displayName} (${player.playerId})`,
      );
    }

    console.log(
      `Completed challenge for ${player.displayName} (${player.playerId})`,
    );
  }

  console.log('Backfill complete.');
}

main().catch((error) => {
  console.error(
    'All-Time Champion backfill failed:',
    error,
  );
  process.exit(1);
});
