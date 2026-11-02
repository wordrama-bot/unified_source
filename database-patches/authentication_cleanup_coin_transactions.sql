-- REVIEW CANDIDATE ONLY. Not applied. Requires explicit approval before execution.
-- Install before deploying the corresponding API. No changes to Wordle RPCs.
BEGIN;

CREATE OR REPLACE FUNCTION public.wordrama_change_coin_balance(p_player uuid, p_delta bigint)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE balance bigint;
BEGIN
  IF p_delta IS NULL THEN RAISE EXCEPTION 'Invalid balance change'; END IF;
  UPDATE public._ledger SET coin_balance = coin_balance + p_delta
    WHERE player = p_player AND coin_balance + p_delta >= 0
    RETURNING coin_balance INTO STRICT balance;
  RETURN jsonb_build_object('coinBalance', balance);
END;
$$;

CREATE OR REPLACE FUNCTION public.wordrama_purchase_items_with_coins(
  p_player uuid, p_items uuid[], p_entitlements jsonb DEFAULT '[]'::jsonb
) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  balance bigint;
  total numeric := 0;
  item public._items%ROWTYPE;
  selected_item_id uuid;
  entitlement jsonb;
BEGIN
  IF p_player IS NULL OR p_items IS NULL OR cardinality(p_items) NOT BETWEEN 1 AND 50
    OR array_position(p_items, NULL) IS NOT NULL
    OR (SELECT count(DISTINCT id) FROM unnest(p_items) id) <> cardinality(p_items)
    OR jsonb_typeof(p_entitlements) IS DISTINCT FROM 'array'
  THEN RAISE EXCEPTION 'Invalid purchase'; END IF;

  -- Same-player purchases serialize across API workers. The lock also coordinates
  -- with atomic reward updates, including the existing Wordle finalizer.
  SELECT coin_balance INTO STRICT balance FROM public._ledger
    WHERE player = p_player FOR UPDATE;

  -- Stable lock ordering also protects price/availability from concurrent edits.
  FOR selected_item_id IN SELECT id FROM unnest(p_items) id ORDER BY id LOOP
    SELECT * INTO item FROM public._items WHERE id = selected_item_id FOR SHARE;
    IF NOT FOUND OR item.purchasable_with_coins IS DISTINCT FROM true
      OR item.discontinued IS DISTINCT FROM false
    THEN RAISE EXCEPTION 'Item unavailable'; END IF;
    IF item.coin_price IS NULL OR item.coin_price <= 0
      OR item.coin_price::text IN ('NaN', 'Infinity', '-Infinity')
      OR trunc(item.coin_price) <> item.coin_price
    THEN RAISE EXCEPTION 'Invalid coin price'; END IF;
    IF EXISTS (SELECT 1 FROM public._purchased_items p
      WHERE p.player_id = p_player AND p.item_id = selected_item_id
      AND (p.bought_with_coins OR p.bought_with_money))
    THEN RAISE EXCEPTION 'Item already owned'; END IF;
    total := total + item.coin_price;
  END LOOP;
  IF balance IS NULL OR balance < total THEN RAISE EXCEPTION 'Insufficient funds'; END IF;

  UPDATE public._ledger SET coin_balance = coin_balance - total WHERE player = p_player;
  FOREACH selected_item_id IN ARRAY p_items LOOP
    INSERT INTO public._purchased_items
      (player_id, item_id, bought_with_coins, bought_with_money, unlocked_with_subscription)
      VALUES (p_player, selected_item_id, true, false, false);
    FOR entitlement IN SELECT value FROM jsonb_array_elements(p_entitlements)
      WHERE value->>'item_id' = selected_item_id::text LOOP
      IF EXISTS (SELECT 1 FROM public._player_entitlements e
        WHERE e.player_id = p_player AND e.entitlement_key = entitlement->>'key'
          AND e.status = 'ACTIVE' AND e.revoked_at IS NULL
          AND e.starts_at <= now() AND e.expires_at IS NULL
          AND e.source_type IN ('ORDER_ITEM', 'ADMIN'))
      THEN RAISE EXCEPTION 'Item already owned'; END IF;
      INSERT INTO public._player_entitlements
        (player_id, entitlement_key, entitlement_type, source_type, status, metadata)
      VALUES (p_player, entitlement->>'key', entitlement->>'type', 'ORDER_ITEM', 'ACTIVE',
        jsonb_build_object('catalogItemId', selected_item_id, 'purchaseMethod', 'COINS'));
    END LOOP;
  END LOOP;
  RETURN jsonb_build_object('purchased', true, 'items',
    (SELECT jsonb_agg(jsonb_build_object('id', id)) FROM unnest(p_items) id));
END;
$$;

REVOKE ALL ON FUNCTION public.wordrama_change_coin_balance(uuid,bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.wordrama_purchase_items_with_coins(uuid,uuid[],jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wordrama_change_coin_balance(uuid,bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.wordrama_purchase_items_with_coins(uuid,uuid[],jsonb) TO service_role;
COMMIT;
