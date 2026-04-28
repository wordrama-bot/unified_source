begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public._player_coin_balances (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public._players(id) on delete cascade,
  currency_code text not null default 'COIN',
  available_balance bigint not null default 0 check (available_balance >= 0),
  lifetime_earned bigint not null default 0 check (lifetime_earned >= 0),
  lifetime_spent bigint not null default 0 check (lifetime_spent >= 0),
  version bigint not null default 0 check (version >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id, currency_code)
);

create index if not exists idx_player_coin_balances_player
  on public._player_coin_balances(player_id);

drop trigger if exists trg_player_coin_balances_updated_at on public._player_coin_balances;
create trigger trg_player_coin_balances_updated_at
before update on public._player_coin_balances
for each row
execute function public.set_updated_at();

create table if not exists public._coin_ledger (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public._players(id) on delete cascade,
  currency_code text not null default 'COIN',
  direction text not null check (direction in ('CREDIT', 'DEBIT')),
  amount bigint not null check (amount > 0),
  entry_type text not null,
  status text not null default 'POSTED' check (status in ('POSTED', 'VOIDED')),
  balance_before bigint,
  balance_after bigint,
  order_id uuid,
  order_item_id uuid,
  subscription_id uuid,
  idempotency_key text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (player_id, currency_code, idempotency_key)
);

create index if not exists idx_coin_ledger_player_created
  on public._coin_ledger(player_id, created_at desc);

create index if not exists idx_coin_ledger_order
  on public._coin_ledger(order_id);

create index if not exists idx_coin_ledger_order_item
  on public._coin_ledger(order_item_id);

create index if not exists idx_coin_ledger_subscription
  on public._coin_ledger(subscription_id);

create table if not exists public._store_orders (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public._players(id) on delete cascade,
  order_number bigint generated always as identity,
  idempotency_key text not null,
  order_status text not null default 'PENDING'
    check (order_status in ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED')),
  payment_method text not null
    check (payment_method in ('COINS', 'STRIPE', 'ADMIN', 'FREE')),
  currency_code text not null default 'COIN',
  subtotal_amount bigint not null default 0 check (subtotal_amount >= 0),
  discount_amount bigint not null default 0 check (discount_amount >= 0),
  tax_amount bigint not null default 0 check (tax_amount >= 0),
  total_amount bigint not null default 0 check (total_amount >= 0),
  failure_reason text,
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id, idempotency_key)
);

create index if not exists idx_store_orders_player_created
  on public._store_orders(player_id, created_at desc);

create index if not exists idx_store_orders_status
  on public._store_orders(order_status);

drop trigger if exists trg_store_orders_updated_at on public._store_orders;
create trigger trg_store_orders_updated_at
before update on public._store_orders
for each row
execute function public.set_updated_at();

create table if not exists public._store_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public._store_orders(id) on delete cascade,
  player_id uuid not null references public._players(id) on delete cascade,
  catalog_item_id text not null,
  sku text,
  item_type text not null,
  item_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price bigint not null default 0 check (unit_price >= 0),
  line_subtotal bigint not null default 0 check (line_subtotal >= 0),
  line_discount bigint not null default 0 check (line_discount >= 0),
  line_total bigint not null default 0 check (line_total >= 0),
  fulfillment_status text not null default 'PENDING'
    check (fulfillment_status in ('PENDING', 'FULFILLED', 'FAILED', 'REVOKED')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_store_order_items_order
  on public._store_order_items(order_id);

create index if not exists idx_store_order_items_player
  on public._store_order_items(player_id, created_at desc);

create index if not exists idx_store_order_items_catalog_item
  on public._store_order_items(catalog_item_id);

create table if not exists public._player_entitlements (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public._players(id) on delete cascade,
  entitlement_key text not null,
  entitlement_type text not null,
  source_type text not null
    check (source_type in ('ORDER_ITEM', 'SUBSCRIPTION', 'ADMIN', 'MIGRATION', 'PROMO')),
  source_id uuid,
  order_id uuid references public._store_orders(id) on delete set null,
  order_item_id uuid references public._store_order_items(id) on delete set null,
  subscription_id uuid,
  status text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'REVOKED', 'EXPIRED')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at is null or expires_at >= starts_at)
);

create index if not exists idx_player_entitlements_player
  on public._player_entitlements(player_id);

create index if not exists idx_player_entitlements_lookup
  on public._player_entitlements(player_id, entitlement_key, status);

create unique index if not exists uq_player_entitlements_active_permanent
  on public._player_entitlements(player_id, entitlement_key)
  where status = 'ACTIVE' and expires_at is null;

drop trigger if exists trg_player_entitlements_updated_at on public._player_entitlements;
create trigger trg_player_entitlements_updated_at
before update on public._player_entitlements
for each row
execute function public.set_updated_at();

create table if not exists public._player_subscriptions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public._players(id) on delete cascade,
  subscription_key text not null,
  provider text not null check (provider in ('STRIPE', 'ADMIN', 'INTERNAL')),
  provider_customer_id text,
  provider_subscription_id text,
  status text not null
    check (status in ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED', 'PAUSED')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  cancelled_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_player_subscriptions_player
  on public._player_subscriptions(player_id, created_at desc);

create index if not exists idx_player_subscriptions_provider_sub
  on public._player_subscriptions(provider_subscription_id);

drop trigger if exists trg_player_subscriptions_updated_at on public._player_subscriptions;
create trigger trg_player_subscriptions_updated_at
before update on public._player_subscriptions
for each row
execute function public.set_updated_at();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'fk_coin_ledger_order'
  ) then
    alter table public._coin_ledger
      add constraint fk_coin_ledger_order
      foreign key (order_id) references public._store_orders(id) on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'fk_coin_ledger_order_item'
  ) then
    alter table public._coin_ledger
      add constraint fk_coin_ledger_order_item
      foreign key (order_item_id) references public._store_order_items(id) on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'fk_coin_ledger_subscription'
  ) then
    alter table public._coin_ledger
      add constraint fk_coin_ledger_subscription
      foreign key (subscription_id) references public._player_subscriptions(id) on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'fk_player_entitlements_subscription'
  ) then
    alter table public._player_entitlements
      add constraint fk_player_entitlements_subscription
      foreign key (subscription_id) references public._player_subscriptions(id) on delete set null;
  end if;
end $$;

commit;