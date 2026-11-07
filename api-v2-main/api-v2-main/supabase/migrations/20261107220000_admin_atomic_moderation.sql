-- Admin-only moderation transaction; no gameplay tables or functions changed.
CREATE OR REPLACE FUNCTION public.admin_set_player_ban(
  p_action text,
  p_player uuid,
  p_admin uuid,
  p_reason text,
  p_notes text DEFAULT NULL,
  p_expires_at timestamptz DEFAULT NULL,
  p_request_ip text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $$
DECLARE
  v_before jsonb := '[]'::jsonb;
  v_after jsonb := '[]'::jsonb;
  v_ban public._admin_bans%ROWTYPE;
  v_audit_id uuid;
BEGIN
  IF p_action NOT IN ('BAN','UNBAN') OR p_action IS NULL
     OR p_player IS NULL OR p_admin IS NULL
     OR NULLIF(btrim(p_reason), '') IS NULL
     OR length(p_reason) > 2000 THEN
    RAISE EXCEPTION 'Invalid moderation request';
  END IF;
  IF p_action = 'BAN' AND p_expires_at IS NOT NULL AND p_expires_at <= now() THEN
    RAISE EXCEPTION 'Ban expiry must be in the future';
  END IF;

  -- Serialize dashboard moderation for the same account.
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_player::text, 712));
  SELECT coalesce(jsonb_agg(to_jsonb(b)), '[]'::jsonb) INTO v_before
  FROM public._admin_bans b
  WHERE b.ban_type = 'PLAYER' AND b.ban_value = p_player::text AND b.is_active;

  IF p_action = 'BAN' THEN
    INSERT INTO public._admin_bans
      (ban_type, ban_value, reason, notes, created_by, expires_at, is_active, metadata)
    VALUES ('PLAYER', p_player::text, btrim(p_reason), nullif(btrim(p_notes), ''),
            p_admin, p_expires_at, true,
            jsonb_build_object('source','admin_dashboard','targetPlayerId',p_player::text))
    RETURNING * INTO v_ban;
    v_after := jsonb_build_array(to_jsonb(v_ban));
  ELSE
    WITH updated AS (
      UPDATE public._admin_bans b SET is_active = false
      WHERE b.ban_type = 'PLAYER' AND b.ban_value = p_player::text AND b.is_active
      RETURNING b.*
    )
    SELECT coalesce(jsonb_agg(to_jsonb(updated)), '[]'::jsonb) INTO v_after FROM updated;
  END IF;

  INSERT INTO public._moderation_actions
    (action_type, target_user_id, reason, performed_by, target_type, target_id,
     before_value, after_value, request_ip, user_agent, metadata)
  VALUES (
    CASE WHEN p_action = 'BAN' THEN 'PLAYER_BANNED' ELSE 'PLAYER_UNBANNED' END,
    p_player, btrim(p_reason), p_admin, 'PLAYER', p_player::text,
    v_before, v_after, p_request_ip, p_user_agent,
    jsonb_build_object('source','admin_dashboard','banCount',jsonb_array_length(v_after))
  ) RETURNING id INTO v_audit_id;

  RETURN jsonb_build_object('bans',v_after,'auditId',v_audit_id);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_set_player_ban(text,uuid,uuid,text,text,timestamptz,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_player_ban(text,uuid,uuid,text,text,timestamptz,text,text) TO service_role;
