create or replace function public.wordrama_live_join_tournament(
  p_tournament_id uuid,
  p_player_id uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  id uuid,
  tournament_id uuid,
  player_id uuid,
  display_name_snapshot text,
  status text,
  seed integer,
  score integer,
  metadata jsonb,
  joined_at timestamptz,
  checked_in_at timestamptz,
  eliminated_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_tournament record;
  v_player record;
  v_active_entrant_count integer;
  v_display_name_snapshot text;
  v_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
begin
  if p_tournament_id is null or p_player_id is null then
    raise exception 'LIVE_REGISTRATION_INVALID_INPUT';
  end if;

  if jsonb_typeof(v_metadata) <> 'object' then
    raise exception 'LIVE_REGISTRATION_INVALID_INPUT';
  end if;

  select
    t.id,
    t.status,
    t.max_entrants
  into v_tournament
  from public._live_tournaments t
  where t.id = p_tournament_id
  for update;

  if not found then
    raise exception 'LIVE_REGISTRATION_TOURNAMENT_NOT_FOUND';
  end if;

  if v_tournament.status <> 'REGISTRATION_OPEN' then
    raise exception 'LIVE_REGISTRATION_NOT_OPEN';
  end if;

  select
    p.id,
    p.display_name,
    p.username
  into v_player
  from public._players p
  where p.id = p_player_id;

  if not found then
    raise exception 'LIVE_REGISTRATION_PLAYER_NOT_FOUND';
  end if;

  if exists (
    select 1
    from public._live_tournament_entrants e
    where e.tournament_id = p_tournament_id
      and e.player_id = p_player_id
      and e.status in ('REGISTERED', 'CHECKED_IN', 'ACTIVE')
  ) then
    raise exception 'LIVE_REGISTRATION_DUPLICATE_ENTRANT';
  end if;

  if v_tournament.max_entrants is not null then
    select count(*)
    into v_active_entrant_count
    from public._live_tournament_entrants e
    where e.tournament_id = p_tournament_id
      and e.status in ('REGISTERED', 'CHECKED_IN', 'ACTIVE');

    if v_active_entrant_count >= v_tournament.max_entrants then
      raise exception 'LIVE_REGISTRATION_TOURNAMENT_FULL';
    end if;
  end if;

  v_display_name_snapshot := nullif(
    btrim(coalesce(v_player.display_name, v_player.username, '')),
    ''
  );

  if v_display_name_snapshot is null then
    v_display_name_snapshot := 'Player';
  end if;

  return query
  insert into public._live_tournament_entrants as entrant (
    tournament_id,
    player_id,
    display_name_snapshot,
    status,
    metadata
  )
  values (
    p_tournament_id,
    p_player_id,
    v_display_name_snapshot,
    'REGISTERED',
    v_metadata
  )
  returning
    entrant.id,
    entrant.tournament_id,
    entrant.player_id,
    entrant.display_name_snapshot,
    entrant.status,
    entrant.seed,
    entrant.score,
    entrant.metadata,
    entrant.joined_at,
    entrant.checked_in_at,
    entrant.eliminated_at,
    entrant.created_at,
    entrant.updated_at;
exception
  when unique_violation then
    raise exception 'LIVE_REGISTRATION_DUPLICATE_ENTRANT';
end;
$$;
