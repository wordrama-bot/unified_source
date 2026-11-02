-- Apply on staging before this API patch. Production requires separate approval.
-- No existing invitations or friendships are repaired or deleted by installation.
BEGIN;
CREATE OR REPLACE FUNCTION public.wordrama_friend_action(
  p_player uuid, p_target uuid, p_action text
) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  invitation public._friend_requests%ROWTYPE;
  peer uuid;
  removed_id uuid;
  removed_friend public._friends%ROWTYPE;
BEGIN
  IF p_player IS NULL OR p_target IS NULL OR p_action IS NULL
    OR p_action NOT IN ('invite','accept','decline','cancel','remove') THEN
    RAISE EXCEPTION 'Invalid friend action';
  END IF;
  IF p_action IN ('invite','remove') THEN
    peer := p_target;
  ELSE
    SELECT * INTO invitation FROM public._friend_requests WHERE id = p_target;
    IF NOT FOUND OR invitation.status IS DISTINCT FROM 'PENDING'
      OR (p_action = 'cancel' AND invitation.sending_player IS DISTINCT FROM p_player)
      OR (p_action <> 'cancel' AND invitation.receiving_player IS DISTINCT FROM p_player)
    THEN RAISE EXCEPTION 'Friend request unavailable'; END IF;
    peer := CASE WHEN invitation.sending_player = p_player
      THEN invitation.receiving_player ELSE invitation.sending_player END;
  END IF;
  IF peer IS NULL OR peer = p_player THEN RAISE EXCEPTION 'Invalid friend target'; END IF;

  -- Every lifecycle action uses the same unordered-pair lock, across API workers.
  -- Obtain it before row locks to avoid accept/cancel/removal lock inversions.
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(
    'wordrama-friends:' || least(p_player,peer)::text || ':' || greatest(p_player,peer)::text, 0));

  IF p_action = 'invite' THEN
    IF NOT EXISTS (SELECT 1 FROM public._players WHERE id = p_player)
      OR NOT EXISTS (SELECT 1 FROM public._players WHERE id = peer)
    THEN RAISE EXCEPTION 'Player not found'; END IF;
    IF EXISTS (SELECT 1 FROM public._friends WHERE
      (player = p_player AND friend_id = peer) OR (player = peer AND friend_id = p_player))
    THEN RAISE EXCEPTION 'Already friends'; END IF;
    IF EXISTS (SELECT 1 FROM public._friend_requests WHERE
      (sending_player = p_player AND receiving_player = peer)
      OR (sending_player = peer AND receiving_player = p_player))
    THEN RAISE EXCEPTION 'Friend request already exists'; END IF;
    INSERT INTO public._friend_requests(sending_player,receiving_player,status)
      VALUES (p_player,peer,'PENDING') RETURNING * INTO invitation;
    RETURN to_jsonb(invitation);
  ELSIF p_action = 'remove' THEN
    SELECT * INTO removed_friend FROM public._friends
      WHERE player = p_player AND friend_id = peer LIMIT 1;
    DELETE FROM public._friends WHERE
      (player = p_player AND friend_id = peer) OR (player = peer AND friend_id = p_player);
    IF NOT FOUND THEN RAISE EXCEPTION 'Friendship unavailable'; END IF;
    IF removed_friend.id IS NOT NULL THEN RETURN to_jsonb(removed_friend); END IF;
    RETURN jsonb_build_object('id',peer);
  END IF;

  -- Recheck after waiting for another transaction. A stale request never succeeds.
  SELECT * INTO invitation FROM public._friend_requests WHERE id = p_target FOR UPDATE;
  IF NOT FOUND OR invitation.status IS DISTINCT FROM 'PENDING'
    OR (p_action = 'cancel' AND invitation.sending_player IS DISTINCT FROM p_player)
    OR (p_action <> 'cancel' AND invitation.receiving_player IS DISTINCT FROM p_player)
    OR NOT ((invitation.sending_player = p_player AND invitation.receiving_player = peer)
      OR (invitation.sending_player = peer AND invitation.receiving_player = p_player))
  THEN RAISE EXCEPTION 'Friend request unavailable'; END IF;

  IF p_action = 'accept' THEN
    INSERT INTO public._friends(player,friend_id)
      SELECT p_player,peer WHERE NOT EXISTS
        (SELECT 1 FROM public._friends WHERE player = p_player AND friend_id = peer);
    INSERT INTO public._friends(player,friend_id)
      SELECT peer,p_player WHERE NOT EXISTS
        (SELECT 1 FROM public._friends WHERE player = peer AND friend_id = p_player);
  END IF;
  DELETE FROM public._friend_requests WHERE id = invitation.id RETURNING id INTO removed_id;
  IF removed_id IS NULL THEN RAISE EXCEPTION 'Friend request unavailable'; END IF;
  RETURN jsonb_build_object('requestId',removed_id,'status',
    CASE p_action WHEN 'accept' THEN 'accepted' WHEN 'decline' THEN 'declined' ELSE 'cancelled' END);
END;
$$;
REVOKE ALL ON FUNCTION public.wordrama_friend_action(uuid,uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.wordrama_friend_action(uuid,uuid,text) TO service_role;
-- All writes go through the authenticated API. RLS cannot protect TRUNCATE.
REVOKE INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
  ON public._friends,public._friend_requests FROM PUBLIC,anon,authenticated;
COMMIT;
