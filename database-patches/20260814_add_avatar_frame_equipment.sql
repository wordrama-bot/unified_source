alter table public._player_avatar
add column if not exists equipped_avatar_frame_key text;

drop index if exists public.idx_player_avatar_frame;

create index if not exists idx_player_avatar_style
  on public._player_avatar (equipped_avatar_style_key);

create index if not exists idx_player_avatar_frame
  on public._player_avatar (equipped_avatar_frame_key);
