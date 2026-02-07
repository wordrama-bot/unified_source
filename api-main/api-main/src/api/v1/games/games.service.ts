import { supabase } from '../../../';

export async function getGames() {
  const games = await supabase.from('games').select('name, maintenance_mode');
  const { data } = games;
  if (!data || data.length === 0) return {
    ...games,
    count: 0,
    status: 404,
    statusText: 'Not Found'
  };

  return {
    ...games,
    count: data.length
  };
};

export async function getAvailableGames() {
  const games = await supabase.from('games')
    .select('name')
    .eq('maintenance_mode', false);

  const { data } = games;
  
  if (!data || data.length === 0) return {
    ...games,
    count: 0,
    status: 404,
    statusText: 'Not Found'
  };

  return games;
};
