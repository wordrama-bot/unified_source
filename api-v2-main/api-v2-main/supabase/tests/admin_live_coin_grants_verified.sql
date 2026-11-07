-- Staging only. Produces explicit PASS results while rolling back every write.
CREATE FUNCTION pg_temp.verify_coin_grant() RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
 v_player uuid; v_before bigint; v_after bigint;
 v_request uuid := gen_random_uuid(); v_one jsonb; v_two jsonb;
 v_count bigint; v_result jsonb;
BEGIN
 SELECT player,coin_balance INTO v_player,v_before
 FROM public._ledger ORDER BY player LIMIT 1;
 IF v_player IS NULL THEN RAISE EXCEPTION 'No staging fixture'; END IF;
 BEGIN
  v_one := public.admin_grant_live_coins(
   v_request,v_player,v_player,17,'Staging verification');
  v_two := public.admin_grant_live_coins(
   v_request,v_player,v_player,17,'Staging verification');
  SELECT coin_balance INTO v_after FROM public._ledger WHERE player=v_player;
  SELECT count(*) INTO v_count FROM public._moderation_actions
   WHERE id=(v_one->>'moderationActionId')::uuid;
  IF (v_one->>'duplicate')::boolean
     OR NOT (v_two->>'duplicate')::boolean
     OR v_after <> v_before+17 OR v_count <> 1 THEN
   RAISE EXCEPTION 'Grant assertion failed';
  END IF;
  v_result:=jsonb_build_object(
   'passed',true,'firstCredit',17,'duplicateRejected',true,
   'auditCount',v_count,'balanceDelta',v_after-v_before);
  RAISE EXCEPTION 'ROLLBACK_TEST' USING ERRCODE='P0001';
 EXCEPTION WHEN SQLSTATE 'P0001' THEN
  IF SQLERRM <> 'ROLLBACK_TEST' THEN RAISE; END IF;
 END;
 RETURN v_result;
END $$;
SELECT pg_temp.verify_coin_grant() AS verification;
