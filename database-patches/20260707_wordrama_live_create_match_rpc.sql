create or replace function public.wordrama_live_create_match(
  p_tournament_id uuid,
  p_requested_by_player_id uuid,
  p_player_ids uuid[],
  p_round_number integer,
  p_match_number integer,
  p_solution text,
  p_word_pack text default 'FIVE_LETTER',
  p_word_length integer default 5,
  p_max_attempts integer default 6,
  p_solution_hash text default null,
  p_solution_salt_id text default null,
  p_scheduled_at timestamptz default null,
  p_config jsonb default '{}'::jsonb,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  id uuid,
  tournament_id uuid,
  status text,
  match_type text,
  word_pack text,
  word_length integer,
  max_attempts integer,
  winner_player_id uuid,
  winner_reason text,
  round_number integer,
  match_number integer,
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  solution text,
  solution_hash text,
  solution_salt_id text,
  config jsonb,
  metadata jsonb,
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
  v_entrant_one record;
  v_entrant_two record;
  v_solution text := upper(btrim(coalesce(p_solution, '')));
  v_word_pack text := upper(btrim(coalesce(p_word_pack, 'FIVE_LETTER')));
  v_config jsonb := coalesce(p_config, '{}'::jsonb);
  v_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
  v_match_id uuid;
begin
  if p_tournament_id is null or p_requested_by_player_id is null then
    raise exception 'LIVE_MATCH_INVALID_INPUT';
  end if;

  if coalesce(array_length(p_player_ids, 1), 0) <> 2 then
    raise exception 'LIVE_MATCH_INVALID_INPUT';
  end if;

  if p_player_ids[1] is null or p_player_ids[2] is null then
    raise exception 'LIVE_MATCH_INVALID_INPUT';
  end if;

  if p_player_ids[1] = p_player_ids[2] then
    raise exception 'LIVE_MATCH_DUPLICATE_PLAYER';
  end if;

  if p_round_number is null or p_round_number <= 0 then
    raise exception 'LIVE_MATCH_INVALID_INPUT';
  end if;

  if p_match_number is null or p_match_number <= 0 then
    raise exception 'LIVE_MATCH_INVALID_INPUT';
  end if;

  if v_solution = '' then
    raise exception 'LIVE_MATCH_INVALID_INPUT';
  end if;

  if v_word_pack = '' then
    raise exception 'LIVE_MATCH_INVALID_INPUT';
  end if;

  if p_word_length is null or p_word_length <= 0 then
    raise exception 'LIVE_MATCH_INVALID_INPUT';
  end if;

  if length(v_solution) <> p_word_length then
    raise exception 'LIVE_MATCH_INVALID_INPUT';
  end if;

  if p_max_attempts is null or p_max_attempts <= 0 then
    raise exception 'LIVE_MATCH_INVALID_INPUT';
  end if;

  if jsonb_typeof(v_config) <> 'object' or jsonb_typeof(v_metadata) <> 'object' then
    raise exception 'LIVE_MATCH_INVALID_INPUT';
  end if;

  select
    t.id,
    t.status,
    t.created_by_player_id
  into v_tournament
  from public._live_tournaments t
  where t.id = p_tournament_id
  for update;

  if not found then
    raise exception 'LIVE_MATCH_TOURNAMENT_NOT_FOUND';
  end if;

  if v_tournament.created_by_player_id <> p_requested_by_player_id then
    raise exception 'LIVE_MATCH_FORBIDDEN';
  end if;

  if v_tournament.status <> 'IN_PROGRESS' then
    raise exception 'LIVE_MATCH_TOURNAMENT_NOT_IN_PROGRESS';
  end if;

  if exists (
    select 1
    from public._live_matches m
    where m.tournament_id = p_tournament_id
      and m.round_number = p_round_number
      and m.match_number = p_match_number
  ) then
    raise exception 'LIVE_MATCH_DUPLICATE_SLOT';
  end if;

  select
    e.id,
    e.player_id
  into v_entrant_one
  from public._live_tournament_entrants e
  where e.tournament_id = p_tournament_id
    and e.player_id = p_player_ids[1]
    and e.status in ('CHECKED_IN', 'ACTIVE')
  for update;

  if not found then
    raise exception 'LIVE_MATCH_ENTRANT_NOT_FOUND';
  end if;

  select
    e.id,
    e.player_id
  into v_entrant_two
  from public._live_tournament_entrants e
  where e.tournament_id = p_tournament_id
    and e.player_id = p_player_ids[2]
    and e.status in ('CHECKED_IN', 'ACTIVE')
  for update;

  if not found then
    raise exception 'LIVE_MATCH_ENTRANT_NOT_FOUND';
  end if;

  insert into public._live_matches as created_match (
    tournament_id,
    status,
    match_type,
    word_pack,
    word_length,
    max_attempts,
    round_number,
    match_number,
    scheduled_at,
    solution,
    solution_hash,
    solution_salt_id,
    config,
    metadata
  )
  values (
    p_tournament_id,
    'READY',
    'TOURNAMENT',
    v_word_pack,
    p_word_length,
    p_max_attempts,
    p_round_number,
    p_match_number,
    p_scheduled_at,
    v_solution,
    p_solution_hash,
    p_solution_salt_id,
    v_config,
    v_metadata
  )
  returning created_match.id into v_match_id;

  insert into public._live_match_players (
    match_id,
    player_id,
    tournament_entrant_id,
    seat,
    status,
    ready_at
  )
  values
    (v_match_id, v_entrant_one.player_id, v_entrant_one.id, 1, 'READY', now()),
    (v_match_id, v_entrant_two.player_id, v_entrant_two.id, 2, 'READY', now());

  return query
  select
    m.id,
    m.tournament_id,
    m.status,
    m.match_type,
    m.word_pack,
    m.word_length,
    m.max_attempts,
    m.winner_player_id,
    m.winner_reason,
    m.round_number,
    m.match_number,
    m.scheduled_at,
    m.started_at,
    m.ended_at,
    m.solution,
    m.solution_hash,
    m.solution_salt_id,
    m.config,
    m.metadata,
    m.created_at,
    m.updated_at
  from public._live_matches m
  where m.id = v_match_id;
exception
  when unique_violation then
    raise exception 'LIVE_MATCH_DUPLICATE_SLOT';
end;
$$;
