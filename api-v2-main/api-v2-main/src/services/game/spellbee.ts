import type { AddGameResult } from '../../schema/game/spellbee.js';

export const UNVERIFIED_SPELLBEE =
  'Spellbee results are unavailable until server-owned puzzle verification is configured';

async function submitSpellbeeResult(_userId: string, _body: AddGameResult) {
  // The separately built game supplies both answers and its denominator.
  // Neither is evidence of a valid puzzle. Do not persist stats or issue rewards.
  return { error: UNVERIFIED_SPELLBEE };
}

export default { submitSpellbeeResult };
