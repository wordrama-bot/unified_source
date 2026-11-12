-- Candidate update to existing streak pagination function.
-- Apply ONLY after the new leaderboard MVs are present and validated.
-- Original function uses SECURITY INVOKER and restricted EXECUTE privileges; preserve both.
-- No table writes or data resets.
CREATE OR REPLACE FUNCTION public.wordrama_leaderboard_streak_page(p_period text, p_rank text, p_streak text, p_offset integer DEFAULT 0, p_limit integer DEFAULT 10, p_year integer DEFAULT NULL::integer, p_month integer DEFAULT NULL::integer, p_week integer DEFAULT NULL::integer, p_day integer DEFAULT NULL::integer)
 RETURNS SETOF jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
DECLARE
  v_table text;
  v_pack text;
  v_stat text;
  v_won text;
  v_lost text;
  v_where text := '';
  v_sql text;
  v_sort_expression text;
BEGIN
  IF p_period NOT IN ('alltime','yearly','monthly','weekly','daily')
     OR p_rank !~ ('^' || p_period || '_rank(_(4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23)_letter|_five_letter_crazy|_three_letter|_three_letter_crazy|_five_letter_unhinged|_11_letter_extended)?$')
     OR p_streak NOT IN ('current_streak','best_streak','games_played')
     OR p_offset < 0 OR p_limit < 1 OR p_limit > 100 THEN
    RAISE EXCEPTION 'Invalid leaderboard parameters';
  END IF;
  IF p_rank LIKE '%11_letter_extended' AND p_period <> 'alltime' THEN
    RAISE EXCEPTION 'Extended 11-letter rank is only supported for all-time';
  END IF;
  v_table := '_mv_wordle_' || p_period || '_leaderboard';
  v_pack := replace(p_rank, p_period || '_rank', '');
  v_pack := ltrim(v_pack, '_');
  IF v_pack = '' THEN
    v_stat := 'overall_best_streak';
    v_won := 'games_won'; v_lost := 'games_lost';
    IF p_streak = 'current_streak' THEN RAISE EXCEPTION 'Overall current streak is not supported'; END IF;
  ELSE
    IF v_pack IN ('three_letter', 'three_letter_crazy', 'five_letter_unhinged', 'five_letter_crazy') THEN v_pack := v_pack;
    ELSIF v_pack = '11_letter_extended' THEN v_pack := 'eleven_letter_extended';
    ELSE
      v_pack := (ARRAY['four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty','twentyone','twentytwo','twentythree'])[split_part(v_pack,'_',1)::integer - 3] || '_letter';
    END IF;
    v_stat := v_pack || '_' || p_streak;
    v_won := v_pack || '_games_won'; v_lost := v_pack || '_games_lost';
  END IF;
  IF p_streak = 'games_played' THEN
    IF v_pack = '' THEN RAISE EXCEPTION 'Overall Games Played uses the materialized view'; END IF;
    v_sort_expression := format('(COALESCE(m.%I,0) + COALESCE(m.%I,0))', v_won, v_lost);
  ELSE
    v_sort_expression := format('COALESCE(s.%I,0)', v_stat);
  END IF;
  IF p_period = 'yearly' THEN
    IF p_year IS NULL THEN RAISE EXCEPTION 'Missing year'; END IF;
    v_where := format(' AND m.year = %L', p_year);
  ELSIF p_period = 'monthly' THEN
    IF p_year IS NULL OR p_month IS NULL THEN RAISE EXCEPTION 'Missing month/year'; END IF;
    v_where := format(' AND m.year = %L AND m.month = %L',p_year,p_month);
  ELSIF p_period = 'weekly' THEN
    IF p_year IS NULL OR p_week IS NULL THEN RAISE EXCEPTION 'Missing week/year'; END IF;
    v_where := format(' AND m.year = %L AND m.week = %L',p_year,p_week);
  ELSIF p_period = 'daily' THEN
    IF p_year IS NULL OR p_month IS NULL OR p_day IS NULL THEN RAISE EXCEPTION 'Missing date'; END IF;
    v_where := format(' AND m.year = %L AND m.month = %L AND m.day = %L',p_year,p_month,p_day);
  END IF;
  v_sql := format(
    'SELECT to_jsonb(m)
     FROM public.%I AS m
     LEFT JOIN public._mv_wordle_alltime_leaderboard AS s ON s.player = m.player
     WHERE m.%I IS NOT NULL AND (COALESCE(m.%I,0)>0 OR COALESCE(m.%I,0)>0)%s
     ORDER BY %s DESC, m.%I ASC
     LIMIT %s OFFSET %s',
     v_table, p_rank, v_won, v_lost, v_where,
     v_sort_expression, p_rank, p_limit, p_offset
  );
  RETURN QUERY EXECUTE v_sql;
END;
$function$
;

-- Preserve existing restricted execution policy (postgres and service_role only).
REVOKE ALL ON FUNCTION public.wordrama_leaderboard_streak_page(text,text,text,integer,integer,integer,integer,integer,integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.wordrama_leaderboard_streak_page(text,text,text,integer,integer,integer,integer,integer,integer) TO service_role;
