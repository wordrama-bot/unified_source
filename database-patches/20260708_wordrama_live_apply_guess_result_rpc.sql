create or replace function public.wordrama_live_apply_guess_result(
  p_match_id uuid,
  p_player_id uuid,
  p_guess text,
  p_evaluation jsonb,
  p_is_solved boolean,
  p_is_failed boolean,
  p_submitted_at timestamptz default now(),
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  match_id uuid,
  match_tournament_id uuid,
  match_status text,
  match_type text,
  match_word_pack text,
  match_word_length integer,
  match_max_attempts integer,
  match_winner_player_id uuid,
  match_winner_reason text,
  match_round_number integer,
  match_match_number integer,
  match_scheduled_at timestamptz,
  match_started_at timestamptz,
  match_ended_at timestamptz,
  match_solution text,
  match_solution_hash text,
  match_solution_salt_id text,
  match_config jsonb,
  match_metadata jsonb,
  match_created_at timestamptz,
  match_updated_at timestamptz,
  player_id uuid,
  match_player_id uuid,
  match_player_tournament_entrant_id uuid,
  match_player_seat integer,
  match_player_status text,
  match_player_score integer,
  match_player_guess_count integer,
  match_player_result text,
  match_player_joined_at timestamptz,
  match_player_ready_at timestamptz,
  match_player_solved_at timestamptz,
  match_player_failed_at timestamptz,
  match_player_finished_at timestamptz,
  match_player_forfeited_at timestamptz,
  match_player_last_seen_at timestamptz,
  match_player_metadata jsonb,
  match_player_created_at timestamptz,
  match_player_updated_at timestamptz,
  guess_id uuid,
  guess_index integer,
  guess_text text,
  guess_is_valid boolean,
  guess_validation_error text,
  guess_evaluation jsonb,
  guess_submitted_at timestamptz,
  guess_metadata jsonb,
  guess_created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_match public._live_matches%rowtype;
  v_match_player public._live_match_players%rowtype;
  v_guess_id uuid;
  v_guess_index integer;
  v_expected_is_failed boolean;
  v_now timestamptz := now();
  v_submitted_at timestamptz := coalesce(p_submitted_at, now());
  v_terminal_count integer;
  v_player_count integer;
  v_solved_count integer;
  v_failed_count integer;
  v_forfeited_count integer;
  v_winner_player_id uuid;
  v_winner_reason text;
  v_fewest_guess_count integer;
  v_fewest_guess_count_players integer;
  v_fastest_solve_at timestamptz;
  v_fastest_solve_players integer;
begin
  if p_match_id is null or p_player_id is null then
    raise exception 'LIVE_GUESS_INVALID_INPUT';
  end if;

  if length(trim(coalesce(p_guess, ''))) = 0 then
    raise exception 'LIVE_GUESS_INVALID_INPUT';
  end if;

  if p_evaluation is null or jsonb_typeof(p_evaluation) <> 'array' then
    raise exception 'LIVE_GUESS_INVALID_INPUT';
  end if;

  if p_is_solved is null or p_is_failed is null then
    raise exception 'LIVE_GUESS_INVALID_INPUT';
  end if;

  if p_is_solved and p_is_failed then
    raise exception 'LIVE_GUESS_INVALID_INPUT';
  end if;

  if p_metadata is null or jsonb_typeof(p_metadata) <> 'object' then
    raise exception 'LIVE_GUESS_INVALID_INPUT';
  end if;

  select *
  into v_match
  from public._live_matches m
  where m.id = p_match_id
  for update;

  if not found then
    raise exception 'LIVE_GUESS_MATCH_NOT_FOUND';
  end if;

  if v_match.status <> 'IN_PROGRESS' then
    raise exception 'LIVE_GUESS_INVALID_MATCH_STATE';
  end if;

  select *
  into v_match_player
  from public._live_match_players mp
  where mp.match_id = p_match_id
    and mp.player_id = p_player_id
  for update;

  if not found then
    raise exception 'LIVE_GUESS_PLAYER_NOT_FOUND';
  end if;

  if v_match_player.status <> 'PLAYING' then
    raise exception 'LIVE_GUESS_INVALID_PLAYER_STATE';
  end if;

  if v_match_player.guess_count >= v_match.max_attempts then
    raise exception 'LIVE_GUESS_NO_ATTEMPTS_REMAINING';
  end if;

  v_guess_index := v_match_player.guess_count + 1;
  v_expected_is_failed := (not p_is_solved and v_guess_index >= v_match.max_attempts);

  if p_is_failed <> v_expected_is_failed then
    raise exception 'LIVE_GUESS_STALE_RESULT';
  end if;

  insert into public._live_match_guesses (
    match_id,
    match_player_id,
    player_id,
    guess_index,
    guess,
    is_valid,
    validation_error,
    evaluation,
    submitted_at,
    metadata
  )
  values (
    p_match_id,
    v_match_player.id,
    p_player_id,
    v_guess_index,
    upper(trim(p_guess)),
    true,
    null,
    p_evaluation,
    v_submitted_at,
    p_metadata
  )
  returning id into v_guess_id;

  update public._live_match_players
  set
    guess_count = v_guess_index,
    solved_at = case
      when p_is_solved then v_submitted_at
      else solved_at
    end,
    failed_at = case
      when p_is_failed then v_submitted_at
      else failed_at
    end,
    status = case
      when p_is_solved or p_is_failed then 'FINISHED'
      else status
    end,
    finished_at = case
      when p_is_solved or p_is_failed then v_submitted_at
      else finished_at
    end,
    updated_at = v_now
  where id = v_match_player.id
  returning * into v_match_player;

  perform 1
  from public._live_match_players mp
  where mp.match_id = p_match_id
  for update;

  select
    count(*),
    count(*) filter (
      where mp.status in ('FINISHED', 'FORFEITED')
        or mp.solved_at is not null
        or mp.failed_at is not null
        or mp.forfeited_at is not null
    ),
    count(*) filter (where mp.solved_at is not null),
    count(*) filter (where mp.failed_at is not null),
    count(*) filter (where mp.status = 'FORFEITED' or mp.forfeited_at is not null)
  into
    v_player_count,
    v_terminal_count,
    v_solved_count,
    v_failed_count,
    v_forfeited_count
  from public._live_match_players mp
  where mp.match_id = p_match_id;

  if v_player_count > 0 and v_terminal_count = v_player_count then
    if v_forfeited_count = 1 and v_player_count = 2 then
      select mp.player_id
      into v_winner_player_id
      from public._live_match_players mp
      where mp.match_id = p_match_id
        and not (mp.status = 'FORFEITED' or mp.forfeited_at is not null)
      limit 1;

      v_winner_reason := case
        when v_winner_player_id is null then 'NO_WINNER'
        else 'OPPONENT_FORFEITED'
      end;
    elsif v_solved_count = 1 and v_failed_count > 0 then
      select mp.player_id
      into v_winner_player_id
      from public._live_match_players mp
      where mp.match_id = p_match_id
        and mp.solved_at is not null
      limit 1;

      v_winner_reason := 'OPPONENT_FAILED';
    elsif v_solved_count > 1 then
      select min(mp.guess_count)
      into v_fewest_guess_count
      from public._live_match_players mp
      where mp.match_id = p_match_id
        and mp.solved_at is not null;

      select count(*)
      into v_fewest_guess_count_players
      from public._live_match_players mp
      where mp.match_id = p_match_id
        and mp.solved_at is not null
        and mp.guess_count = v_fewest_guess_count;

      if v_fewest_guess_count_players = 1 then
        select mp.player_id
        into v_winner_player_id
        from public._live_match_players mp
        where mp.match_id = p_match_id
          and mp.solved_at is not null
          and mp.guess_count = v_fewest_guess_count
        limit 1;

        v_winner_reason := 'FEWEST_GUESSES';
      else
        select min(mp.solved_at)
        into v_fastest_solve_at
        from public._live_match_players mp
        where mp.match_id = p_match_id
          and mp.solved_at is not null
          and mp.guess_count = v_fewest_guess_count;

        select count(*)
        into v_fastest_solve_players
        from public._live_match_players mp
        where mp.match_id = p_match_id
          and mp.solved_at is not null
          and mp.guess_count = v_fewest_guess_count
          and mp.solved_at = v_fastest_solve_at;

        if v_fastest_solve_players = 1 then
          select mp.player_id
          into v_winner_player_id
          from public._live_match_players mp
          where mp.match_id = p_match_id
            and mp.solved_at is not null
            and mp.guess_count = v_fewest_guess_count
            and mp.solved_at = v_fastest_solve_at
          limit 1;

          v_winner_reason := 'FASTEST_SOLVE';
        else
          v_winner_player_id := null;
          v_winner_reason := 'NO_WINNER';
        end if;
      end if;
    else
      v_winner_player_id := null;
      v_winner_reason := 'NO_WINNER';
    end if;

    update public._live_matches
    set
      status = 'COMPLETED',
      winner_player_id = v_winner_player_id,
      winner_reason = v_winner_reason,
      ended_at = v_now,
      updated_at = v_now
    where id = p_match_id
    returning * into v_match;

    update public._live_match_players mp
    set
      result = case
        when mp.status = 'FORFEITED' or mp.forfeited_at is not null then 'FORFEIT'
        when v_winner_player_id is null then 'DRAW'
        when mp.player_id = v_winner_player_id then 'WIN'
        else 'LOSS'
      end,
      updated_at = v_now
    where mp.match_id = p_match_id;

    select *
    into v_match_player
    from public._live_match_players mp
    where mp.id = v_match_player.id;
  end if;

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
    m.updated_at,
    mp.player_id,
    mp.id,
    mp.tournament_entrant_id,
    mp.seat,
    mp.status,
    mp.score,
    mp.guess_count,
    mp.result,
    mp.joined_at,
    mp.ready_at,
    mp.solved_at,
    mp.failed_at,
    mp.finished_at,
    mp.forfeited_at,
    mp.last_seen_at,
    mp.metadata,
    mp.created_at,
    mp.updated_at,
    g.id,
    g.guess_index,
    g.guess,
    g.is_valid,
    g.validation_error,
    g.evaluation,
    g.submitted_at,
    g.metadata,
    g.created_at
  from public._live_matches m
  join public._live_match_players mp on mp.id = v_match_player.id
  join public._live_match_guesses g on g.id = v_guess_id
  where m.id = p_match_id;
exception
  when raise_exception then
    raise;
  when unique_violation then
    raise exception 'LIVE_GUESS_INVALID_PLAYER_STATE';
end;
$$;
