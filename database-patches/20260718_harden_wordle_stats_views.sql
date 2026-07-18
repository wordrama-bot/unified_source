BEGIN;

ALTER VIEW public._v_wordle_daily_stats
  SET (security_invoker = true);

ALTER VIEW public._v_wordle_weekly_stats
  SET (security_invoker = true);

ALTER VIEW public._v_wordle_monthly_stats
  SET (security_invoker = true);

ALTER VIEW public._v_wordle_yearly_stats
  SET (security_invoker = true);

ALTER VIEW public._v_wordle_alltime_stats
  SET (security_invoker = true);

REVOKE ALL ON public._v_wordle_daily_stats
  FROM anon, authenticated;

REVOKE ALL ON public._v_wordle_weekly_stats
  FROM anon, authenticated;

REVOKE ALL ON public._v_wordle_monthly_stats
  FROM anon, authenticated;

REVOKE ALL ON public._v_wordle_yearly_stats
  FROM anon, authenticated;

REVOKE ALL ON public._v_wordle_alltime_stats
  FROM anon, authenticated;

GRANT SELECT ON public._v_wordle_daily_stats
  TO anon, authenticated;

GRANT SELECT ON public._v_wordle_weekly_stats
  TO anon, authenticated;

GRANT SELECT ON public._v_wordle_monthly_stats
  TO anon, authenticated;

GRANT SELECT ON public._v_wordle_yearly_stats
  TO anon, authenticated;

GRANT SELECT ON public._v_wordle_alltime_stats
  TO anon, authenticated;

COMMIT;