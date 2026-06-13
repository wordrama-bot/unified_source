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

export async function hasPlayerEntitlement(
  playerId: string,
  entitlementKey: string
) {
  const now = new Date().toISOString();

  const { data, error } = await db
    .from('_player_entitlements')
    .select('id')
    .eq('player_id', playerId)
    .eq('entitlement_key', entitlementKey)
    .eq('status', 'ACTIVE')
    .is('revoked_at', null)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}
