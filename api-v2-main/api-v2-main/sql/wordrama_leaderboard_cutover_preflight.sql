-- READ-ONLY PRE-CUTOVER GATES. Execute before any object promotion.
-- Zero writes; review ALL returned rows. No CASCADE or DROP permitted.
WITH live AS (
 SELECT c.oid,c.relname,c.relkind FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='public' AND c.relname IN ('_mv_wordle_alltime_leaderboard','_mv_wordle_daily_leaderboard','_mv_wordle_weekly_leaderboard','_mv_wordle_monthly_leaderboard','_mv_wordle_yearly_leaderboard')
), dependencies AS (
 SELECT DISTINCT l.relname live_object, dep.oid::regclass::text dependent_object,dep.relkind dependent_kind
 FROM live l JOIN pg_depend d ON d.refobjid=l.oid
 JOIN pg_rewrite rw ON rw.oid=d.objid
 JOIN pg_class dep ON dep.oid=rw.ev_class AND dep.oid<>l.oid
)
SELECT * FROM dependencies ORDER BY live_object,dependent_object;

-- Critical: _mv_team_wordle_stats depends on ALL FIVE existing leaderboard MVs.
-- Renaming an MV does not retarget dependent OIDs. A simple rename/swap is NOT a valid cutover.
-- The dependent MV must be explicitly rebuilt/rebound or the approach redesigned.

SELECT p.period,
 (SELECT count(*) FROM public._mv_wordle_alltime_leaderboard) AS live_alltime_rows,
 (SELECT count(*) FROM wordrama_pack_preview._wr3_alltime_leaderboard_independent_mv) AS preview_alltime_rows
FROM (VALUES ('alltime')) p(period);

-- Confirm the replacement pack columns in all five independent preview MVs.
WITH periods AS (SELECT unnest(ARRAY['alltime','daily','weekly','monthly','yearly']) period),
 packs AS (SELECT unnest(ARRAY['three_letter','three_letter_crazy','five_letter_unhinged']) pack)
SELECT p.period,k.pack,
 bool_and(a.attname IS NOT NULL) all_columns_present
FROM periods p CROSS JOIN packs k
CROSS JOIN LATERAL (VALUES
 ('_' || 'wr3_' || p.period || '_leaderboard_independent_mv',p.period || '_rank_' || k.pack),
 ('_' || 'wr3_' || p.period || '_leaderboard_independent_mv',k.pack || '_games_won'),
 ('_' || 'wr3_' || p.period || '_leaderboard_independent_mv',k.pack || '_games_lost')
) required(table_name,column_name)
LEFT JOIN pg_namespace n ON n.nspname='wordrama_pack_preview'
LEFT JOIN pg_class c ON c.relnamespace=n.oid AND c.relname=required.table_name
LEFT JOIN pg_attribute a ON a.attrelid=c.oid AND a.attname=required.column_name AND a.attnum>0 AND NOT a.attisdropped
GROUP BY p.period,k.pack ORDER BY p.period,k.pack;

-- Verify execution privileges before/after RPC deployment.
SELECT p.proname,p.prosecdef AS security_definer,p.proacl
FROM pg_proc p WHERE p.oid='public.wordrama_leaderboard_streak_page(text,text,text,integer,integer,integer,integer,integer,integer)'::regprocedure;
