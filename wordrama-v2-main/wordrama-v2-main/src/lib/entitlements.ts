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
