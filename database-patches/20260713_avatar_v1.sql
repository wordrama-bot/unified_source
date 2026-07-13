-- Avatar V1
-- Stores a player's currently equipped avatar frame.
-- Ownership is validated through _player_entitlements.

create table if not exists public._player_avatar (
    player_id uuid primary key
        references public._players(id)
        on delete cascade,

    equipped_avatar_style_key text,

    updated_at timestamptz not null default now()
);

create index if not exists idx_player_avatar_style
  on public._player_avatar (equipped_avatar_style_key);