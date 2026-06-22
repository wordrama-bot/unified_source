export function hasEntitlement(
  entitlementsResponse: any,
  entitlementKey: string,
): boolean {
  return entitlementsResponse?.data?.some(
    (entitlement: any) =>
      entitlement.entitlement_key === entitlementKey &&
      entitlement.status === "ACTIVE" &&
      !entitlement.revoked_at &&
      (!entitlement.expires_at ||
        new Date(entitlement.expires_at) > new Date()),
  );
}

export function canAccessWordPack({
  entitlements,
  subscriptionKey,
  itemId,
}: {
  entitlements: any;
  subscriptionKey?: string;
  itemId: string;
}) {
  // CREATOR gets everything
  if (subscriptionKey === 'CREATOR') return true;

  // PLUS gets 12–23 packs
  const PLUS_PACKS = [
    '7f06b10e-d52a-4ae3-b77f-a7e9a7c5e5fb',
    'b8c73f14-79ad-4495-9fd9-a4be65d5fcbc',
    '3159552d-8c96-4bb5-aafa-ebf36aa5a2c2',
    'fef67eba-96db-4f5e-8b25-81487a1dbc9d',
    '1ee2de50-072f-4718-b8ac-7663f3069f2e',
    '80e197a9-0829-4074-8e85-a88e6e8b7ea0',
    '425c96ab-beff-40ef-9774-feb6db135644',
    '1d348c05-c51e-4ea3-a888-d4823436704f',
    '6e66a620-8e17-4f75-aa0b-1c282aafb9d8',
    '72215e5b-6638-4388-84bc-55dcd36c0e05',
    'db526774-11da-47de-b410-5b47a4168db8',
    'ab14511c-f2ac-4b16-a8ef-7cb8ed61a2cc',
  ];

  if (subscriptionKey === 'PLUS' && PLUS_PACKS.includes(itemId)) {
    return true;
  }

  // fallback: owned entitlement
  return entitlements?.some(
    (e: any) =>
      e.status === "ACTIVE" &&
      !e.revoked_at &&
      (!e.expires_at || new Date(e.expires_at) > new Date()) &&
      e.metadata?.catalogItemId === itemId,
  );
}
