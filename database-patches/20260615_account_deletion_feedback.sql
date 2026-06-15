create table if not exists public._account_deletion_feedback (
    id uuid primary key default gen_random_uuid(),
    reason text,
    comments text,
    created_at timestamptz not null default now()
);