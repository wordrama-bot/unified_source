import { db } from '../../models';

const TABLE = '_ui_saved_state';

async function getUiState(userId: string) {
  const { data, error } = await db
    .from(TABLE)
    .select('ui_state')
    .eq('player', userId)
    .maybeSingle();

  if (error) {
    console.error('getUiState error:', error);
    // don't crash / don't block UI
    return {};
  }

  return data?.ui_state ?? {};
}

async function updateUiState(userId: string, uiState: any) {
  const { data, error } = await db
    .from(TABLE)
    .upsert(
      { player: userId, ui_state: uiState },
      { onConflict: 'player' },
    )
    .select('ui_state')
    .maybeSingle();

  if (error) {
    console.error('updateUiState error:', error);
    return {};
  }

  return data?.ui_state ?? {};
}

export default {
  getUiState,
  updateUiState,
};