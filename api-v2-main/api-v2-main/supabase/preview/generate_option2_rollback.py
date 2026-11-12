#!/usr/bin/env python3
"""Generate a deterministic, reviewable Option 2 rollback SQL file.

Reads the exact production pg_get_viewdef snapshots committed on the feature
branch. This script NEVER connects to a database or executes SQL.

Usage:
  python supabase/preview/generate_option2_rollback.py \\
    --output supabase/preview/generated/three_pack_option2_rollback.sql

The generated SQL is NOT approved for execution until dependency, permission,
cron, MV-data and column-shape checks have been completed.
"""
import argparse
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
REFERENCE = HERE.parent / "reference"
SOURCES = [
    "three_pack_option2_live_view_rollback_snapshot.json",
    "three_pack_option2_live_mv_rollback_snapshot.json",
    "three_pack_option2_additional_dependent_mvs_snapshot.json",
    "three_pack_option2_team_dependencies_snapshot.json",
]

# Dependencies first. Never use CASCADE for production rollback.
VIEWS = [
    "_v_wordle_daily_stats",
    "_v_wordle_daily_stats_by_type",
    "_v_wordle_weekly_stats",
    "_v_wordle_monthly_stats",
    "_v_wordle_yearly_stats",
    "_v_wordle_weekly_stats_by_type",
    "_v_wordle_monthly_stats_by_type",
    "_v_wordle_yearly_stats_by_type",
    "_v_wordle_alltime_stats",
    "_v_wordle_alltime_stats_by_type",
    "_v_wordle_alltime_stats_with_2024_preview",
    "_v_wordle_daily_leaderboard",
    "_v_wordle_weekly_leaderboard",
    "_v_wordle_monthly_leaderboard",
    "_v_wordle_yearly_leaderboard",
    "_v_wordle_alltime_leaderboard",
    "_v_team_leaderboard",
]
# MV order matters for legacy/historical and team dependencies.
MVS = [
    "_mv_wordle_stats_2024",
    "_mv_wordle_stats_2024_by_type",
    "_mv_wordle_daily_leaderboard",
    "_mv_wordle_weekly_leaderboard",
    "_mv_wordle_monthly_leaderboard",
    "_mv_wordle_yearly_leaderboard",
    "_mv_wordle_alltime_leaderboard",
    "_mv_wordle_daily_leaderboard_legacy",
    "_mv_wordle_weekly_leaderboard_legacy",
    "_mv_wordle_monthly_leaderboard_legacy",
    "_mv_wordle_yearly_leaderboard_legacy",
    "_mv_wordle_alltime_leaderboard_legacy",
    "_mv_team_wordle_stats",
    "_mv_team_wordle_stats_legacy",
]


def quoted(name):
    assert name.startswith("_") and name.replace("_", "").isalnum(), name
    return f'public."{name}"'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    entries = {}
    for filename in SOURCES:
        payload = json.loads((REFERENCE / filename).read_text(encoding="utf-8"))
        for item in payload.get("views", []) + payload.get("materialized_views", []) + payload.get("objects", []):
            name = item["relname"]
            if name in entries:
                raise ValueError(f"Duplicate object: {name}")
            entries[name] = item
    expected = set(VIEWS + MVS)
    if set(entries) != expected:
        raise ValueError(f"Snapshot mismatch: missing={sorted(expected - set(entries))}; unexpected={sorted(set(entries) - expected)}")
    for name in VIEWS:
        if entries[name].get("relkind", "v") != "v":
            raise ValueError(f"Not a view: {name}")
    for name in MVS:
        if entries[name].get("relkind", "m") != "m":
            raise ValueError(f"Not an MV: {name}")

    edges = json.loads((REFERENCE / "three_pack_option2_dependency_edges.json").read_text(encoding="utf-8"))["edges"]
    incoming = {name: set() for name in expected}
    for edge in edges:
        child, parent = edge["dependent"], edge["referenced"]
        if child in incoming and parent in incoming:
            incoming[child].add(parent)
    ordered = []
    while incoming:
        ready = sorted(name for name, parents in incoming.items() if not parents)
        if not ready:
            raise ValueError(f"Cyclic or unresolved dependency graph: {incoming}")
        for name in ready:
            ordered.append(name)
            del incoming[name]
        for parents in incoming.values():
            parents.difference_update(ready)

    acl_data = json.loads((REFERENCE / "three_pack_option2_privileges_snapshot.json").read_text(encoding="utf-8"))
    privileges = {item["relname"]: item for item in acl_data["objects"]}
    if not expected.issubset(privileges):
        raise ValueError(f"Missing ACL snapshot entries: {sorted(expected - set(privileges))}")
    if any(privileges[name]["owner"] != "postgres" for name in expected):
        raise ValueError("Unexpected reporting owner; manual review required")

    statements = [
        "-- GENERATED ROLLBACK PLAN; REVIEW ONLY. DO NOT RUN UNTIL APPROVED.",
        "-- Restores captured view/MV definitions, NOT materialized data, grants,",
        "-- ownership, refresh schedules, or concurrent-refresh eligibility.",
        "-- Those MUST be separately captured/validated before executing.",
        "-- DROP uses RESTRICT (no CASCADE). Unexpected dependencies abort.",
        "BEGIN;",
        "SET LOCAL lock_timeout = '5s';",
        "SET LOCAL statement_timeout = '2min';",
        "SET LOCAL search_path = public, pg_catalog;",
    ]
    # PostgreSQL-derived topological ordering, not hand-guessed object order.
    for name in reversed(ordered):
        kind = "VIEW" if name in VIEWS else "MATERIALIZED VIEW"
        statements.append(f"DROP {kind} {quoted(name)} RESTRICT;")
    for name in ordered:
        definition = entries[name]["definition"].strip().rstrip(";")
        if name in VIEWS:
            statements.append(f"CREATE VIEW {quoted(name)} AS\n{definition};")
        else:
            statements.append(f"CREATE MATERIALIZED VIEW {quoted(name)} AS\n{definition}\nWITH NO DATA;")
            for index in entries[name].get("indexes") or []:
                statements.append(index["ddl"].strip().rstrip(";") + ";")
    # CREATE resets ACLs. Restore captured privileges exactly, including
    # existing non-SELECT grants, rather than silently changing production ACLs.
    allowed_privileges = {"SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE", "REFERENCES", "TRIGGER"}
    for name in ordered:
        grants = privileges[name]["grants"]
        statements.append(f"REVOKE ALL ON TABLE {quoted(name)} FROM PUBLIC, anon, authenticated, service_role;")
        for grant in grants:
            grantee = grant["grantee"]
            privilege = grant["privilege"]
            if grantee == "postgres":
                continue
            if grantee not in ("PUBLIC", "anon", "authenticated", "service_role") or privilege not in allowed_privileges:
                raise ValueError(f"Unknown ACL entry: {name}: {grant}")
            grant_option = " WITH GRANT OPTION" if grant["grantable"] else ""
            statements.append(f"GRANT {privilege} ON TABLE {quoted(name)} TO {grantee}{grant_option};")
    statements += [
        "-- Deliberately no REFRESH inside this transaction.",
        "-- NOTE: all restored MVs are UNPOPULATED until explicitly refreshed.",
        "-- NOTE: this rollback is INCOMPLETE without ownership/grants/cron validation.",
        "COMMIT;",
    ]
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\n\n".join(statements) + "\n", encoding="utf-8")
    print(f"Generated {args.output}: {len(VIEWS)} views, {len(MVS)} MVs; {args.output.stat().st_size} bytes")
    print("WARNING: review-only; do not execute against production.")


if __name__ == "__main__":
    main()
