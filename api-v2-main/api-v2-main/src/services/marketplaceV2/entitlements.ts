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

export async function adminGrantEntitlement({
  playerId,
  adminPlayerId,
  catalogItemId,
  reason,
  expiresAt,
  requestIp,
  userAgent,
}: {
  playerId: string;
  adminPlayerId: string;
  catalogItemId: string;
  reason: string;
  expiresAt?: string | null;
  requestIp?: string;
  userAgent?: string;
}) {
  const cleanReason = reason.trim();

  if (!cleanReason) {
    throw new Error('Reason is required.');
  }

  const preview = await previewAdminGrantEntitlement({
    playerId,
    catalogItemId,
    expiresAt,
  });

  if (!preview.canGrant) {
    throw new Error(preview.warnings[0] ?? 'Entitlement cannot be granted.');
  }

  const data = await grantEntitlement({
    playerId,
    entitlementKey: preview.catalogItem.entitlementKey,
    entitlementType: preview.catalogItem.entitlementType,
    sourceType: 'ADMIN',
    startsAt: preview.requestedGrant.startsAt,
    expiresAt: preview.requestedGrant.expiresAt,
    metadata: {
      reason: cleanReason,
      grantedBy: adminPlayerId,
      catalogItemId: preview.catalogItem.catalogItemId,
      sku: preview.catalogItem.sku,
      itemName: preview.catalogItem.itemName,
      source: 'admin_dashboard',
    },
  });

  if (!data) {
    throw new Error('Player already has this entitlement.');
  }

  await db.from('_moderation_actions').insert({
    action_type: 'ENTITLEMENT_GRANTED',
    target_user_id: playerId,
    reason: cleanReason,
    performed_by: adminPlayerId,
    target_type: 'PLAYER',
    target_id: playerId,
    before_value: preview.existingEntitlements,
    after_value: data,
    request_ip: requestIp ?? null,
    user_agent: userAgent ?? null,
    metadata: {
      catalogItemId,
      entitlementKey: preview.catalogItem.entitlementKey,
      expiresAt: preview.requestedGrant.expiresAt,
    },
  });

  return data;
}

export async function grantEntitlement({
  playerId,
  entitlementKey,
  entitlementType,
  sourceType,
  startsAt,
  expiresAt,
  metadata,
}: {
  playerId: string;
  entitlementKey: string;
  entitlementType: string;
  sourceType: string;
  startsAt?: string;
  expiresAt?: string | null;
  metadata?: Record<string, any>;
}) {
  const alreadyHas = await hasPlayerEntitlement(playerId, entitlementKey);

  if (alreadyHas) {
    return null;
  }

  const { data, error } = await db
    .from('_player_entitlements')
    .insert({
      player_id: playerId,
      entitlement_key: entitlementKey,
      entitlement_type: entitlementType,
      source_type: sourceType,
      status: 'ACTIVE',
      starts_at: startsAt ?? new Date().toISOString(),
      expires_at: expiresAt ?? null,
      metadata: metadata ?? {},
    })
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}