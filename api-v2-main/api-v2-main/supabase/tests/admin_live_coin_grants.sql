-- STAGING ONLY: execute after applying the proposed admin coin grant migration.
-- Run with a staging service_role connection. The entire test rolls back.
-- Do NOT run on production; this invokes real balance-changing functions.
BEGIN;

DO $$
DECLARE
  v_player uuid;
  v_admin uuid;
  v_request uuid := gen_random_uuid();
  v_before bigint;
  v_after bigint;
  v_first jsonb;
  v_duplicate jsonb;
  v_audit_count bigint;
  v_request_count bigint;
  v_failed boolean;
BEGIN
  SELECT l.player, l.coin_balance INTO v_player, v_before
    FROM public._ledger l ORDER BY l.player LIMIT 1;
  IF v_player IS NULL THEN
    RAISE EXCEPTION 'Staging fixture missing: player with _ledger row';
  END IF;
  v_admin := v_player; -- Staging-only fixture: RPC is service_role-restricted.

  v_first := public.admin_grant_live_coins(
    v_request, v_player, v_admin, 17, 'Staging transaction test'
  );
  IF v_first->>'duplicate' <> 'false'
     OR (v_first->>'balanceBefore')::bigint <> v_before
     OR (v_first->>'balanceAfter')::bigint <> v_before + 17 THEN
    RAISE EXCEPTION 'First grant returned unexpected result: %', v_first;
  END IF;

  SELECT coin_balance INTO v_after FROM public._ledger WHERE player = v_player;
  IF v_after <> v_before + 17 THEN
    RAISE EXCEPTION 'Live ledger did not change by exactly 17';
  END IF;

  v_duplicate := public.admin_grant_live_coins(
    v_request, v_player, v_admin, 17, 'Staging transaction test'
  );
  IF v_duplicate->>'duplicate' <> 'true' THEN
    RAISE EXCEPTION 'Retry was not recognized as duplicate';
  END IF;
  SELECT coin_balance INTO v_after FROM public._ledger WHERE player = v_player;
  IF v_after <> v_before + 17 THEN
    RAISE EXCEPTION 'Duplicate grant changed live balance';
  END IF;

  SELECT count(*) INTO v_audit_count FROM public._moderation_actions
    WHERE id = (v_first->>'moderationActionId')::uuid
      AND target_user_id = v_player
      AND action_type = 'COINS_GRANTED';
  SELECT count(*) INTO v_request_count FROM public._admin_coin_grant_requests
    WHERE request_id = v_request;
  IF v_audit_count <> 1 OR v_request_count <> 1 THEN
    RAISE EXCEPTION 'Expected one audit and one idempotency record';
  END IF;

  v_failed := false;
  BEGIN
    PERFORM public.admin_grant_live_coins(
      v_request, v_player, v_admin, 18, 'Staging transaction test'
    );
  EXCEPTION WHEN OTHERS THEN
    v_failed := true;
  END;
  IF NOT v_failed THEN
    RAISE EXCEPTION 'Reused key with changed amount was accepted';
  END IF;

  v_failed := false;
  BEGIN
    PERFORM public.admin_grant_live_coins(
      gen_random_uuid(), v_player, v_admin, -1, 'Staging transaction test'
    );
  EXCEPTION WHEN OTHERS THEN
    v_failed := true;
  END;
  IF NOT v_failed THEN
    RAISE EXCEPTION 'Negative grant was accepted';
  END IF;

  SELECT coin_balance INTO v_after FROM public._ledger WHERE player = v_player;
  IF v_after <> v_before + 17 THEN
    RAISE EXCEPTION 'Invalid request unexpectedly changed balance';
  END IF;

  RAISE NOTICE 'PASS: live ledger credit, audit, idempotent retry, mismatched retry and negative amount';
END $$;

ROLLBACK;
