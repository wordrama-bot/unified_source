alter table public._player_entitlements
drop constraint if exists _player_entitlements_source_type_check;

alter table public._player_entitlements
add constraint _player_entitlements_source_type_check
check (
  source_type = any (
    array[
      'ORDER_ITEM'::text,
      'SUBSCRIPTION'::text,
      'ADMIN'::text,
      'MIGRATION'::text,
      'PROMO'::text,
      'STRIPE'::text
    ]
  )
);

drop index if exists public.uq_player_subscriptions_provider_subscription;

create unique index if not exists uq_player_subscriptions_provider_subscription
on public._player_subscriptions (provider, provider_subscription_id);
