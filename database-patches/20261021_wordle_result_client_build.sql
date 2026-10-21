alter table public._wordle_game_result
  add column if not exists client_build text;

comment on column public._wordle_game_result.client_build is
  'Frontend build identifier captured when the Wordle result was completed; null for legacy results.';