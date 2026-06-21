import { db } from "../db"; // adjust if needed

export async function grantWordPackEntitlement({
  playerId,
  entitlementKey,
  source,
  stripePaymentIntentId = null,
  coinTransactionId = null,
}: {
  playerId: string;
  entitlementKey: string;
  source: "COINS" | "STRIPE" | "SUBSCRIPTION" | "ADMIN";
  stripePaymentIntentId?: string | null;
  coinTransactionId?: string | null;
}) {
  const now = new Date().toISOString();

  const { data, error } = await db
    .from("_player_entitlements")
    .insert({
      player_id: playerId,
      entitlement_key: entitlementKey,
      source,
      created_at: now,
      expires_at: null, // permanent for purchases
      metadata: {
        stripePaymentIntentId,
        coinTransactionId,
      },
    })
    .select("*")
    .single();

  if (error) {
    console.error("Failed to grant entitlement:", error);
    throw error;
  }

  return data;
}
