-- Admin-only reporting change. No INSERT, UPDATE, DELETE, TRUNCATE or player data mutation.
-- Use client completion time for timing analysis; reject implausible future/client-after-receipt timestamps.
-- Preserve the existing function signature, permissions, and manual-loading behavior.
CREATE OR REPLACE FUNCTION public.admin_get_suspicious_gameplay()
 RETURNS TABLE(player_id uuid, username text, display_name text, email text, discord_id text, total_games bigint, wins bigint, one_guess_wins bigint, one_guess_last_24h bigint, one_guess_rate numeric, avg_guesses numeric, first_game timestamp with time zone, last_game timestamp with time zone, games_last_hour bigint, games_last_24h bigint, max_games_in_rolling_60_seconds bigint, rolling_60_second_windows_over_limit bigint, fastest_session_games bigint, fastest_session_median_gap_seconds numeric, fastest_session_sub_10_rate numeric)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'auth', 'pg_temp'
AS $function$
  with lifetime_stats as (
    select
      g.player as player_id,

      count(g.id) as total_games,

      count(*) filter (
        where g.game_was_won = true
      ) as wins,

      count(*) filter (
        where g.game_was_won = true
          and g.guess_count = 1
      ) as one_guess_wins,

      count(*) filter (
        where g.game_was_won = true
          and g.guess_count = 1
          and g.client_completed_at >= now() - interval '24 hours' AND g.client_completed_at <= g.created_at + interval '2 minutes' AND g.client_completed_at <= now() + interval '2 minutes'
      ) as one_guess_last_24h,

      count(*) filter (
        where g.client_completed_at >= now() - interval '1 hour' AND g.client_completed_at <= g.created_at + interval '2 minutes' AND g.client_completed_at <= now() + interval '2 minutes'
      ) as games_last_hour,

      count(*) filter (
        where g.client_completed_at >= now() - interval '24 hours' AND g.client_completed_at <= g.created_at + interval '2 minutes' AND g.client_completed_at <= now() + interval '2 minutes'
      ) as games_last_24h,

      round(avg(g.guess_count), 2) as avg_guesses,

      min(g.created_at) as first_game,
      max(g.created_at) as last_game

    from public._wordle_game_result g
    group by g.player
  ),

  recent_games as (
    select
      g.id,
      g.player as player_id,
      g.client_completed_at as created_at

    from public._wordle_game_result g

    where
      g.game_was_won = true
      and g.client_completed_at >= now() - interval '30 days' AND g.client_completed_at <= g.created_at + interval '2 minutes' AND g.client_completed_at <= now() + interval '2 minutes'
  ),

  ordered_recent_games as (
    select
      rg.id,
      rg.player_id,
      rg.created_at,

      lag(rg.created_at) over (
        partition by rg.player_id
        order by rg.created_at, rg.id
      ) as previous_game_at,

      count(*) over (
        partition by rg.player_id
        order by rg.created_at
        range between interval '60 seconds' preceding
          and current row
      ) as games_in_rolling_60_seconds

    from recent_games rg
  ),

  recent_games_with_gaps as (
    select
      org.id,
      org.player_id,
      org.created_at,
      org.previous_game_at,
      org.games_in_rolling_60_seconds,

      case
        when org.previous_game_at is null then null
        else extract(
          epoch from (
            org.created_at - org.previous_game_at
          )
        )
      end as gap_seconds

    from ordered_recent_games org
  ),

  rolling_minute_stats as (
    select
      rgwg.player_id,

      max(
        rgwg.games_in_rolling_60_seconds
      )::bigint as max_games_in_rolling_60_seconds,

      count(*) filter (
        where rgwg.games_in_rolling_60_seconds >= 6
      )::bigint as rolling_60_second_windows_over_limit

    from recent_games_with_gaps rgwg
    group by rgwg.player_id
  ),

  session_markers as (
    select
      rgwg.*,

      case
        when rgwg.previous_game_at is null then 1
        when rgwg.gap_seconds > 300 then 1
        else 0
      end as starts_new_session

    from recent_games_with_gaps rgwg
  ),

  sessionized_games as (
    select
      sm.*,

      sum(sm.starts_new_session) over (
        partition by sm.player_id
        order by sm.created_at, sm.id
        rows between unbounded preceding
          and current row
      ) as session_id

    from session_markers sm
  ),

  session_stats as (
    select
      sg.player_id,
      sg.session_id,

      count(*)::bigint as session_games,

      percentile_cont(0.5) within group (
        order by sg.gap_seconds
      ) filter (
        where sg.gap_seconds > 0
          and sg.gap_seconds <= 300
      ) as median_gap_seconds,

      (
        100.0
        * count(*) filter (
            where sg.gap_seconds > 0
              and sg.gap_seconds <= 10
          )
        / nullif(
            count(*) filter (
              where sg.gap_seconds > 0
                and sg.gap_seconds <= 300
            ),
            0
          )
      ) as sub_10_rate

    from sessionized_games sg

    group by
      sg.player_id,
      sg.session_id
  ),

  ranked_sessions as (
    select
      ss.*,

      row_number() over (
        partition by ss.player_id
        order by
          ss.median_gap_seconds asc nulls last,
          ss.sub_10_rate desc nulls last,
          ss.session_games desc
      ) as session_rank

    from session_stats ss

    where ss.session_games >= 30
      and ss.median_gap_seconds is not null
  )

  select
    ls.player_id,
    p.username,
    p.display_name,
    u.email,
    u.raw_user_meta_data->>'provider_id' as discord_id,

    ls.total_games,
    ls.wins,
    ls.one_guess_wins,
    ls.one_guess_last_24h,

    round(
      (
        ls.one_guess_wins::numeric
        / nullif(ls.total_games, 0)
      ) * 100,
      2
    ) as one_guess_rate,

    ls.avg_guesses,
    ls.first_game,
    ls.last_game,

    ls.games_last_hour,
    ls.games_last_24h,

    coalesce(
      rms.max_games_in_rolling_60_seconds,
      0
    )::bigint as max_games_in_rolling_60_seconds,

    coalesce(
      rms.rolling_60_second_windows_over_limit,
      0
    )::bigint as rolling_60_second_windows_over_limit,

    coalesce(
      rs.session_games,
      0
    )::bigint as fastest_session_games,

    case
      when rs.median_gap_seconds is null then null
      else round(
        rs.median_gap_seconds::numeric,
        2
      )
    end as fastest_session_median_gap_seconds,

    case
      when rs.sub_10_rate is null then null
      else round(
        rs.sub_10_rate::numeric,
        2
      )
    end as fastest_session_sub_10_rate

  from lifetime_stats ls

  left join public._players p
    on p.id = ls.player_id

  left join auth.users u
    on u.id = ls.player_id

  left join rolling_minute_stats rms
    on rms.player_id = ls.player_id

  left join ranked_sessions rs
    on rs.player_id = ls.player_id
   and rs.session_rank = 1

  where ls.total_games > 0

  order by
    coalesce(
      rms.max_games_in_rolling_60_seconds,
      0
    ) desc,

    coalesce(
      rs.sub_10_rate,
      0
    ) desc,

    coalesce(
      rs.session_games,
      0
    ) desc,

    ls.one_guess_last_24h desc,
    one_guess_rate desc,
    ls.total_games desc;
$function$
;
