import { db } from '../../models'

export async function getPlayerEntitlements(playerId: string) {
  const { data, error } = await db
    .from('_player_entitlements')
    .select('*')
    .eq('player_id', playerId)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })

  if (error) throw error

  const now = new Date().toISOString()
  return (data ?? []).filter((row: any) => !row.expires_at || row.expires_at > now)
}