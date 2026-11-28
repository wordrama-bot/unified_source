-- Support bounded recent-game lookups across all players.
-- Administrative reporting only.
-- Run outside a transaction.

CREATE INDEX CONCURRENTLY IF NOT EXISTS
  idx_wordle_game_result_created_at_id
ON public._wordle_game_result (created_at DESC, id DESC);
