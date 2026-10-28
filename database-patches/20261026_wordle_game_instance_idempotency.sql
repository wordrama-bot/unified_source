-- Wordrama: Game-instance idempotency
-- October 26, 2026
--
-- Each independently started game can produce one result.
-- Different games may legitimately have identical solutions.
--
-- Legacy results without a game_instance_id remain supported.

ALTER TABLE public._wordle_game_result
ADD COLUMN IF NOT EXISTS game_instance_id uuid;

COMMENT ON COLUMN public._wordle_game_result.game_instance_id IS
'Stable identifier for a single gameplay instance. Prevents duplicate results across retries and refreshes.';

-- Enforce one recorded result per player and game instance.
-- Historical results and older queued submissions with NULL IDs
-- are unaffected.

CREATE UNIQUE INDEX IF NOT EXISTS
  uq_wordle_result_player_game_instance
ON public._wordle_game_result (
  player,
  game_instance_id
)
WHERE game_instance_id IS NOT NULL;