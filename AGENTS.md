# Wordrama Development Guide

## Project

Wordrama
Production: https://wordrama.io

## Repository

Monorepo

Frontend:
wordrama-v2-main/wordrama-v2-main

Backend:
api-v2-main/api-v2-main

## Stack

- Next.js 14
- React
- Redux RTK Query
- Express
- Bun
- PostgreSQL (Supabase)
- Stripe
- Vercel
- Heroku

## Development Rules

- Never work directly on myfork/main.
- Always use feature branches.
- Audit before implementation.
- Preserve backwards compatibility.
- Keep commits focused and small.
- Never remove existing functionality without approval.
- Prefer additive changes over rewrites.
- Explain architectural risks before making changes.
- Do not begin coding until the requested design or audit has been approved.

## Current Architecture

- `_player_entitlements` is the single source of truth for premium ownership.
- Marketplace V2 is production.
- Stripe subscriptions and webhooks are production.
- Coins are production.
- Player statistics and leaderboards are production.
- Admin Dashboard is production.
- Frontend: Next.js 14 + RTK Query.
- Backend: Express running on Bun.
- Database: PostgreSQL (Supabase).

## Critical Rules

- Permanent statistics are sacred.
- Never allow experimental features to affect:
  - statistics
  - streaks
  - leaderboards
  - XP
  - achievements
  - coins
  - seasonal progression
- Favor server-authoritative game logic.
- Keep API contracts backward compatible.
- Reuse existing components when appropriate, but do not force new systems into legacy architectures.

## Coding Style

- Follow existing project conventions.
- Avoid unnecessary refactors.
- Keep functions focused and readable.
- Prefer explicit code over clever code.
- Keep commits logically grouped.

## Workflow

1. Audit first.
2. Produce findings.
3. Propose architecture.
4. Wait for approval.
5. Implement in small phases.
6. Self-review changes.
7. Summarize risks before completion.
