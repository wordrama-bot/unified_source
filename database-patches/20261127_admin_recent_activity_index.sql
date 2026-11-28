-- Support bounded recent-game lookups across all players.
-- Use BRIN to minimize storage and write overhead.
-- Administrative reporting only.
-- Run outside a transaction.

CREATE INDEX CONCURRENTLY IF NOT EXISTS
  idx_wordle_game_result_created_at_brin
ON public._wordle_game_result
USING brin (created_at)
WITH (
  pages_per_range = 32,
  autosummarize = on
);
