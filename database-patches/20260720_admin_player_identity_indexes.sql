-- Supports the existing player audit-history lookup:
--
--   where user_id = ?
--   order by created_at desc
--
-- Also supports identity-report history aggregation by player.
create index concurrently if not exists
idx_audit_user_id_created_at
on public._audit (
  user_id,
  created_at desc
);

-- Supports reverse lookup of all accounts observed from a forwarded client IP.
--
-- The first X-Forwarded-For entry is the client address supplied through
-- Wordrama's trusted hosting proxy. Empty values are excluded.
create index concurrently if not exists
idx_audit_forwarded_ip_user_created_at
on public._audit (
  (
    nullif(
      btrim(split_part(headers->>'x_forwarded_for', ',', 1)),
      ''
    )
  ),
  user_id,
  created_at desc
)
where nullif(
  btrim(split_part(headers->>'x_forwarded_for', ',', 1)),
  ''
) is not null;