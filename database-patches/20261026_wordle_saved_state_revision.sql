-- Wordrama: atomic, revision-checked Wordle game-state saves.
-- Deploy before the corresponding API release. Existing saved states remain intact.
ALTER TABLE public._wordle_saved_state
  ADD COLUMN IF NOT EXISTS state_revision bigint NOT NULL DEFAULT 0;

COMMENT ON COLUMN public._wordle_saved_state.state_revision IS
  'Monotonic server revision for optimistic concurrency on saved Wordle state';

CREATE OR REPLACE FUNCTION public.wordrama_save_wordle_state(
  p_player uuid,
  p_game_state json,
  p_expected_revision bigint
)
RETURNS TABLE (
  saved boolean,
  current_revision bigint,
  current_game_state json
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_revision bigint;
  v_state json;
BEGIN
  IF p_player IS NULL OR p_game_state IS NULL OR
     p_expected_revision IS NULL OR p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Invalid Wordle state save arguments';
  END IF;

  IF p_expected_revision = 0 THEN
    INSERT INTO public._wordle_saved_state (player, game_state, state_revision)
    VALUES (p_player, p_game_state, 1)
    ON CONFLICT (player) DO NOTHING
    RETURNING state_revision, game_state INTO v_revision, v_state;

    IF FOUND THEN
      RETURN QUERY SELECT true, v_revision, v_state;
      RETURN;
    END IF;
  END IF;

  UPDATE public._wordle_saved_state AS s
  SET game_state = p_game_state,
      state_revision = s.state_revision + 1
  WHERE s.player = p_player AND s.state_revision = p_expected_revision
  RETURNING s.state_revision, s.game_state INTO v_revision, v_state;

  IF FOUND THEN
    RETURN QUERY SELECT true, v_revision, v_state;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT false, s.state_revision, s.game_state
  FROM public._wordle_saved_state AS s
  WHERE s.player = p_player;
END;
$$;

-- Prevent invocation from the browser or ordinary authenticated sessions.
REVOKE ALL ON FUNCTION public.wordrama_save_wordle_state(uuid, json, bigint)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wordrama_save_wordle_state(uuid, json, bigint)
  TO service_role;
