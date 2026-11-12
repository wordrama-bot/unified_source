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
CREATE TEMP TABLE _wr3_acl_snapshot (object_name text, grantee text, privilege_type text) ON COMMIT DROP;
INSERT INTO _wr3_acl_snapshot
SELECT c.relname,CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type
FROM pg_class c CROSS JOIN LATERAL aclexplode(c.relacl) x
WHERE c.oid IN ('public._mv_team_wordle_stats'::regclass,'public._v_team_leaderboard'::regclass);
DO $guard$
DECLARE p text; n integer;
BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_class WHERE relnamespace='public'::regnamespace AND relname LIKE '_mv_wordle_%_leaderboard_wr3_backup') THEN RAISE EXCEPTION 'No backups found'; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_class WHERE relnamespace='public'::regnamespace AND relname='_mv_team_wordle_stats_wr3_backup') THEN RAISE EXCEPTION 'Team backup missing'; END IF;
 
 FOREACH p IN ARRAY ARRAY['alltime','daily','weekly','monthly','yearly'] LOOP
  IF to_regclass(format('public._mv_wordle_%s_leaderboard',p)) IS NULL THEN RAISE EXCEPTION 'Missing live %',p; END IF;
  IF to_regclass(format('public._mv_wordle_%s_leaderboard_wr3_backup',p)) IS NULL THEN RAISE EXCEPTION 'Missing original backup %',p; END IF;
  SELECT count(*) INTO n FROM pg_attribute a JOIN pg_class c ON c.oid=a.attrelid WHERE c.oid=to_regclass(format('public._mv_wordle_%s_leaderboard',p)) AND a.attnum>0 AND NOT a.attisdropped AND a.attname IN (p||'_rank_three_letter',p||'_rank_three_letter_crazy',p||'_rank_five_letter_unhinged');
  IF n<>3 THEN RAISE EXCEPTION 'Missing rank columns in %',p; END IF;
 END LOOP;
 IF (SELECT count(*) FROM pg_index WHERE indrelid='public._mv_team_wordle_stats'::regclass)<>0 THEN RAISE EXCEPTION 'Team indexes require explicit preservation'; END IF;
 -- Original team MV retains its ACL because it is renamed, not recreated.
END $guard$;
DROP VIEW public._v_team_leaderboard;
DROP MATERIALIZED VIEW public._mv_team_wordle_stats;
DO $swap$
DECLARE p text;
BEGIN
 FOREACH p IN ARRAY ARRAY['alltime','daily','weekly','monthly','yearly'] LOOP
  EXECUTE format('ALTER MATERIALIZED VIEW public.%I RENAME TO %I','_mv_wordle_'||p||'_leaderboard','_wr3_'||p||'_leaderboard_independent_mv');
  EXECUTE format('ALTER MATERIALIZED VIEW public.%I SET SCHEMA wordrama_pack_preview','_wr3_'||p||'_leaderboard_independent_mv');
  EXECUTE format('ALTER MATERIALIZED VIEW public.%I RENAME TO %I','_mv_wordle_'||p||'_leaderboard_wr3_backup','_mv_wordle_'||p||'_leaderboard');
 END LOOP;
END $swap$;
ALTER MATERIALIZED VIEW public._mv_team_wordle_stats_wr3_backup RENAME TO _mv_team_wordle_stats;
DO $rebind$
DECLARE view_sql text; acl record;
BEGIN
 SELECT definition INTO view_sql FROM _wr3_saved_def WHERE name='team_view';
 EXECUTE 'CREATE VIEW public._v_team_leaderboard AS '||trim(trailing ';' from trim(view_sql));
 FOR acl IN SELECT object_name,grantee,string_agg(privilege_type,',' ORDER BY privilege_type) privileges
   FROM _wr3_acl_snapshot GROUP BY object_name,grantee LOOP
  IF acl.object_name='_v_team_leaderboard' THEN
   EXECUTE format('GRANT %s ON public.%I TO %s',acl.privileges,acl.object_name,
     CASE WHEN acl.grantee='PUBLIC' THEN 'PUBLIC' ELSE quote_ident(acl.grantee) END);
  END IF;
 END LOOP;
END $rebind$;
COMMIT;
-- Restore original RPC with wordrama_leaderboard_streak_page_rollback.sql.
