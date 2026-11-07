-- STAGED ONLY. Do not apply to production without explicit approval.
-- This transaction uses the existing _ledger, not the unadopted coin tables.
CREATE TABLE IF NOT EXISTS public._admin_coin_grant_requests (
  request_id uuid PRIMARY KEY,
  target_player_id uuid NOT NULL REFERENCES public._players(id),
  admin_player_id uuid NOT NULL REFERENCES public._players(id),
  amount bigint NOT NULL CHECK (amount > 0),
  reason text NOT NULL CHECK (length(btrim(reason)) > 0),
  balance_before bigint NOT NULL,
  balance_after bigint NOT NULL,
  moderation_action_id uuid NOT NULL REFERENCES public._moderation_actions(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public._admin_coin_grant_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public._admin_coin_grant_requests FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public._admin_coin_grant_requests TO service_role;

CREATE OR REPLACE FUNCTION public.admin_grant_live_coins(
  p_request_id uuid,
  p_player uuid,
  p_admin uuid,
  p_amount bigint,
  p_reason text,
  p_request_ip text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_existing public._admin_coin_grant_requests%ROWTYPE;
  v_before bigint;
  v_after bigint;
  v_action_id uuid;
BEGIN
  IF p_request_id IS NULL OR p_player IS NULL OR p_admin IS NULL
     OR p_amount IS NULL OR p_amount <= 0 OR p_amount > 1000000
     OR p_reason IS NULL OR length(btrim(p_reason)) = 0
     OR length(p_reason) > 2000 THEN
    RAISE EXCEPTION 'Invalid admin coin grant';
  END IF;

  -- Serialize grants, purchases and Wordle reward updates on the same row.
  SELECT coin_balance INTO v_before
    FROM public._ledger WHERE player = p_player FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Player coin ledger not found';
  END IF;

  SELECT * INTO v_existing
    FROM public._admin_coin_grant_requests WHERE request_id = p_request_id;
  IF FOUND THEN
    IF v_existing.target_player_id <> p_player
       OR v_existing.admin_player_id <> p_admin
       OR v_existing.amount <> p_amount
       OR v_existing.reason <> btrim(p_reason) THEN
      RAISE EXCEPTION 'Idempotency key reused with different grant details';
    END IF;
    RETURN jsonb_build_object('duplicate', true, 'balanceBefore',
      v_existing.balance_before, 'balanceAfter', v_existing.balance_after,
      'moderationActionId', v_existing.moderation_action_id);
  END IF;

  IF v_before > 9223372036854775807::bigint - p_amount THEN
    RAISE EXCEPTION 'Coin balance overflow';
  END IF;
  v_after := v_before + p_amount;
  UPDATE public._ledger SET coin_balance = v_after WHERE player = p_player;

  INSERT INTO public._moderation_actions (
    action_type, target_user_id, reason, performed_by, target_type, target_id,
    before_value, after_value, request_ip, user_agent, metadata
  ) VALUES (
    'COINS_GRANTED', p_player, btrim(p_reason), p_admin, 'PLAYER', p_player::text,
    jsonb_build_object('coin_balance', v_before),
    jsonb_build_object('coin_balance', v_after, 'amount_granted', p_amount),
    p_request_ip, p_user_agent,
    jsonb_build_object('requestId', p_request_id, 'balanceSource', '_ledger')
  ) RETURNING id INTO v_action_id;

  INSERT INTO public._admin_coin_grant_requests (
    request_id, target_player_id, admin_player_id, amount, reason,
    balance_before, balance_after, moderation_action_id
  ) VALUES (
    p_request_id, p_player, p_admin, p_amount, btrim(p_reason),
    v_before, v_after, v_action_id
  );

  RETURN jsonb_build_object('duplicate', false, 'balanceBefore', v_before,
    'balanceAfter', v_after, 'moderationActionId', v_action_id);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_grant_live_coins(uuid,uuid,uuid,bigint,text,text,text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_grant_live_coins(uuid,uuid,uuid,bigint,text,text,text)
  TO service_role;
