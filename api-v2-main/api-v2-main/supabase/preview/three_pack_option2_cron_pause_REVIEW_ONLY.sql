-- REVIEW ONLY. Requires explicit production cutover approval.
-- Run as a separate controlled operation before dropping any live reporting objects.
-- Transactional guard ensures the exact six active reporting jobs are present.
BEGIN;
DO $check$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobid=11 AND jobname='refresh-wordle-daily-leaderboard' AND active=true) THEN RAISE EXCEPTION 'Unexpected reporting cron job 11 (refresh-wordle-daily-leaderboard)'; END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobid=12 AND jobname='refresh-wordle-weekly-leaderboard' AND active=true) THEN RAISE EXCEPTION 'Unexpected reporting cron job 12 (refresh-wordle-weekly-leaderboard)'; END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobid=13 AND jobname='refresh-wordle-monthly-leaderboard' AND active=true) THEN RAISE EXCEPTION 'Unexpected reporting cron job 13 (refresh-wordle-monthly-leaderboard)'; END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobid=14 AND jobname='refresh-wordle-yearly-leaderboard' AND active=true) THEN RAISE EXCEPTION 'Unexpected reporting cron job 14 (refresh-wordle-yearly-leaderboard)'; END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobid=16 AND jobname='refresh-wordle-alltime-leaderboard' AND active=true) THEN RAISE EXCEPTION 'Unexpected reporting cron job 16 (refresh-wordle-alltime-leaderboard)'; END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobid=18 AND jobname='refresh-team-wordle-stats' AND active=true) THEN RAISE EXCEPTION 'Unexpected reporting cron job 18 (refresh-team-wordle-stats)'; END IF;
END $check$;
SELECT cron.alter_job(11, active => false);
SELECT cron.alter_job(12, active => false);
SELECT cron.alter_job(13, active => false);
SELECT cron.alter_job(14, active => false);
SELECT cron.alter_job(16, active => false);
SELECT cron.alter_job(18, active => false);
COMMIT;
