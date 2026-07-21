alter table public._player_entitlements
drop constraint if exists _player_entitlements_source_type_check;

alter table public._player_entitlements
add constraint _player_entitlements_source_type_check
check (
  source_type in (
    'ADMIN',
    'ORDER_ITEM',
    'SUBSCRIPTION',
    'ACHIEVEMENT'
  )
);