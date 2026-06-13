-- 20260613_team_wordle_stats_materialized_view.sql
-- Creates team-level Wordle stats from existing player leaderboard materialized views.
-- Supports Teams detail pages across all-time, daily, weekly, monthly, and yearly stats.

drop materialized view if exists public._mv_team_wordle_stats;

create materialized view public._mv_team_wordle_stats as
with members as (
  select team, player
  from public._team_member
),
alltime as (
  select
    m.team as team_id,
    count(m.player) as member_count,
    coalesce(avg(a.level), 0) as average_level,
    coalesce(sum(a.coin_balance), 0) as total_coins,
    coalesce(sum(a.games_played), 0) as alltime_games_played,
    coalesce(sum(a.games_won), 0) as alltime_games_won,
    coalesce(sum(a.games_lost), 0) as alltime_games_lost,
    coalesce(sum(a.games_won_in_1), 0) as alltime_games_won_in_1,
    coalesce(sum(a.games_won_in_2), 0) as alltime_games_won_in_2,
    coalesce(sum(a.games_won_in_3), 0) as alltime_games_won_in_3,
    coalesce(sum(a.games_won_in_4), 0) as alltime_games_won_in_4,
    coalesce(sum(a.games_won_in_5), 0) as alltime_games_won_in_5,
    coalesce(sum(a.games_won_in_6), 0) as alltime_games_won_in_6
  from members m
  left join public._mv_wordle_alltime_leaderboard a
    on a.player = m.player
  group by m.team
),
daily as (
  select
    m.team as team_id,
    coalesce(sum(d.games_played), 0) as daily_games_played,
    coalesce(sum(d.games_won), 0) as daily_games_won,
    coalesce(sum(d.games_lost), 0) as daily_games_lost,
    coalesce(sum(d.games_won_in_1), 0) as daily_games_won_in_1,
    coalesce(sum(d.games_won_in_2), 0) as daily_games_won_in_2,
    coalesce(sum(d.games_won_in_3), 0) as daily_games_won_in_3,
    coalesce(sum(d.games_won_in_4), 0) as daily_games_won_in_4,
    coalesce(sum(d.games_won_in_5), 0) as daily_games_won_in_5,
    coalesce(sum(d.games_won_in_6), 0) as daily_games_won_in_6
  from members m
  left join public._mv_wordle_daily_leaderboard d
    on d.player = m.player
    and d.day = extract(day from now())::bigint
    and d.month = extract(month from now())::bigint
    and d.year = extract(year from now())::bigint
  group by m.team
),
weekly as (
  select
    m.team as team_id,
    coalesce(sum(w.games_played), 0) as weekly_games_played,
    coalesce(sum(w.games_won), 0) as weekly_games_won,
    coalesce(sum(w.games_lost), 0) as weekly_games_lost,
    coalesce(sum(w.games_won_in_1), 0) as weekly_games_won_in_1,
    coalesce(sum(w.games_won_in_2), 0) as weekly_games_won_in_2,
    coalesce(sum(w.games_won_in_3), 0) as weekly_games_won_in_3,
    coalesce(sum(w.games_won_in_4), 0) as weekly_games_won_in_4,
    coalesce(sum(w.games_won_in_5), 0) as weekly_games_won_in_5,
    coalesce(sum(w.games_won_in_6), 0) as weekly_games_won_in_6
  from members m
  left join public._mv_wordle_weekly_leaderboard w
    on w.player = m.player
   and w.week = extract(week from now())::bigint
   and w.year = extract(year from now())::bigint
  group by m.team
),
monthly as (
  select
    m.team as team_id,
    coalesce(sum(mo.games_played), 0) as monthly_games_played,
    coalesce(sum(mo.games_won), 0) as monthly_games_won,
    coalesce(sum(mo.games_lost), 0) as monthly_games_lost,
    coalesce(sum(mo.games_won_in_1), 0) as monthly_games_won_in_1,
    coalesce(sum(mo.games_won_in_2), 0) as monthly_games_won_in_2,
    coalesce(sum(mo.games_won_in_3), 0) as monthly_games_won_in_3,
    coalesce(sum(mo.games_won_in_4), 0) as monthly_games_won_in_4,
    coalesce(sum(mo.games_won_in_5), 0) as monthly_games_won_in_5,
    coalesce(sum(mo.games_won_in_6), 0) as monthly_games_won_in_6
  from members m
  left join public._mv_wordle_monthly_leaderboard mo
    on mo.player = m.player
    and mo.month = extract(month from now())::bigint
    and mo.year = extract(year from now())::bigint
  group by m.team
),
yearly as (
  select
    m.team as team_id,
    coalesce(sum(y.games_played), 0) as yearly_games_played,
    coalesce(sum(y.games_won), 0) as yearly_games_won,
    coalesce(sum(y.games_lost), 0) as yearly_games_lost,
    coalesce(sum(y.games_won_in_1), 0) as yearly_games_won_in_1,
    coalesce(sum(y.games_won_in_2), 0) as yearly_games_won_in_2,
    coalesce(sum(y.games_won_in_3), 0) as yearly_games_won_in_3,
    coalesce(sum(y.games_won_in_4), 0) as yearly_games_won_in_4,
    coalesce(sum(y.games_won_in_5), 0) as yearly_games_won_in_5,
    coalesce(sum(y.games_won_in_6), 0) as yearly_games_won_in_6
  from members m
  left join public._mv_wordle_yearly_leaderboard y
    on y.player = m.player
    and y.year = extract(year from now())::bigint
  group by m.team
)
select
  t.id as team_id,
  t.name as team_name,
  t.leader,
  t.minimum_level,
  t.created_at,
  t.invite_code,
  alltime.member_count,
  alltime.average_level,
  alltime.total_coins,
  alltime.alltime_games_played,
  alltime.alltime_games_won,
  alltime.alltime_games_lost,
  alltime.alltime_games_won_in_1,
  alltime.alltime_games_won_in_2,
  alltime.alltime_games_won_in_3,
  alltime.alltime_games_won_in_4,
  alltime.alltime_games_won_in_5,
  alltime.alltime_games_won_in_6,
  daily.daily_games_played,
  daily.daily_games_won,
  daily.daily_games_lost,
  daily.daily_games_won_in_1,
  daily.daily_games_won_in_2,
  daily.daily_games_won_in_3,
  daily.daily_games_won_in_4,
  daily.daily_games_won_in_5,
  daily.daily_games_won_in_6,
  weekly.weekly_games_played,
  weekly.weekly_games_won,
  weekly.weekly_games_lost,
  weekly.weekly_games_won_in_1,
  weekly.weekly_games_won_in_2,
  weekly.weekly_games_won_in_3,
  weekly.weekly_games_won_in_4,
  weekly.weekly_games_won_in_5,
  weekly.weekly_games_won_in_6,
  monthly.monthly_games_played,
  monthly.monthly_games_won,
  monthly.monthly_games_lost,
  monthly.monthly_games_won_in_1,
  monthly.monthly_games_won_in_2,
  monthly.monthly_games_won_in_3,
  monthly.monthly_games_won_in_4,
  monthly.monthly_games_won_in_5,
  monthly.monthly_games_won_in_6,
  yearly.yearly_games_played,
  yearly.yearly_games_won,
  yearly.yearly_games_lost,
  yearly.yearly_games_won_in_1,
  yearly.yearly_games_won_in_2,
  yearly.yearly_games_won_in_3,
  yearly.yearly_games_won_in_4,
  yearly.yearly_games_won_in_5,
  yearly.yearly_games_won_in_6
from public._teams t
left join alltime on alltime.team_id = t.id
left join daily on daily.team_id = t.id
left join weekly on weekly.team_id = t.id
left join monthly on monthly.team_id = t.id
left join yearly on yearly.team_id = t.id;

create unique index if not exists idx_mv_team_wordle_stats_team_id
on public._mv_team_wordle_stats(team_id);