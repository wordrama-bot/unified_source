import { supabase } from '@/lib/supabase'

export async function getPlayerOrders(playerId: string) {
  const { data, error } = await supabase
    .from('_store_orders')
    .select(`
      *,
      items:_store_order_items (*)
    `)
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error

  return data ?? []
}