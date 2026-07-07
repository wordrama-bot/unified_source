begin;

-- Wordrama Live schema.
-- These tables are intentionally separate from permanent Wordle stats,
-- streaks, rewards, coins, XP, achievements, and leaderboards.

create table if not exists public._live_tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  join_code text not null unique,
  status text not null default 'DRAFT',
  visibility text not null default 'PRIVATE',
  created_by_player_id uuid not null references public._players(id),
  starts_at timestamptz,
  ends_at timestamptz,
  max_entrants integer,
  best_of integer not null default 1,
  config jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint _live_tournaments_status_check check (
    status = any (
      array[
        'DRAFT'::text,
        'SCHEDULED'::text,
        'REGISTRATION_OPEN'::text,
        'REGISTRATION_CLOSED'::text,
        'IN_PROGRESS'::text,
        'COMPLETED'::text,
        'CANCELLED'::text
      ]
    )
  ),
  constraint _live_tournaments_visibility_check check (
    visibility = any (
      array[
        'PRIVATE'::text,
        'PUBLIC'::text,
        'UNLISTED'::text
      ]
    )
  ),
  constraint _live_tournaments_max_entrants_check check (
    max_entrants is null or max_entrants > 0
  ),
  constraint _live_tournaments_best_of_check check (best_of in (1, 3, 5)),
  constraint _live_tournaments_time_window_check check (
    ends_at is null or starts_at is null or ends_at >= starts_at
  )
);

create table if not exists public._live_tournament_entrants (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public._live_tournaments(id) on delete cascade,
  player_id uuid not null references public._players(id),
  display_name_snapshot text not null,
  status text not null default 'REGISTERED',
  seed integer,
  score integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  joined_at timestamptz not null default now(),
  checked_in_at timestamptz,
  eliminated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint _live_tournament_entrants_status_check check (
    status = any (
      array[
        'REGISTERED'::text,
        'CHECKED_IN'::text,
        'ACTIVE'::text,
        'ELIMINATED'::text,
        'WITHDRAWN'::text,
        'DISQUALIFIED'::text
      ]
    )
  ),
  constraint _live_tournament_entrants_seed_check check (
    seed is null or seed > 0
  ),
  constraint _live_tournament_entrants_score_check check (score >= 0)
);

create table if not exists public._live_matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references public._live_tournaments(id) on delete cascade,
  status text not null default 'PENDING',
  match_type text not null default 'DUEL',
  word_pack text not null default 'FIVE_LETTER',
  word_length integer not null default 5,
  max_attempts integer not null default 6,
  winner_player_id uuid references public._players(id),
  winner_reason text,
  round_number integer,
  match_number integer not null,
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  solution text not null,
  solution_hash text,
  solution_salt_id text,
  config jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint _live_matches_status_check check (
    status = any (
      array[
        'PENDING'::text,
        'READY'::text,
        'IN_PROGRESS'::text,
        'COMPLETED'::text,
        'CANCELLED'::text,
        'ABANDONED'::text
      ]
    )
  ),
  constraint _live_matches_match_type_check check (
    match_type = any (
      array[
        'DUEL'::text,
        'TOURNAMENT'::text,
        'SHOWMATCH'::text
      ]
    )
  ),
  constraint _live_matches_winner_reason_check check (
    winner_reason is null or winner_reason = any (
      array[
        'SOLVED_FIRST'::text,
        'FEWEST_GUESSES'::text,
        'FASTEST_SOLVE'::text,
        'OPPONENT_FAILED'::text,
        'OPPONENT_FORFEITED'::text,
        'ADMIN_DECISION'::text,
        'NO_WINNER'::text
      ]
    )
  ),
  constraint _live_matches_solution_not_blank_check check (
    length(trim(solution)) > 0
  ),
  constraint _live_matches_word_length_check check (word_length > 0),
  constraint _live_matches_max_attempts_check check (max_attempts > 0),
  constraint _live_matches_round_number_check check (
    round_number is null or round_number > 0
  ),
  constraint _live_matches_match_number_check check (match_number > 0),
  constraint _live_matches_time_window_check check (
    ended_at is null or started_at is null or ended_at >= started_at
  )
);

create table if not exists public._live_match_players (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public._live_matches(id) on delete cascade,
  player_id uuid not null references public._players(id),
  tournament_entrant_id uuid references public._live_tournament_entrants(id) on delete set null,
  seat integer not null,
  status text not null default 'JOINED',
  score integer not null default 0,
  guess_count integer not null default 0,
  result text,
  joined_at timestamptz not null default now(),
  ready_at timestamptz,
  solved_at timestamptz,
  failed_at timestamptz,
  finished_at timestamptz,
  forfeited_at timestamptz,
  last_seen_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint _live_match_players_status_check check (
    status = any (
      array[
        'JOINED'::text,
        'READY'::text,
        'PLAYING'::text,
        'FINISHED'::text,
        'FORFEITED'::text,
        'DISCONNECTED'::text
      ]
    )
  ),
  constraint _live_match_players_result_check check (
    result is null or result = any (
      array[
        'WIN'::text,
        'LOSS'::text,
        'DRAW'::text,
        'FORFEIT'::text,
        'NO_CONTEST'::text
      ]
    )
  ),
  constraint _live_match_players_seat_check check (seat > 0),
  constraint _live_match_players_score_check check (score >= 0),
  constraint _live_match_players_guess_count_check check (guess_count >= 0)
);

create table if not exists public._live_match_guesses (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public._live_matches(id) on delete cascade,
  match_player_id uuid not null references public._live_match_players(id) on delete cascade,
  player_id uuid not null references public._players(id),
  guess_index integer not null,
  guess text not null,
  is_valid boolean not null default true,
  validation_error text,
  evaluation jsonb not null default '[]'::jsonb,
  submitted_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint _live_match_guesses_guess_index_check check (guess_index > 0),
  constraint _live_match_guesses_guess_not_blank_check check (
    length(trim(guess)) > 0
  )
);

create table if not exists public._live_overlay_tokens (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public._players(id),
  tournament_id uuid references public._live_tournaments(id) on delete cascade,
  match_id uuid references public._live_matches(id) on delete cascade,
  token_hash text not null,
  label text,
  scopes jsonb not null default '[]'::jsonb,
  status text not null default 'ACTIVE',
  expires_at timestamptz,
  revoked_at timestamptz,
  last_used_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint _live_overlay_tokens_status_check check (
    status = any (
      array[
        'ACTIVE'::text,
        'REVOKED'::text,
        'EXPIRED'::text
      ]
    )
  ),
  constraint _live_overlay_tokens_hash_not_blank_check check (
    length(trim(token_hash)) > 0
  )
);

create unique index if not exists uq_live_tournament_entrants_tournament_player
on public._live_tournament_entrants (tournament_id, player_id);

create unique index if not exists uq_live_tournament_entrants_tournament_seed
on public._live_tournament_entrants (tournament_id, seed)
where seed is not null;

create unique index if not exists uq_live_match_players_match_player
on public._live_match_players (match_id, player_id);

create unique index if not exists uq_live_match_players_match_seat
on public._live_match_players (match_id, seat);

create unique index if not exists uq_live_match_guesses_match_player_guess
on public._live_match_guesses (match_id, player_id, guess_index);

create unique index if not exists uq_live_overlay_tokens_token_hash
on public._live_overlay_tokens (token_hash);

create index if not exists idx_live_tournaments_status_starts
on public._live_tournaments (status, starts_at);

create index if not exists idx_live_tournaments_created_by_player
on public._live_tournaments (created_by_player_id);

create index if not exists idx_live_tournaments_join_code
on public._live_tournaments (join_code);

create index if not exists idx_live_tournament_entrants_player
on public._live_tournament_entrants (player_id);

create index if not exists idx_live_tournament_entrants_status
on public._live_tournament_entrants (tournament_id, status);

create index if not exists idx_live_matches_tournament
on public._live_matches (tournament_id);

create index if not exists idx_live_matches_tournament_round
on public._live_matches (tournament_id, round_number);

create index if not exists idx_live_matches_status_started
on public._live_matches (status, started_at);

create index if not exists idx_live_match_players_player
on public._live_match_players (player_id);

create index if not exists idx_live_match_players_status
on public._live_match_players (match_id, status);

create index if not exists idx_live_match_guesses_match_player
on public._live_match_guesses (match_id, match_player_id);

create index if not exists idx_live_match_guesses_submitted
on public._live_match_guesses (match_id, submitted_at);

create index if not exists idx_live_overlay_tokens_player
on public._live_overlay_tokens (player_id);

create index if not exists idx_live_overlay_tokens_match
on public._live_overlay_tokens (match_id);

create index if not exists idx_live_overlay_tokens_tournament
on public._live_overlay_tokens (tournament_id);

create index if not exists idx_live_overlay_tokens_status_expires
on public._live_overlay_tokens (status, expires_at);

commit;
