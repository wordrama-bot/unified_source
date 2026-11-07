-- Staging only. Simulate audit insert failure; verify no coins or idempotency record persist.
BEGIN;
CREATE FUNCTION pg_temp.reject_admin_coin_audit() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.action_type = 'COINS_GRANTED' THEN
   RAISE EXCEPTION 'Intentional staging audit failure';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER staging_reject_coin_audit
 BEFORE INSERT ON public._moderation_actions
 FOR EACH ROW EXECUTE FUNCTION pg_temp.reject_admin_coin_audit();
DO $$
DECLARE
 v_player uuid; v_before bigint; v_after bigint;
 v_failed boolean := false; v_request uuid := gen_random_uuid();
BEGIN
 SELECT player, coin_balance INTO v_player, v_before
 FROM public._ledger ORDER BY player LIMIT 1;
 IF v_player IS NULL THEN RAISE EXCEPTION 'Missing staging ledger fixture'; END IF;
 BEGIN
  PERFORM public.admin_grant_live_coins(
   v_request,v_player,v_player,19,'Audit failure rollback test'
  );
 EXCEPTION WHEN OTHERS THEN
  v_failed := true;
 END;
 IF NOT v_failed THEN RAISE EXCEPTION 'Expected audit failure did not occur'; END IF;
 SELECT coin_balance INTO v_after FROM public._ledger WHERE player=v_player;
 IF v_after IS DISTINCT FROM v_before THEN
  RAISE EXCEPTION 'Balance changed despite audit failure';
 END IF;
 IF EXISTS (SELECT 1 FROM public._admin_coin_grant_requests WHERE request_id=v_request) THEN
  RAISE EXCEPTION 'Request persisted despite audit failure';
 END IF;
 RAISE NOTICE 'PASS: audit failure rolls back grant';
END $$;
ROLLBACK;
