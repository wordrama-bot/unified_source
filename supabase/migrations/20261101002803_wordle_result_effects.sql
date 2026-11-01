BEGIN;

-- NULL: legacy API owns effects; false: new API must finalize; true: finalized.
-- No default/backfill: applying this ahead of the API is safe for old writers.
ALTER TABLE public._wordle_game_result
  ADD COLUMN IF NOT EXISTS effects_completed boolean;

CREATE OR REPLACE FUNCTION public.finalize_wordle_result(
  p_player uuid, p_result_id uuid
) RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  r public._wordle_game_result%ROWTYPE;
  current_level public._levels%ROWTYPE;
  next_level bigint;
  remaining_xp bigint;
  threshold bigint;
  earned_prestige bigint;
  coins bigint;
  xp_award bigint;
BEGIN
  -- Serialize retries of this result, including simultaneous requests and
  -- retries after a lost response. Failures roll back ALL effects and marker.
  SELECT * INTO STRICT r FROM public._wordle_game_result
    WHERE id = p_result_id AND player = p_player FOR UPDATE;

  IF r.effects_completed IS NULL THEN
    RETURN jsonb_build_object('completed', true, 'legacy', true);
  END IF;

  IF NOT r.effects_completed THEN
    IF r.type <> 'CUSTOM' AND r.guess_count BETWEEN 1 AND 6 THEN
      -- Preserve the current reward mapping, including six-guess games.
      xp_award := (ARRAY[1000,150,100,50,30,20])[r.guess_count];
      coins := (ARRAY[25,15,5,4,3,2])[r.guess_count];
      SELECT * INTO STRICT current_level FROM public._levels
        WHERE player = p_player FOR UPDATE;
      remaining_xp := current_level.xp + xp_award;
      next_level := current_level.level % 100;
      threshold := floor(50 * power(
        CASE WHEN next_level >= 50 THEN 1.061::double precision
          ELSE 1.08::double precision END, next_level - 1));
      WHILE remaining_xp >= threshold LOOP
        remaining_xp := remaining_xp - threshold;
        next_level := next_level + 1;
        -- Match levels.ts: xp_to_next_level stores the last consumed threshold.
        EXIT WHEN remaining_xp < floor(50 * power(
          CASE WHEN next_level >= 50 THEN 1.061::double precision
            ELSE 1.08::double precision END, next_level - 1));
        threshold := floor(50 * power(
          CASE WHEN next_level >= 50 THEN 1.061::double precision
            ELSE 1.08::double precision END, next_level - 1));
      END LOOP;
      IF current_level.level >= 100 THEN
        next_level := (current_level.level / 100) * 100 + next_level;
      END IF;
      UPDATE public._levels SET xp = remaining_xp, level = next_level,
        prestige = next_level / 100, xp_to_next_level = threshold
        WHERE player = p_player;
      UPDATE public._ledger SET coin_balance = coin_balance + coins
        WHERE player = p_player;
      IF NOT FOUND THEN RAISE EXCEPTION 'Missing Wordle player ledger'; END IF;
    END IF;

    IF r.type = 'CUSTOM' AND r.share_code IS NOT NULL THEN
      UPDATE public._wordle_customs SET times_played = times_played + 1
        WHERE share_code = r.share_code;
      IF NOT FOUND THEN RAISE EXCEPTION 'Missing Wordle custom game'; END IF;
    END IF;

    -- Atomic UPSERT also serializes different results for the same streak.
    INSERT INTO public._wordle_streak
      (player, word_pack, type, current_streak, best_streak)
    VALUES (p_player, r.word_pack, r.type,
      CASE WHEN r.game_was_won THEN 1 ELSE 0 END,
      CASE WHEN r.game_was_won THEN 1 ELSE 0 END)
    ON CONFLICT (player, word_pack, type) DO UPDATE SET
      current_streak = CASE WHEN r.game_was_won
        THEN _wordle_streak.current_streak + 1 ELSE 0 END,
      best_streak = CASE WHEN r.game_was_won THEN greatest(
        _wordle_streak.best_streak, _wordle_streak.current_streak + 1)
        ELSE _wordle_streak.best_streak END;

    UPDATE public._wordle_game_result SET effects_completed = true
      WHERE id = r.id;
  END IF;

  SELECT prestige INTO earned_prestige FROM public._levels WHERE player = p_player;
  RETURN jsonb_build_object('completed', true, 'prestige', earned_prestige);
END;
$$;

REVOKE ALL ON FUNCTION public.finalize_wordle_result(uuid, uuid)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_wordle_result(uuid, uuid) TO service_role;

COMMIT;
