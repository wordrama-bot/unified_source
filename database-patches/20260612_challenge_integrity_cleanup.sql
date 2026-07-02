-- =====================================================
-- Wordrama Challenge Integrity Cleanup
-- Date: 2026-06-12
--
-- NOTE:
-- This migration was applied manually to production.
-- It is retained for audit purposes and future
-- environment rebuilds.
--
-- Changes:
-- 1. Rename "100 Games" → "100 Game Streak"
-- 2. Add is_active flag to challenges
-- 3. Retire Share on Socials
-- 4. Repair Play Together completions
-- 5. Repair King of the Castle completions
-- =====================================================

BEGIN;

----------------------------------------------------------
-- Rename "100 Games" → "100 Game Streak"
----------------------------------------------------------

UPDATE _challenges
SET
    name = '100 Game Streak',
    description = 'Win 100 games in a row'
WHERE id = '930824d0-e727-45a0-b7d7-ae366ddd9aaa';

----------------------------------------------------------
-- Add is_active flag to challenges
----------------------------------------------------------

ALTER TABLE _challenges
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

----------------------------------------------------------
-- Retire Share on Socials
----------------------------------------------------------

-- Reset all previously awarded progress
UPDATE _challenge_progress
SET
    status = 'UNLOCKED',
    progress = 0
WHERE challenge_id = '6586c8da-543f-4970-9bb5-e9d924378706';

-- Hide the challenge from future queries
UPDATE _challenges
SET is_active = FALSE
WHERE id = '6586c8da-543f-4970-9bb5-e9d924378706';

----------------------------------------------------------
-- Repair Play Together
----------------------------------------------------------

UPDATE _challenge_progress cp
SET
    status = 'COMPLETE',
    progress = 100
WHERE cp.challenge_id = '1c897692-483d-4e48-99bb-3d0227201c13'
  AND cp.player_id IN (
      SELECT player
      FROM _friends

      UNION

      SELECT friend_id
      FROM _friends
  );

----------------------------------------------------------
-- Repair King of the Castle
----------------------------------------------------------

UPDATE _challenge_progress cp
SET
    status = 'COMPLETE',
    progress = 100
WHERE cp.challenge_id = '08fa66af-723a-4e74-8963-5aaf700b4fa0'
  AND cp.player_id IN (

      SELECT player
      FROM _v_wordle_alltime_leaderboard
      WHERE alltime_rank = 1

      UNION

      SELECT player
      FROM _v_wordle_daily_leaderboard
      WHERE daily_rank = 1

      UNION

      SELECT player
      FROM _v_wordle_weekly_leaderboard
      WHERE weekly_rank = 1

      UNION

      SELECT player
      FROM _v_wordle_monthly_leaderboard
      WHERE monthly_rank = 1
  );

----------------------------------------------------------
-- Verification Queries
----------------------------------------------------------
--
-- Expected Share on Socials:
-- COMPLETE = 0
--
-- Expected Play Together:
-- COMPLETE ≈ 131
--
-- Expected King:
-- COMPLETE ≈ 71
--
-- SELECT c.name, cp.status, count(*)
-- FROM _challenge_progress cp
-- JOIN _challenges c ON c.id = cp.challenge_id
-- GROUP BY c.name, cp.status
-- ORDER BY c.name, cp.status;
--
----------------------------------------------------------

COMMIT;
