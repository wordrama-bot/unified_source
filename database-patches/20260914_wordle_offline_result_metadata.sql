begin;

set local lock_timeout = '3s';

alter table only public._wordle_game_result
  add column client_completed_at timestamptz;

comment on column public._wordle_game_result.client_completed_at is
  'Client-reported game completion timestamp used for offline result recovery context. Not authoritative for anti-cheat.';

commit;
