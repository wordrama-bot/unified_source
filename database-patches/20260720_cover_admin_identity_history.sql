-- Covers the target-player portion of the admin identity report.
--
-- The RPC reads only user_id, normalized forwarded IP, normalized user agent,
-- and created_at. Keeping all four values in the index allows PostgreSQL to
-- avoid repeatedly reading the large headers JSON value from the audit table.

create index concurrently if not exists
idx_audit_user_identity_history
on public._audit (
  user_id,
  (
    nullif(
      btrim(split_part(headers->>'x_forwarded_for', ',', 1)),
      ''
    )
  ),
  (
    nullif(
      btrim(headers->>'user_agent'),
      ''
    )
  ),
  created_at desc
)
where user_id is not null
  and nullif(
    btrim(split_part(headers->>'x_forwarded_for', ',', 1)),
    ''
  ) is not null;


-- Covers the bounded reverse-IP portion of the admin identity report.
--
-- The ordering matches:
--
--   where forwarded_ip = ?
--   order by created_at desc
--   limit ?
--
-- user_id and normalized user agent are included in the index keys so the
-- bounded related-account scan does not need to fetch headers from the table.

create index concurrently if not exists
idx_audit_forwarded_ip_identity_history
on public._audit (
  (
    nullif(
      btrim(split_part(headers->>'x_forwarded_for', ',', 1)),
      ''
    )
  ),
  created_at desc,
  user_id,
  (
    nullif(
      btrim(headers->>'user_agent'),
      ''
    )
  )
)
where user_id is not null
  and nullif(
    btrim(split_part(headers->>'x_forwarded_for', ',', 1)),
    ''
  ) is not null;