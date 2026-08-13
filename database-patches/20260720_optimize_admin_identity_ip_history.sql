-- Supports reverse client-IP history lookups ordered by newest activity.
--
-- The prior forwarded-IP index places user_id before created_at, which is
-- useful for per-player grouping but cannot satisfy a global
-- ORDER BY created_at DESC for one forwarded IP.
create index concurrently if not exists
idx_audit_forwarded_ip_created_at_user_id
on public._audit (
  (
    nullif(
      btrim(split_part(headers->>'x_forwarded_for', ',', 1)),
      ''
    )
  ),
  created_at desc,
  user_id
)
where nullif(
  btrim(split_part(headers->>'x_forwarded_for', ',', 1)),
  ''
) is not null;