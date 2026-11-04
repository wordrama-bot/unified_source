-- Remove browser-role TRUNCATE privileges that RLS cannot restrict.
-- No rows, row-level permissions, policies, or service_role grants are changed.
BEGIN;
REVOKE TRUNCATE ON TABLE
  public._ledger,
  public._purchased_items,
  public._player_entitlements
FROM PUBLIC, anon, authenticated;
COMMIT;
