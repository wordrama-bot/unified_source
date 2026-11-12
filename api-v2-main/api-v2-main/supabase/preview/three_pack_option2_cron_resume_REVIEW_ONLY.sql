-- REVIEW ONLY. Requires explicit production cutover approval.
-- Execute ONLY after all replacement MVs have been populated, indexed,
-- verified, and concurrent refresh capability confirmed.
BEGIN;
DO $check$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobid=11 AND jobname='refresh-wordle-daily-leaderboard' AND active=false) THEN RAISE EXCEPTION 'Unexpected paused cron job 11 (refresh-wordle-daily-leaderboard)'; END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobid=12 AND jobname='refresh-wordle-weekly-leaderboard' AND active=false) THEN RAISE EXCEPTION 'Unexpected paused cron job 12 (refresh-wordle-weekly-leaderboard)'; END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobid=13 AND jobname='refresh-wordle-monthly-leaderboard' AND active=false) THEN RAISE EXCEPTION 'Unexpected paused cron job 13 (refresh-wordle-monthly-leaderboard)'; END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobid=14 AND jobname='refresh-wordle-yearly-leaderboard' AND active=false) THEN RAISE EXCEPTION 'Unexpected paused cron job 14 (refresh-wordle-yearly-leaderboard)'; END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobid=16 AND jobname='refresh-wordle-alltime-leaderboard' AND active=false) THEN RAISE EXCEPTION 'Unexpected paused cron job 16 (refresh-wordle-alltime-leaderboard)'; END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobid=18 AND jobname='refresh-team-wordle-stats' AND active=false) THEN RAISE EXCEPTION 'Unexpected paused cron job 18 (refresh-team-wordle-stats)'; END IF;
END $check$;
SELECT cron.alter_job(11, active => true);
SELECT cron.alter_job(12, active => true);
SELECT cron.alter_job(13, active => true);
SELECT cron.alter_job(14, active => true);
SELECT cron.alter_job(16, active => true);
SELECT cron.alter_job(18, active => true);
COMMIT;
