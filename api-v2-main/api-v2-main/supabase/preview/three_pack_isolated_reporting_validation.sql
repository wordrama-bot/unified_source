-- READ-ONLY validation after the isolated preview MVs are populated.
-- Run only in an approved environment. No modifications.
-- All pack counts are zero before the first real result for these packs.

-- daily: existing population, historical totals, and unique keys preserved.
SELECT 'daily' AS period,
 (SELECT count(*) FROM public._mv_wordle_daily_leaderboard) AS baseline_rows,
 (SELECT count(*) FROM wordrama_pack_preview._wr3_daily_leaderboard_mv) AS preview_rows,
 (SELECT coalesce(sum(games_played),0) FROM public._mv_wordle_daily_leaderboard) AS baseline_games,
 (SELECT coalesce(sum(games_played),0) FROM wordrama_pack_preview._wr3_daily_leaderboard_mv) AS preview_games,
 (SELECT count(*)-count(DISTINCT (player, day, month, year)) FROM wordrama_pack_preview._wr3_daily_leaderboard_mv) AS duplicate_keys;
SELECT 'daily' AS period,
 count(*) FILTER (WHERE three_letter_games_won <> 0 OR three_letter_games_lost <> 0 OR three_letter_crazy_games_won <> 0 OR three_letter_crazy_games_lost <> 0 OR five_letter_unhinged_games_won <> 0 OR five_letter_unhinged_games_lost <> 0) AS unexpected_pack_rows
FROM wordrama_pack_preview._wr3_daily_leaderboard_mv;

-- weekly: existing population, historical totals, and unique keys preserved.
SELECT 'weekly' AS period,
 (SELECT count(*) FROM public._mv_wordle_weekly_leaderboard) AS baseline_rows,
 (SELECT count(*) FROM wordrama_pack_preview._wr3_weekly_leaderboard_mv) AS preview_rows,
 (SELECT coalesce(sum(games_played),0) FROM public._mv_wordle_weekly_leaderboard) AS baseline_games,
 (SELECT coalesce(sum(games_played),0) FROM wordrama_pack_preview._wr3_weekly_leaderboard_mv) AS preview_games,
 (SELECT count(*)-count(DISTINCT (player, week, year)) FROM wordrama_pack_preview._wr3_weekly_leaderboard_mv) AS duplicate_keys;
SELECT 'weekly' AS period,
 count(*) FILTER (WHERE three_letter_games_won <> 0 OR three_letter_games_lost <> 0 OR three_letter_crazy_games_won <> 0 OR three_letter_crazy_games_lost <> 0 OR five_letter_unhinged_games_won <> 0 OR five_letter_unhinged_games_lost <> 0) AS unexpected_pack_rows
FROM wordrama_pack_preview._wr3_weekly_leaderboard_mv;

-- monthly: existing population, historical totals, and unique keys preserved.
SELECT 'monthly' AS period,
 (SELECT count(*) FROM public._mv_wordle_monthly_leaderboard) AS baseline_rows,
 (SELECT count(*) FROM wordrama_pack_preview._wr3_monthly_leaderboard_mv) AS preview_rows,
 (SELECT coalesce(sum(games_played),0) FROM public._mv_wordle_monthly_leaderboard) AS baseline_games,
 (SELECT coalesce(sum(games_played),0) FROM wordrama_pack_preview._wr3_monthly_leaderboard_mv) AS preview_games,
 (SELECT count(*)-count(DISTINCT (player, month, year)) FROM wordrama_pack_preview._wr3_monthly_leaderboard_mv) AS duplicate_keys;
SELECT 'monthly' AS period,
 count(*) FILTER (WHERE three_letter_games_won <> 0 OR three_letter_games_lost <> 0 OR three_letter_crazy_games_won <> 0 OR three_letter_crazy_games_lost <> 0 OR five_letter_unhinged_games_won <> 0 OR five_letter_unhinged_games_lost <> 0) AS unexpected_pack_rows
FROM wordrama_pack_preview._wr3_monthly_leaderboard_mv;

-- yearly: existing population, historical totals, and unique keys preserved.
SELECT 'yearly' AS period,
 (SELECT count(*) FROM public._mv_wordle_yearly_leaderboard) AS baseline_rows,
 (SELECT count(*) FROM wordrama_pack_preview._wr3_yearly_leaderboard_mv) AS preview_rows,
 (SELECT coalesce(sum(games_played),0) FROM public._mv_wordle_yearly_leaderboard) AS baseline_games,
 (SELECT coalesce(sum(games_played),0) FROM wordrama_pack_preview._wr3_yearly_leaderboard_mv) AS preview_games,
 (SELECT count(*)-count(DISTINCT (player, year)) FROM wordrama_pack_preview._wr3_yearly_leaderboard_mv) AS duplicate_keys;
SELECT 'yearly' AS period,
 count(*) FILTER (WHERE three_letter_games_won <> 0 OR three_letter_games_lost <> 0 OR three_letter_crazy_games_won <> 0 OR three_letter_crazy_games_lost <> 0 OR five_letter_unhinged_games_won <> 0 OR five_letter_unhinged_games_lost <> 0) AS unexpected_pack_rows
FROM wordrama_pack_preview._wr3_yearly_leaderboard_mv;

-- alltime: existing population, historical totals, and unique keys preserved.
SELECT 'alltime' AS period,
 (SELECT count(*) FROM public._mv_wordle_alltime_leaderboard) AS baseline_rows,
 (SELECT count(*) FROM wordrama_pack_preview._wr3_alltime_leaderboard_mv) AS preview_rows,
 (SELECT coalesce(sum(games_played),0) FROM public._mv_wordle_alltime_leaderboard) AS baseline_games,
 (SELECT coalesce(sum(games_played),0) FROM wordrama_pack_preview._wr3_alltime_leaderboard_mv) AS preview_games,
 (SELECT count(*)-count(DISTINCT (player)) FROM wordrama_pack_preview._wr3_alltime_leaderboard_mv) AS duplicate_keys;
SELECT 'alltime' AS period,
 count(*) FILTER (WHERE three_letter_games_won <> 0 OR three_letter_games_lost <> 0 OR three_letter_crazy_games_won <> 0 OR three_letter_crazy_games_lost <> 0 OR five_letter_unhinged_games_won <> 0 OR five_letter_unhinged_games_lost <> 0) AS unexpected_pack_rows
FROM wordrama_pack_preview._wr3_alltime_leaderboard_mv;

-- Compare original columns only; new pack columns are appended.
-- Rows may differ during concurrent cron refreshes; compare at a synchronized checkpoint.
-- Ensure no preview objects are added to cron or exposed via PostgREST.
SELECT n.nspname,c.relname,c.relkind,c.relispopulated
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='wordrama_pack_preview' ORDER BY c.relkind,c.relname;
