-- REVIEW CANDIDATE ONLY. Not applied. Existing invalid rows are not repaired here.
BEGIN;
-- This fails on existing duplicate pairs; inspect them before approving application.
CREATE UNIQUE INDEX IF NOT EXISTS friend_requests_unordered_pair_unique
  ON public._friend_requests
  (least(sending_player, receiving_player), greatest(sending_player, receiving_player));
-- NOT VALID preserves old rows while enforcing this rule for every new write.
ALTER TABLE public._friend_requests ADD CONSTRAINT friend_requests_no_self
  CHECK (sending_player <> receiving_player) NOT VALID;
COMMIT;
