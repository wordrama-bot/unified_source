begin;

-- Wordrama Live rollback.
-- This intentionally removes only the isolated Live domain objects.
-- It does not touch permanent Wordle stats, streaks, rewards, coins, XP,
-- achievements, leaderboards, players, or marketplace entitlement tables.

drop function if exists public.wordrama_live_apply_guess_result(
  uuid,
  uuid,
  text,
  jsonb,
  boolean,
  boolean,
  timestamptz,
  jsonb
);

drop function if exists public.wordrama_live_create_match(
  uuid,
  uuid,
  uuid[],
  integer,
  integer,
  text,
  text,
  integer,
  integer,
  text,
  text,
  timestamptz,
  jsonb,
  jsonb
);

drop function if exists public.wordrama_live_join_tournament(
  uuid,
  uuid,
  jsonb
);

drop index if exists public.idx_live_overlay_tokens_status_expires;
drop index if exists public.idx_live_overlay_tokens_tournament;
drop index if exists public.idx_live_overlay_tokens_match;
drop index if exists public.idx_live_overlay_tokens_player;
drop index if exists public.uq_live_overlay_tokens_token_hash;

drop index if exists public.idx_live_match_guesses_submitted;
drop index if exists public.idx_live_match_guesses_match_player;
drop index if exists public.uq_live_match_guesses_match_player_guess;

drop index if exists public.idx_live_match_players_status;
drop index if exists public.idx_live_match_players_player;
drop index if exists public.uq_live_match_players_match_seat;
drop index if exists public.uq_live_match_players_match_player;

drop index if exists public.uq_live_matches_tournament_round_match;
drop index if exists public.idx_live_matches_status_started;
drop index if exists public.idx_live_matches_tournament_round;
drop index if exists public.idx_live_matches_tournament;

drop index if exists public.idx_live_tournament_entrants_status;
drop index if exists public.idx_live_tournament_entrants_player;
drop index if exists public.uq_live_tournament_entrants_tournament_seed;
drop index if exists public.uq_live_tournament_entrants_tournament_player;

drop index if exists public.idx_live_tournaments_join_code;
drop index if exists public.idx_live_tournaments_created_by_player;
drop index if exists public.idx_live_tournaments_status_starts;

drop table if exists public._live_overlay_tokens;
drop table if exists public._live_match_guesses;
drop table if exists public._live_match_players;
drop table if exists public._live_matches;
drop table if exists public._live_tournament_entrants;
drop table if exists public._live_tournaments;

commit;
