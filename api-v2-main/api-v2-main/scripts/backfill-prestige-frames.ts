import { db } from '../src/models';
import {
  awardPrestigeFrames,
  PRESTIGE_FRAME_REWARDS,
} from '../src/services/prestigeFrames';

const APPLY = process.argv.includes('--apply');
const PAGE_SIZE = 500;

type PlayerLevel = {
  player: string;
  level: number;
  prestige: number;
};

async function getEligiblePlayers(): Promise<PlayerLevel[]> {
  const players: PlayerLevel[] = [];

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await db
      .from('_levels')
      .select('player, level, prestige')
      .gte('prestige', 1)
      .order('player', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) throw error;

    players.push(...((data ?? []) as PlayerLevel[]));

    if (!data || data.length < PAGE_SIZE) break;
  }

  return players;
}

async function getMissingFrames(player: PlayerLevel) {
  const eligible = PRESTIGE_FRAME_REWARDS.filter(
    (reward) => player.prestige >= reward.prestige,
  );

  const { data, error } = await db
    .from('_player_entitlements')
    .select('entitlement_key')
    .eq('player_id', player.player)
    .eq('status', 'ACTIVE')
    .is('expires_at', null)
    .in(
      'entitlement_key',
      eligible.map((reward) => reward.entitlementKey),
    );

  if (error) throw error;

  const owned = new Set(
    (data ?? []).map((row) => row.entitlement_key),
  );

  return eligible.filter(
    (reward) => !owned.has(reward.entitlementKey),
  );
}

async function main() {
  const players = await getEligiblePlayers();

  console.log(`Eligible players: ${players.length}`);
  console.log(`Mode: ${APPLY ? 'APPLY' : 'PREVIEW'}`);

  let missingCount = 0;
  let failedCount = 0;

  for (const player of players) {
    const missing = await getMissingFrames(player);

    if (missing.length === 0) continue;

    missingCount += missing.length;

    console.log(
      `Player ${player.player} | Level ${player.level} | ` +
      `Prestige ${player.prestige} | ` +
      missing.map((reward) => reward.entitlementKey).join(', '),
    );

    if (APPLY) {
      try {
        await awardPrestigeFrames(player.player, player.prestige);
      } catch (error) {
        failedCount++;
        console.error(
          `Failed to award frames for ${player.player}:`,
          error,
        );
      }
    }
  }

  console.log(`Missing frame entitlements found: ${missingCount}`);

  if (!APPLY) {
    console.log('Preview only. No changes made.');
  } else {
    console.log(`Players with award errors: ${failedCount}`);
    console.log('Re-run preview mode to verify remaining missing rewards.');
  }
}

main().catch((error) => {
  console.error('Prestige frame backfill failed:', error);
  process.exitCode = 1;
});
