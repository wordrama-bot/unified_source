create or replace function public.admin_get_suspicious_gameplay()
returns table (
  player_id uuid,
  username text,
  display_name text,
  email text,
  discord_id text,
  total_games bigint,
  wins bigint,
  one_guess_wins bigint,
  one_guess_last_24h bigint,
  one_guess_rate numeric,
  avg_guesses numeric,
  first_game timestamptz,
  last_game timestamptz,
  games_last_hour bigint,
  games_last_24h bigint,
  games_per_minute numeric,
  games_per_hour numeric
)
language sql
stable
security definer
set search_path = public, auth
as $$
  with player_game_stats as (
    select
      g.player as player_id,
      count(g.id) as total_games,
      count(*) filter (where g.game_was_won = true) as wins,
      count(*) filter (
        where g.game_was_won = true
          and g.guess_count = 1
      ) as one_guess_wins,
      count(*) filter (
        where g.game_was_won = true
          and g.guess_count = 1
          and g.created_at >= now() - interval '24 hours'
      ) as one_guess_last_24h,
      count(*) filter (
        where g.created_at >= now() - interval '1 hour'
      ) as games_last_hour,
      count(*) filter (
        where g.created_at >= now() - interval '24 hours'
      ) as games_last_24h,
      round(avg(g.guess_count), 2) as avg_guesses,
      min(g.created_at) as first_game,
      max(g.created_at) as last_game
    from public._wordle_game_result g
    group by g.player
  )
  select
    s.player_id,
    p.username,
    p.display_name,
    u.email,
    u.raw_user_meta_data->>'provider_id' as discord_id,
    s.total_games,
    s.wins,
    s.one_guess_wins,
    s.one_guess_last_24h,
    round((s.one_guess_wins::numeric / nullif(s.total_games, 0)) * 100, 2) as one_guess_rate,
    s.avg_guesses,
    s.first_game,
    s.last_game,
    s.games_last_hour,
    s.games_last_24h,
    round((s.games_last_hour::numeric / 60), 2) as games_per_minute,
    s.games_last_hour::numeric as games_per_hour
  from player_game_stats s
  left join public._players p
    on p.id = s.player_id
  left join auth.users u
    on u.id = s.player_id
  where s.total_games > 0
  order by
    s.games_last_hour desc,
    s.one_guess_last_24h desc,
    one_guess_rate desc,
    total_games desc;
$$;