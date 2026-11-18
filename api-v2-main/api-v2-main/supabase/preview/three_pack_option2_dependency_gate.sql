-- Option 2: fail-closed dependency preflight. READ ONLY (except temporary PL/pgSQL execution state).
-- Run immediately before any proposed cutover; abort if dependency inventory changes.
-- This does NOT perform cutover, drop, refresh, or change production objects.
-- Temporary preview-schema dependencies are intentionally excluded from this gate;
-- preview schema must be retired separately before any live drop/rebuild.
DO $preflight$
DECLARE
 unexpected text;
 missing text;
BEGIN
 WITH expected(name,kind) AS (VALUES
  ('_v_wordle_alltime_leaderboard','v'),
  ('_v_wordle_alltime_stats','v'),
  ('_v_wordle_alltime_stats_by_type','v'),
  ('_v_wordle_alltime_stats_with_2024_preview','v'),
  ('_v_wordle_daily_leaderboard','v'),
  ('_v_wordle_daily_stats','v'),
  ('_v_wordle_daily_stats_by_type','v'),
  ('_v_wordle_monthly_leaderboard','v'),
  ('_v_wordle_monthly_stats','v'),
  ('_v_wordle_monthly_stats_by_type','v'),
  ('_v_wordle_weekly_leaderboard','v'),
  ('_v_wordle_weekly_stats','v'),
  ('_v_wordle_weekly_stats_by_type','v'),
  ('_v_wordle_yearly_leaderboard','v'),
  ('_v_wordle_yearly_stats','v'),
  ('_v_wordle_yearly_stats_by_type','v'),
  ('_v_team_leaderboard','v'),
  ('_mv_team_wordle_stats','m'),
  ('_mv_team_wordle_stats_legacy','m'),
  ('_mv_wordle_alltime_leaderboard','m'),
  ('_mv_wordle_daily_leaderboard','m'),
  ('_mv_wordle_monthly_leaderboard','m'),
  ('_mv_wordle_weekly_leaderboard','m'),
  ('_mv_wordle_yearly_leaderboard','m'),
  ('_mv_wordle_alltime_leaderboard_legacy','m'),
  ('_mv_wordle_daily_leaderboard_legacy','m'),
  ('_mv_wordle_monthly_leaderboard_legacy','m'),
  ('_mv_wordle_weekly_leaderboard_legacy','m'),
  ('_mv_wordle_yearly_leaderboard_legacy','m'),
  ('_mv_wordle_stats_2024','m'),
  ('_mv_wordle_stats_2024_by_type','m')
 ),
 roots AS (SELECT c.oid FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('_v_wordle_alltime_leaderboard','_v_wordle_alltime_stats','_v_wordle_alltime_stats_by_type','_v_wordle_alltime_stats_with_2024_preview','_v_wordle_daily_leaderboard','_v_wordle_daily_stats','_v_wordle_daily_stats_by_type','_v_wordle_monthly_leaderboard','_v_wordle_monthly_stats','_v_wordle_monthly_stats_by_type','_v_wordle_weekly_leaderboard','_v_wordle_weekly_stats','_v_wordle_weekly_stats_by_type','_v_wordle_yearly_leaderboard','_v_wordle_yearly_stats','_v_wordle_yearly_stats_by_type')),
 recursive_deps AS (
  WITH RECURSIVE walk(oid) AS (
   SELECT oid FROM roots
   UNION
   SELECT rw.ev_class FROM walk w JOIN pg_depend d ON d.refobjid=w.oid
   JOIN pg_rewrite rw ON rw.oid=d.objid JOIN pg_class child ON child.oid=rw.ev_class
   WHERE child.oid<>w.oid AND child.relkind IN ('v','m')
  ) SELECT DISTINCT c.relname,c.relkind,n.nspname FROM walk w JOIN pg_class c ON c.oid=w.oid JOIN pg_namespace n ON n.oid=c.relnamespace
 )
 SELECT string_agg(format('%I.%I (%s)',d.nspname,d.relname,d.relkind),', ') INTO unexpected
 FROM recursive_deps d LEFT JOIN expected e ON e.name=d.relname AND e.kind=d.relkind::text
 WHERE (e.name IS NULL OR d.nspname<>'public') AND d.nspname <> 'wordrama_pack_preview';
 IF unexpected IS NOT NULL THEN RAISE EXCEPTION 'Option 2 BLOCKED: untracked view/MV dependencies: %',unexpected; END IF;
 WITH expected(name,kind) AS (VALUES
  ('_v_wordle_alltime_leaderboard','v'),
  ('_v_wordle_alltime_stats','v'),
  ('_v_wordle_alltime_stats_by_type','v'),
  ('_v_wordle_alltime_stats_with_2024_preview','v'),
  ('_v_wordle_daily_leaderboard','v'),
  ('_v_wordle_daily_stats','v'),
  ('_v_wordle_daily_stats_by_type','v'),
  ('_v_wordle_monthly_leaderboard','v'),
  ('_v_wordle_monthly_stats','v'),
  ('_v_wordle_monthly_stats_by_type','v'),
  ('_v_wordle_weekly_leaderboard','v'),
  ('_v_wordle_weekly_stats','v'),
  ('_v_wordle_weekly_stats_by_type','v'),
  ('_v_wordle_yearly_leaderboard','v'),
  ('_v_wordle_yearly_stats','v'),
  ('_v_wordle_yearly_stats_by_type','v'),
  ('_v_team_leaderboard','v'),
  ('_mv_team_wordle_stats','m'),
  ('_mv_team_wordle_stats_legacy','m'),
  ('_mv_wordle_alltime_leaderboard','m'),
  ('_mv_wordle_daily_leaderboard','m'),
  ('_mv_wordle_monthly_leaderboard','m'),
  ('_mv_wordle_weekly_leaderboard','m'),
  ('_mv_wordle_yearly_leaderboard','m'),
  ('_mv_wordle_alltime_leaderboard_legacy','m'),
  ('_mv_wordle_daily_leaderboard_legacy','m'),
  ('_mv_wordle_monthly_leaderboard_legacy','m'),
  ('_mv_wordle_weekly_leaderboard_legacy','m'),
  ('_mv_wordle_yearly_leaderboard_legacy','m'),
  ('_mv_wordle_stats_2024','m'),
  ('_mv_wordle_stats_2024_by_type','m')
 ) SELECT string_agg(e.name,', ') INTO missing FROM expected e
 LEFT JOIN pg_class c ON c.relname=e.name AND c.relnamespace='public'::regnamespace AND c.relkind::text=e.kind
 WHERE c.oid IS NULL;
 IF missing IS NOT NULL THEN RAISE EXCEPTION 'Option 2 BLOCKED: missing/changed expected objects: %',missing; END IF;
 RAISE NOTICE 'Option 2 dependency inventory matches 17 views and 14 materialized views; no cutover executed.';
END
$preflight$;
