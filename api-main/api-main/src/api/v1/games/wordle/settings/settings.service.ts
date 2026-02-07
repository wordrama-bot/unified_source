import { supabase } from '../../../../..';

export async function getSettings(userId: string) {
  const settings = await supabase.from('wordle_settings')
    .select()
    .eq('user_id', userId)
    .limit(1)
    .single();
  
  const { data } = settings;

  if (!data) return {
    ...settings,
    status: 404,
    statusText: 'Not Found'
  };

  return {
    ...settings,
    count: 1
  };
}

export async function updateSettings(
  userId: string, 
  isHighContrast: boolean,
  isDarkMode: boolean,
  isHardMode: boolean,
  wordLength: string,
  isConfettiEnabled: boolean
) {
  const settings = await supabase.from('wordle_settings')
    .update({
      colour_blind: isHighContrast,
      dark_mode: isDarkMode,
      hard_mode: isHardMode,
      word_length: wordLength,
      confetti_enabled: isConfettiEnabled
    })
    .eq('user_id', userId)
    .select()
    .single();
  
  const { data } = settings;

  if (!data) return {
    ...settings,
    status: 404,
    statusText: 'Not Found'
  };

  return {
    ...settings,
    count: 1
  };
}