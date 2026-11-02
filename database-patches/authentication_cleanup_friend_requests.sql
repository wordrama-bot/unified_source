-- REVIEW CANDIDATE ONLY. Not applied. Existing invalid rows are not repaired here.
BEGIN;
-- Read-only review on 2026-11-02 found one reciprocal pair in production.
-- Do not automatically delete either request. Resolve it only with explicit approval.
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM public._friend_requests
    GROUP BY least(sending_player, receiving_player), greatest(sending_player, receiving_player)
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Resolve existing reciprocal friend requests before applying this candidate';
  END IF;
END $$;
-- This also fails safely if a duplicate is inserted after the preflight check.
CREATE UNIQUE INDEX IF NOT EXISTS friend_requests_unordered_pair_unique
  ON public._friend_requests
  (least(sending_player, receiving_player), greatest(sending_player, receiving_player));
-- NOT VALID preserves old rows while enforcing this rule for every new write.
ALTER TABLE public._friend_requests ADD CONSTRAINT friend_requests_no_self
  CHECK (sending_player <> receiving_player) NOT VALID;
COMMIT;
