create table if not exists public._stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  event_type text not null,
  processing_status text not null default 'PROCESSING',
  processed_at timestamptz,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_stripe_webhook_events_created
on public._stripe_webhook_events (created_at desc);

create index if not exists idx_stripe_webhook_events_status
on public._stripe_webhook_events (processing_status);
