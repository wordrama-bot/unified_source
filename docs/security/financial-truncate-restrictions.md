# Financial table TRUNCATE restrictions

The readiness review found effective TRUNCATE grants for anon and authenticated
on public._ledger, public._purchased_items and public._player_entitlements.
Row-level security does not restrict TRUNCATE.

The migration revokes only TRUNCATE from PUBLIC, anon and authenticated on these
three tables. It changes no rows, policies, row-level grants, function definitions
or service_role grants. It is safe to reapply.

## Verification on November 4, 2026

- Local disposable PostgreSQL tests: 4 pass, 0 fail. Both browser roles actually
  receive permission-denied errors for TRUNCATE, including when PUBLIC originally
  granted it. Sentinel rows, RLS, non-TRUNCATE grants and all service_role privileges
  are preserved; repeat installation leaves identical permissions.
- Related coin transaction and entitlement SQL suites: 21 pass, 0 fail.
- Installed on staging ryzhfvgjobhorisyrnqa as migration 20261104223128,
  authentication_cleanup_financial_truncate.
- Read-only staging inspection confirms all six browser-role/table combinations
  deny TRUNCATE. service_role retains SELECT, INSERT, UPDATE, DELETE and TRUNCATE
  on all three tables. RLS remains enabled.
- Security-advisor findings are unchanged. No destructive operation was attempted
  against staging tables to test denial; actual TRUNCATE attempts run only on
  disposable local fixtures.

Production was not changed. Review and install this migration alongside the
existing authentication-cleanup database candidates before deploying the new API.
This targeted change does not claim to resolve unrelated advisor warnings or
every existing table privilege.
