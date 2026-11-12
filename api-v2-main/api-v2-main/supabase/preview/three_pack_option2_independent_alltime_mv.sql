-- Independent All-Time MV, private preview only.
DROP MATERIALIZED VIEW IF EXISTS wordrama_pack_preview._wr3_alltime_leaderboard_independent_mv;
CREATE MATERIALIZED VIEW wordrama_pack_preview._wr3_alltime_leaderboard_independent_mv AS
SELECT * FROM wordrama_pack_preview._wr3_alltime_leaderboard_independent
WITH NO DATA;
CREATE UNIQUE INDEX idx_wr3_alltime_leaderboard_independent_unique
ON wordrama_pack_preview._wr3_alltime_leaderboard_independent_mv (player);
-- Refresh separately when statement timeout permits.
