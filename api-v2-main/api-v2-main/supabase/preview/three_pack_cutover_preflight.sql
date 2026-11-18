-- READ-ONLY cutover preflight. Run each SELECT separately via Supabase SQL interface.
-- No production reporting objects are changed by this file.
-- BLOCKER: preview views depend on live public views; cannot DROP live views
-- and rename preview views without rebuilding their definitions.
-- Never DROP CASCADE, never modify result/streak/reward/history tables.

-- 1. Check that existing view columns are an exact ordinal/type prefix of preview.
WITH periods AS (SELECT unnest(ARRAY['daily','weekly','monthly','yearly','alltime']) AS period),
cols AS (
 SELECT p.period, a.attnum, a.attname, format_type(a.atttypid,a.atttypmod) AS data_type, 'live' AS source
 FROM periods p JOIN pg_class c ON c.oid=format('public._v_wordle_%s_stats',p.period)::regclass
 JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped
 UNION ALL
 SELECT p.period, a.attnum, a.attname, format_type(a.atttypid,a.atttypmod), 'preview'
 FROM periods p JOIN pg_class c ON c.oid=format('wordrama_pack_preview._wr3_%s_stats',p.period)::regclass
 JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped
)
SELECT l.period,l.attnum,l.attname AS live_name,p.attname AS preview_name,
 l.data_type AS live_type,p.data_type AS preview_type
FROM cols l LEFT JOIN cols p ON p.period=l.period AND p.attnum=l.attnum AND p.source='preview'
WHERE l.source='live' AND (p.attname IS DISTINCT FROM l.attname OR p.data_type IS DISTINCT FROM l.data_type)
ORDER BY l.period,l.attnum;

-- 2. All preview view dependencies on live reporting objects.
SELECT DISTINCT src.relname AS preview_view, ref.relname AS live_dependency
FROM pg_rewrite rw JOIN pg_class src ON src.oid=rw.ev_class
JOIN pg_namespace sn ON sn.oid=src.relnamespace
JOIN pg_depend d ON d.objid=rw.oid
JOIN pg_class ref ON ref.oid=d.refobjid
JOIN pg_namespace rn ON rn.oid=ref.relnamespace
WHERE sn.nspname='wordrama_pack_preview' AND rn.nspname='public'
AND (ref.relname LIKE '_v_wordle_%' OR ref.relname LIKE '_mv_wordle_%')
ORDER BY 1,2;

-- 3. Verify today's test games appear in old and preview overall totals.
SELECT p.player,p.games_played AS preview_games,b.games_played AS live_games,
p.three_letter_games_won,p.three_letter_games_lost,
p.three_letter_crazy_games_won,p.three_letter_crazy_games_lost,
p.five_letter_unhinged_games_won,p.five_letter_unhinged_games_lost
FROM wordrama_pack_preview._wr3_daily_leaderboard_mv p
LEFT JOIN public._mv_wordle_daily_leaderboard b
 ON b.player=p.player AND b.day=p.day AND b.month=p.month AND b.year=p.year
WHERE p.player='53c85b68-73bf-40ab-8d1e-b15fe1be64ed'
AND p.day=11 AND p.month=11 AND p.year=2026;

-- 4. Compare all-time historical totals without modifying 2024 sources.
SELECT p.player,p.games_played AS preview_games,b.games_played AS live_games
FROM wordrama_pack_preview._wr3_alltime_stats p
JOIN public._v_wordle_alltime_stats b ON b.player=p.player
WHERE p.player='53c85b68-73bf-40ab-8d1e-b15fe1be64ed';

-- Cutover cannot be approved solely from these checks.
-- Next: create self-contained replacement definitions, dependency-ordered rollback,
-- preserve unique indexes and privileges, update leaderboard RPC, and test on staging.
