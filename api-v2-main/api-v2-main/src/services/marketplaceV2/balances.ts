import { supabase } from '@/lib/supabase'

export async function getPlayerCoinBalance(playerId: string) {
  const { data, error } = await supabase
    .from('_player_coin_balances')
    .select('*')
    .eq('player_id', playerId)
    .eq('currency_code', 'COIN')
    .maybeSingle()

  if (error) throw error

  return (
    data ?? {
      player_id: playerId,
      currency_code: 'COIN',
      available_balance: 0,
      lifetime_earned: 0,
      lifetime_spent: 0,
      version: 0,
    }
  )
}