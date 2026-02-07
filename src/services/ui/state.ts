import { db } from '../../models';

async function getUiState(userId: string) {
  const { data, error } = await db
    .from('_ui_saved_state')
    .select('ui_state')
    .eq('player', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return data?.ui_state;
}

async function updateUiState(userId: string, uiState: any) {
  const { data, error } = await db
    .from('_ui_saved_state')
    .update({
      ui_state: uiState,
    })
    .eq('player', userId)
    .select('ui_state')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return data?.ui_state;
}

export default {
  getUiState,
  updateUiState,
};
