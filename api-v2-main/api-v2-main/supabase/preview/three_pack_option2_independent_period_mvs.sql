-- Option 2: independent materialized leaderboard previews and unique indexes.
-- Private schema ONLY; no live MVs, indexes, cron jobs, or refreshes modified.
-- Rebuildable script: explicit DROP of preview-only MVs, then recreate.
-- Preserve legacy/live MVs and historical 2024 sources unchanged.

DROP MATERIALIZED VIEW IF EXISTS wordrama_pack_preview._wr3_daily_leaderboard_independent_mv;
CREATE MATERIALIZED VIEW wordrama_pack_preview._wr3_daily_leaderboard_independent_mv AS
SELECT * FROM wordrama_pack_preview._wr3_daily_leaderboard_independent
WITH NO DATA;
CREATE UNIQUE INDEX idx_wr3_daily_leaderboard_independent_unique
ON wordrama_pack_preview._wr3_daily_leaderboard_independent_mv (player, year, month, day);

DROP MATERIALIZED VIEW IF EXISTS wordrama_pack_preview._wr3_weekly_leaderboard_independent_mv;
CREATE MATERIALIZED VIEW wordrama_pack_preview._wr3_weekly_leaderboard_independent_mv AS
SELECT * FROM wordrama_pack_preview._wr3_weekly_leaderboard_independent
WITH NO DATA;
CREATE UNIQUE INDEX idx_wr3_weekly_leaderboard_independent_unique
ON wordrama_pack_preview._wr3_weekly_leaderboard_independent_mv (player, year, week);

DROP MATERIALIZED VIEW IF EXISTS wordrama_pack_preview._wr3_monthly_leaderboard_independent_mv;
CREATE MATERIALIZED VIEW wordrama_pack_preview._wr3_monthly_leaderboard_independent_mv AS
SELECT * FROM wordrama_pack_preview._wr3_monthly_leaderboard_independent
WITH NO DATA;
CREATE UNIQUE INDEX idx_wr3_monthly_leaderboard_independent_unique
ON wordrama_pack_preview._wr3_monthly_leaderboard_independent_mv (player, year, month);

DROP MATERIALIZED VIEW IF EXISTS wordrama_pack_preview._wr3_yearly_leaderboard_independent_mv;
CREATE MATERIALIZED VIEW wordrama_pack_preview._wr3_yearly_leaderboard_independent_mv AS
SELECT * FROM wordrama_pack_preview._wr3_yearly_leaderboard_independent
WITH NO DATA;
CREATE UNIQUE INDEX idx_wr3_yearly_leaderboard_independent_unique
ON wordrama_pack_preview._wr3_yearly_leaderboard_independent_mv (player, year);

-- Refresh each preview MV separately after creation; do not touch cron.
