-- Execute ONLY after staging rehearsal and explicit production authorization.
-- One transaction. Existing source game results, rewards and streak tables are untouched.
-- Requires postgres owner; coordinate refresh jobs and API traffic before execution.
-- WARNING: _mv_team_wordle_stats is rebuilt WITH DATA and may take time.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='15min';
SET LOCAL search_path=public,pg_catalog;
CREATE TEMP TABLE _wr3_saved_def (name text PRIMARY KEY, definition text NOT NULL) ON COMMIT DROP;
INSERT INTO _wr3_saved_def VALUES
 ('team',pg_get_viewdef('public._mv_team_wordle_stats'::regclass,true)),
 ('team_view',pg_get_viewdef('public._v_team_leaderboard'::regclass,true));
DO $guard$
DECLARE p text; n integer;
BEGIN
 IF EXISTS(SELECT 1 FROM pg_class WHERE relnamespace='public'::regnamespace AND relname LIKE '_mv_wordle_%_leaderboard_wr3_backup') THEN RAISE EXCEPTION 'Backup names already exist'; END IF;
 IF EXISTS(SELECT 1 FROM pg_class WHERE relnamespace='public'::regnamespace AND relname='_mv_team_wordle_stats_wr3_backup') THEN RAISE EXCEPTION 'Team backup already exists'; END IF;
 IF EXISTS(SELECT 1 FROM pg_class WHERE relnamespace='public'::regnamespace AND relname='_v_team_leaderboard_wr3_backup') THEN RAISE EXCEPTION 'Team view backup already exists'; END IF;
 FOREACH p IN ARRAY ARRAY['alltime','daily','weekly','monthly','yearly'] LOOP
  IF to_regclass(format('public._mv_wordle_%s_leaderboard',p)) IS NULL THEN RAISE EXCEPTION 'Missing live %',p; END IF;
  IF to_regclass(format('wordrama_pack_preview._wr3_%s_leaderboard_independent_mv',p)) IS NULL THEN RAISE EXCEPTION 'Missing candidate %',p; END IF;
  SELECT count(*) INTO n FROM pg_attribute a JOIN pg_class c ON c.oid=a.attrelid WHERE c.oid=to_regclass(format('wordrama_pack_preview._wr3_%s_leaderboard_independent_mv',p)) AND a.attnum>0 AND NOT a.attisdropped AND a.attname IN (p||'_rank_three_letter',p||'_rank_three_letter_crazy',p||'_rank_five_letter_unhinged');
  IF n<>3 THEN RAISE EXCEPTION 'Missing rank columns in %',p; END IF;
 END LOOP;
 IF (SELECT count(*) FROM pg_index WHERE indrelid='public._mv_team_wordle_stats'::regclass)<>0 THEN RAISE EXCEPTION 'Team indexes require explicit preservation'; END IF;
 IF EXISTS(SELECT 1 FROM pg_class WHERE oid IN ('public._mv_team_wordle_stats'::regclass,'public._v_team_leaderboard'::regclass) AND relacl IS NOT NULL) THEN RAISE EXCEPTION 'Team grants require explicit preservation'; END IF;
END $guard$;
-- Keep original team MV as a physical backup, but dependent team view must be rebound.
DROP VIEW public._v_team_leaderboard;
ALTER MATERIALIZED VIEW public._mv_team_wordle_stats RENAME TO _mv_team_wordle_stats_wr3_backup;
DO $swap$
DECLARE p text;
BEGIN
 FOREACH p IN ARRAY ARRAY['alltime','daily','weekly','monthly','yearly'] LOOP
  EXECUTE format('ALTER MATERIALIZED VIEW public.%I RENAME TO %I','_mv_wordle_'||p||'_leaderboard','_mv_wordle_'||p||'_leaderboard_wr3_backup');
  EXECUTE format('ALTER MATERIALIZED VIEW wordrama_pack_preview.%I SET SCHEMA public','_wr3_'||p||'_leaderboard_independent_mv');
  EXECUTE format('ALTER MATERIALIZED VIEW public.%I RENAME TO %I','_wr3_'||p||'_leaderboard_independent_mv','_mv_wordle_'||p||'_leaderboard');
 END LOOP;
END $swap$;
-- Rebind team MV to new public MVs using original SQL, preserving its aggregate logic.
DO $rebind$
DECLARE team_sql text; view_sql text;
BEGIN
 SELECT definition INTO team_sql FROM _wr3_saved_def WHERE name='team';
 SELECT definition INTO view_sql FROM _wr3_saved_def WHERE name='team_view';
 EXECUTE 'CREATE MATERIALIZED VIEW public._mv_team_wordle_stats AS '||team_sql||' WITH DATA';
 EXECUTE 'CREATE VIEW public._v_team_leaderboard AS '||view_sql;
END $rebind$;
-- Fail transaction if the new team MV references backup MVs.
DO $verify$
BEGIN
 IF EXISTS(SELECT 1 FROM pg_depend d JOIN pg_rewrite r ON r.oid=d.objid WHERE r.ev_class='public._mv_team_wordle_stats'::regclass AND d.refobjid::regclass::text LIKE '%wr3_backup%') THEN RAISE EXCEPTION 'Team MV still references backup'; END IF;
END $verify$;
COMMIT;
-- Apply reviewed streak RPC candidate separately AFTER this transaction.
-- Keep backups until all validations and refresh schedules are verified.
