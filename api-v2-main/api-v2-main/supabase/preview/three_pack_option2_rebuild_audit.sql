-- OPTION 2: FULL REBUILD / LOGICAL COLUMN ORDER. READ-ONLY DESIGN AUDIT.
-- Feature branch only. No DDL in this file.
-- DO NOT run a cutover until self-contained definitions + full rollback are prepared.
--
-- Target order: THREE_LETTER, THREE_LETTER_CRAZY, FOUR_LETTER,
-- FIVE_LETTER, FIVE_LETTER_CRAZY, FIVE_LETTER_UNHINGED, SIX_LETTER, ...
-- Within each pack preserve the original metric order (won/lost/won_in_1..6).
-- New-pack columns must NOT simply be appended.
--
-- Discovered live dependency chain:
-- daily stats -> weekly/monthly/yearly stats -> alltime stats ->
-- alltime stats with 2024 -> leaderboard views -> leaderboard MVs.
-- Daily stats by type -> weekly/monthly/yearly by type -> alltime by type.
-- Legacy leaderboard MVs depend on the same leaderboard views.
-- 2024 snapshot MVs depend on yearly stats/by-type: preserve data and definition.
-- Preview schema views depend on live public views: cannot directly rename.
--
-- 1. Show expected column order across ALL five preview stats views.
WITH periods AS (SELECT unnest(ARRAY['daily','weekly','monthly','yearly','alltime']) period),
columns AS (
 SELECT p.period,a.attnum,a.attname,
 CASE
  WHEN a.attname LIKE 'three_letter_crazy_%' THEN 2
  WHEN a.attname LIKE 'three_letter_%' THEN 1
  WHEN a.attname LIKE 'four_letter_%' THEN 3
  WHEN a.attname LIKE 'five_letter_unhinged_%' THEN 6
  WHEN a.attname LIKE 'five_letter_crazy_%' THEN 5
  WHEN a.attname LIKE 'five_letter_%' THEN 4
  ELSE 99 END AS pack_position
 FROM periods p
 JOIN pg_class c ON c.oid=format('wordrama_pack_preview._wr3_%s_stats',p.period)::regclass
 JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped
)
SELECT period,pack_position,attnum,attname
FROM columns WHERE pack_position<99
ORDER BY period,pack_position,attnum;

-- 2. All dependent reporting objects (including legacy).
SELECT DISTINCT src.relname AS dependent,src.relkind AS dependent_kind,
 ref.relname AS referenced
FROM pg_rewrite rw
JOIN pg_class src ON src.oid=rw.ev_class
JOIN pg_namespace sn ON sn.oid=src.relnamespace
JOIN pg_depend d ON d.objid=rw.oid
JOIN pg_class ref ON ref.oid=d.refobjid
JOIN pg_namespace rn ON rn.oid=ref.relnamespace
WHERE sn.nspname='public' AND rn.nspname='public'
 AND src.oid<>ref.oid AND ref.relname LIKE '_v_wordle_%'
 AND src.relkind IN ('v','m')
ORDER BY referenced,dependent;

-- 3. Index definitions to restore after MV recreation.
SELECT schemaname,tablename,indexname,indexdef
FROM pg_indexes
WHERE schemaname='public' AND (
 tablename LIKE '_mv_wordle_%leaderboard%'
 OR tablename LIKE '_mv_wordle_stats_2024%')
ORDER BY tablename,indexname;

-- 4. Explicit grants to restore; check defaults and ownership separately.
SELECT table_schema,table_name,grantee,privilege_type
FROM information_schema.role_table_grants
WHERE table_schema='public'
 AND (table_name LIKE '_v_wordle_%' OR table_name LIKE '_mv_wordle_%')
ORDER BY table_name,grantee,privilege_type;

-- 5. Capture current SQL definitions before any DDL. Store results OFF DATABASE.
SELECT n.nspname,c.relname,c.relkind,
 pg_get_viewdef(c.oid,true) AS definition
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public'
 AND (c.relname LIKE '_v_wordle_%' OR c.relname LIKE '_mv_wordle_%')
 AND c.relkind IN ('v','m')
ORDER BY c.relname;

-- IMPORTANT: Do not automatically drop _mv_wordle_stats_2024_recovered
-- or _wordle_wrapped_2024. Preserve historical data sources, not only SQL.
-- Preserve cron jobs, leaderboard RPC, permissions, MV indexes, and all consumers.
-- Migration must explicitly handle a player who has ONLY new-pack results.
-- Stage, validate, then obtain explicit execution approval for live cutover.
