-- REVIEW CANDIDATE ONLY. Not applied. Trusted award scripts only; no HTTP writes.
BEGIN;
CREATE OR REPLACE FUNCTION public.wordrama_update_challenge_progress(
  p_player uuid, p_challenge uuid, p_status text, p_progress numeric
) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  challenge public._challenges%ROWTYPE;
  current_progress public._challenge_progress%ROWTYPE;
  current_level public._levels%ROWTYPE;
  remaining_xp bigint;
  next_level bigint;
  threshold bigint;
BEGIN
  IF p_player IS NULL OR p_challenge IS NULL OR p_status IS NULL OR p_progress IS NULL
    OR p_status NOT IN ('UNLOCKED','IN_PROGRESS','COMPLETE')
    OR p_progress::text IN ('NaN','Infinity','-Infinity')
    OR p_progress < 0 OR p_progress > 100
    OR (p_status = 'COMPLETE') <> (p_progress = 100)
  THEN RAISE EXCEPTION 'Invalid challenge progress'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(p_player::text || ':' || p_challenge::text, 0));
  SELECT * INTO STRICT challenge FROM public._challenges
    WHERE id = p_challenge AND is_active = true FOR SHARE;
  SELECT * INTO current_progress FROM public._challenge_progress
    WHERE player_id = p_player AND challenge_id = p_challenge FOR UPDATE;
  IF FOUND AND (current_progress.status IN ('COMPLETE','COMPLETED') OR current_progress.progress = 100) THEN
    RETURN to_jsonb(current_progress) || jsonb_build_object('prestige',
      (SELECT prestige FROM public._levels WHERE player = p_player));
  END IF;
  IF NOT FOUND THEN
    INSERT INTO public._challenge_progress (player_id, challenge_id, status, progress)
      VALUES (p_player, p_challenge, 'UNLOCKED', 0) RETURNING * INTO current_progress;
  END IF;
  IF p_progress < coalesce(current_progress.progress, 0) THEN
    RAISE EXCEPTION 'Challenge progress cannot regress';
  END IF;
  IF p_status = 'COMPLETE' THEN
    IF coalesce(challenge.coin_reward, 0) < 0 OR coalesce(challenge.xp_reward, 0) < 0 THEN
      RAISE EXCEPTION 'Invalid challenge reward';
    END IF;
    IF coalesce(challenge.xp_reward, 0) > 0 THEN
      SELECT * INTO STRICT current_level FROM public._levels WHERE player = p_player FOR UPDATE;
      remaining_xp := current_level.xp + challenge.xp_reward;
      next_level := current_level.level % 100;
      threshold := floor(50 * power(CASE WHEN next_level >= 50 THEN 1.061::double precision
        ELSE 1.08::double precision END, next_level - 1));
      WHILE remaining_xp >= threshold LOOP
        remaining_xp := remaining_xp - threshold;
        next_level := next_level + 1;
        EXIT WHEN remaining_xp < floor(50 * power(CASE WHEN next_level >= 50 THEN 1.061::double precision
          ELSE 1.08::double precision END, next_level - 1));
        threshold := floor(50 * power(CASE WHEN next_level >= 50 THEN 1.061::double precision
          ELSE 1.08::double precision END, next_level - 1));
      END LOOP;
      IF current_level.level >= 100 THEN next_level := (current_level.level / 100) * 100 + next_level; END IF;
      UPDATE public._levels SET xp = remaining_xp, level = next_level,
        prestige = next_level / 100, xp_to_next_level = threshold WHERE player = p_player;
    END IF;
    IF coalesce(challenge.coin_reward, 0) > 0 THEN
      PERFORM public.wordrama_change_coin_balance(p_player, challenge.coin_reward::bigint);
    END IF;
    IF challenge.avatar_entitlement_key IS NOT NULL THEN
      IF challenge.avatar_entitlement_key NOT LIKE 'AVATAR:%' THEN
        RAISE EXCEPTION 'Invalid challenge avatar reward';
      END IF;
      INSERT INTO public._player_entitlements
        (player_id, entitlement_key, entitlement_type, source_type, status, starts_at, expires_at, metadata)
      SELECT p_player, challenge.avatar_entitlement_key, 'AVATAR_STYLE', 'ACHIEVEMENT', 'ACTIVE', now(), NULL,
        jsonb_build_object('challengeId', p_challenge, 'source', 'challenge_reward')
      WHERE NOT EXISTS (SELECT 1 FROM public._player_entitlements e
        WHERE e.player_id = p_player AND e.entitlement_key = challenge.avatar_entitlement_key
          AND e.status = 'ACTIVE' AND e.revoked_at IS NULL AND e.starts_at <= now()
          AND (e.expires_at IS NULL OR e.expires_at > now()));
    END IF;
  END IF;
  UPDATE public._challenge_progress SET status = p_status, progress = p_progress
    WHERE id = current_progress.id RETURNING * INTO current_progress;
  RETURN to_jsonb(current_progress) || jsonb_build_object('prestige',
      (SELECT prestige FROM public._levels WHERE player = p_player));
END;
$$;
REVOKE ALL ON FUNCTION public.wordrama_update_challenge_progress(uuid,uuid,text,numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wordrama_update_challenge_progress(uuid,uuid,text,numeric) TO service_role;
COMMIT;
