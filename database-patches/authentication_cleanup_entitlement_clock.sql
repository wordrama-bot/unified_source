-- Install on staging before the corresponding API update.
-- Production requires separate explicit approval. No player data is modified.
BEGIN;
CREATE OR REPLACE FUNCTION public.wordrama_get_player_entitlements(
  p_player uuid,
  p_include_inactive boolean DEFAULT false,
  p_entitlement_key text DEFAULT NULL
) RETURNS SETOF public._player_entitlements
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
  SELECT e.* FROM public._player_entitlements e
  WHERE e.player_id = p_player
    AND (p_entitlement_key IS NULL OR e.entitlement_key = p_entitlement_key)
    AND (
      p_include_inactive IS TRUE OR (
        e.status = 'ACTIVE'
        AND e.revoked_at IS NULL
        AND e.starts_at <= CURRENT_TIMESTAMP
        AND (e.expires_at IS NULL OR e.expires_at > CURRENT_TIMESTAMP)
      )
    )
  ORDER BY e.created_at DESC;
$$;
REVOKE ALL ON FUNCTION public.wordrama_get_player_entitlements(uuid, boolean, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wordrama_get_player_entitlements(uuid, boolean, text)
  TO service_role;
COMMIT;
