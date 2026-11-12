-- Option 2: generate explicit, logically ordered SELECT lists for a full rebuild.
-- READ ONLY: this query returns SQL text; it does not execute any DDL.
-- Input: current private preview schema. This is a column-order blueprint,
-- NOT a standalone cutover migration: preview objects depend on live views.
-- Every generated column is quoted and retains its PostgreSQL type.
--
-- Desired order: aggregate/period keys, THREE_LETTER, THREE_LETTER_CRAZY,
-- FOUR_LETTER, FIVE_LETTER, FIVE_LETTER_CRAZY, FIVE_LETTER_UNHINGED,
-- remaining packs, then rank columns in analogous pack order.
-- Non-pack columns retain their relative positions ahead of pack columns.
--
WITH objects AS (
 SELECT c.oid, c.relname, c.relkind,
  CASE WHEN c.relname LIKE '%daily%' THEN 'daily'
       WHEN c.relname LIKE '%weekly%' THEN 'weekly'
       WHEN c.relname LIKE '%monthly%' THEN 'monthly'
       WHEN c.relname LIKE '%yearly%' THEN 'yearly'
       ELSE 'alltime' END AS period
 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='wordrama_pack_preview' AND c.relkind IN ('v','m')
   AND c.relname LIKE '_wr3_%'
), cols AS (
 SELECT o.*,a.attnum,a.attname,
 CASE
  WHEN a.attname LIKE 'three_letter_crazy_%' OR a.attname LIKE '%rank_three_letter_crazy' THEN 2
  WHEN a.attname LIKE 'three_letter_%' OR a.attname LIKE '%rank_three_letter' THEN 1
  WHEN a.attname LIKE 'four_letter_%' OR a.attname LIKE '%rank_4_letter' THEN 3
  WHEN a.attname LIKE 'five_letter_unhinged_%' OR a.attname LIKE '%rank_five_letter_unhinged' THEN 6
  WHEN a.attname LIKE 'five_letter_crazy_%' OR a.attname LIKE '%rank_five_letter_crazy' THEN 5
  WHEN a.attname LIKE 'five_letter_%' OR a.attname LIKE '%rank_5_letter' THEN 4
  WHEN a.attname LIKE '%rank%' THEN 90
  WHEN a.attname LIKE '%_letter_%' THEN 20
  ELSE 0 END AS pack_group,
 CASE WHEN a.attname LIKE '%rank%' THEN 2 ELSE 1 END AS metric_group
 FROM objects o JOIN pg_attribute a ON a.attrelid=o.oid
 WHERE a.attnum>0 AND NOT a.attisdropped
), ordered AS (
 SELECT *,
 row_number() OVER (PARTITION BY oid ORDER BY
   CASE WHEN pack_group=0 THEN 0 WHEN metric_group=1 THEN 1 ELSE 2 END,
   pack_group, attnum) AS new_ordinal
 FROM cols
)
SELECT relname,relkind,count(*) AS column_count,
 string_agg(format('  src.%I',attname), E',\n' ORDER BY new_ordinal) AS ordered_projection,
 string_agg(format('%s: %I (%s)',new_ordinal,attname,attnum), E'\n' ORDER BY new_ordinal) AS order_audit
FROM ordered
GROUP BY relname,relkind
ORDER BY relkind,relname;

-- IMPORTANT:
-- 1. Validate all pack-name patterns, especially ranks and long-letter names.
-- 2. Rebuild SQL must compute pack ranks and counts from canonical results.
-- 3. The preview uses old overall totals/ranks and cannot simply be promoted.
-- 4. Historical 2024 recovery objects must be retained.
-- 5. This blueprint is not executable replacement or rollback SQL.
