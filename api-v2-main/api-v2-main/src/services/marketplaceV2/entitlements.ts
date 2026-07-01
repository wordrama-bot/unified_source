import { db } from '../../models'
import { CATALOG } from './catalog';

export async function getPlayerEntitlements(
  playerId: string,
  options?: {
    includeInactive?: boolean;
  },
) {
  let query = db
    .from('_player_entitlements')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false });

  if (!options?.includeInactive) {
    query = query.eq('status', 'ACTIVE');
  }

  const { data, error } = await query;

  if (error) throw error;

  if (options?.includeInactive) {
    return data ?? [];
  }

  const now = new Date().toISOString();

  return (data ?? []).filter(
    (row: any) => !row.expires_at || row.expires_at > now,
  );
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

export async function previewAdminGrantEntitlement({
  playerId,
  catalogItemId,
  expiresAt,
}: {
  playerId: string;
  catalogItemId: string;
  expiresAt?: string | null;
}) {
  const catalogItem = CATALOG.find(
    (item) => item.catalogItemId === catalogItemId,
  );

  if (!catalogItem) {
    throw new Error('Catalog item not found.');
  }

  const now = new Date().toISOString();

  const { data: existing, error } = await db
    .from('_player_entitlements')
    .select('*')
    .eq('player_id', playerId)
    .eq('entitlement_key', catalogItem.entitlementKey)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[entitlements] previewAdminGrantEntitlement error', error);
    throw new Error('Unable to preview entitlement grant.');
  }

  const activeEntitlements = (existing ?? []).filter(
    (row: any) =>
      row.status === 'ACTIVE' &&
      (!row.expires_at || row.expires_at > now),
  );

  const isTemporaryGrant = !!expiresAt;
  const hasActivePermanent = activeEntitlements.some(
    (row: any) => !row.expires_at,
  );

  return {
    playerId,
    catalogItem,
    requestedGrant: {
      entitlementKey: catalogItem.entitlementKey,
      entitlementType: catalogItem.entitlementType,
      sourceType: 'ADMIN',
      startsAt: now,
      expiresAt: expiresAt ?? null,
      isTemporaryGrant,
    },
    existingEntitlements: existing ?? [],
    warnings: [
      ...(hasActivePermanent
        ? ['Player already has an active permanent entitlement for this item.']
        : []),
      ...(activeEntitlements.length > 0 && isTemporaryGrant
        ? ['Player already has active access; temporary grant may be redundant.']
        : []),
    ],
    canGrant: !hasActivePermanent,
  };
}
