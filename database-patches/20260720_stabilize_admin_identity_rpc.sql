create or replace function public.admin_get_player_identity(
  p_player_id text,
  p_ip_limit integer default 10,
  p_related_account_limit integer default 100
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $function$
with target_activity as materialized (
  select
    nullif(
      btrim(split_part(a.headers->>'x_forwarded_for', ',', 1)),
      ''
    ) as forwarded_ip,
    nullif(btrim(a.headers->>'user_agent'), '') as user_agent,
    a.created_at
  from public._audit a
  where a.user_id = p_player_id
    and nullif(
      btrim(split_part(a.headers->>'x_forwarded_for', ',', 1)),
      ''
    ) is not null
),

target_ip_summary as (
  select
    forwarded_ip,
    count(*)::bigint as request_count,
    min(created_at) as first_seen_at,
    max(created_at) as last_seen_at,
    count(distinct user_agent)::integer as user_agent_count
  from target_activity
  group by forwarded_ip
),

selected_ips as materialized (
  select
    forwarded_ip,
    request_count,
    first_seen_at,
    last_seen_at,
    user_agent_count
  from target_ip_summary
  order by last_seen_at desc, request_count desc
  limit greatest(least(coalesce(p_ip_limit, 10), 25), 1)
),

target_user_agents as materialized (
  select
    ta.forwarded_ip,
    ta.user_agent,
    count(*)::bigint as request_count,
    min(ta.created_at) as first_seen_at,
    max(ta.created_at) as last_seen_at
  from target_activity ta
  inner join selected_ips si
    on si.forwarded_ip = ta.forwarded_ip
  where ta.user_agent is not null
  group by ta.forwarded_ip, ta.user_agent
),

-- Reverse-IP history is intentionally bounded per selected IP.
-- Some shared or high-volume client IPs contain hundreds of thousands
-- of audit rows and can exceed the database statement timeout.
-- The newest records provide the most relevant moderation evidence
-- while keeping the report response time predictable.

related_activity as (
  select
    recent_activity.user_id,
    si.forwarded_ip,
    recent_activity.user_agent,
    recent_activity.created_at
  from selected_ips si
  cross join lateral (
    select
      a.user_id,
      nullif(
        btrim(a.headers->>'user_agent'),
        ''
      ) as user_agent,
      a.created_at
    from public._audit a
    where nullif(
      btrim(split_part(a.headers->>'x_forwarded_for', ',', 1)),
      ''
    ) = si.forwarded_ip
      and a.user_id is not null
      and a.user_id <> p_player_id
    order by a.created_at desc
    limit 10000
  ) recent_activity
),

related_account_ip_summary as (
  select
    ra.user_id,
    ra.forwarded_ip,
    count(*)::bigint as request_count,
    min(ra.created_at) as first_seen_at,
    max(ra.created_at) as last_seen_at,
    count(distinct ra.user_agent)::integer as user_agent_count,
    count(
      distinct ra.user_agent
    ) filter (
      where ra.user_agent is not null
        and exists (
          select 1
          from target_user_agents tua
          where tua.forwarded_ip = ra.forwarded_ip
            and tua.user_agent = ra.user_agent
        )
    )::integer as matching_user_agent_count
  from related_activity ra
  group by ra.user_id, ra.forwarded_ip
),

related_account_summary as (
  select
    rais.user_id,
    count(*)::integer as shared_ip_count,
    sum(rais.request_count)::bigint as request_count,
    min(rais.first_seen_at) as first_seen_at,
    max(rais.last_seen_at) as last_seen_at,
    sum(rais.matching_user_agent_count)::integer
      as matching_user_agent_count,
    jsonb_agg(
      jsonb_build_object(
        'forwardedIp', rais.forwarded_ip,
        'requestCount', rais.request_count,
        'firstSeenAt', rais.first_seen_at,
        'lastSeenAt', rais.last_seen_at,
        'userAgentCount', rais.user_agent_count,
        'matchingUserAgentCount', rais.matching_user_agent_count
      )
      order by rais.last_seen_at desc
    ) as shared_ips
  from related_account_ip_summary rais
  group by rais.user_id
),

limited_related_accounts as (
  select *
  from related_account_summary
  order by
    shared_ip_count desc,
    matching_user_agent_count desc,
    last_seen_at desc,
    request_count desc
  limit greatest(
    least(coalesce(p_related_account_limit, 100), 250),
    1
  )
),

related_players as (
  select
    lra.user_id,
    p.username,
    p.display_name,
    p.created_at as player_created_at,
    lra.shared_ip_count,
    lra.request_count,
    lra.first_seen_at,
    lra.last_seen_at,
    lra.matching_user_agent_count,
    lra.shared_ips
  from limited_related_accounts lra
  left join public._players p
    on p.id::text = lra.user_id
)

select jsonb_build_object(
  'playerId',
  p_player_id,

  'ipAddresses',
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'forwardedIp', si.forwarded_ip,
          'requestCount', si.request_count,
          'firstSeenAt', si.first_seen_at,
          'lastSeenAt', si.last_seen_at,
          'userAgentCount', si.user_agent_count,
          'userAgents',
          coalesce(
            (
              select jsonb_agg(
                jsonb_build_object(
                  'userAgent', tua.user_agent,
                  'requestCount', tua.request_count,
                  'firstSeenAt', tua.first_seen_at,
                  'lastSeenAt', tua.last_seen_at
                )
                order by tua.last_seen_at desc, tua.request_count desc
              )
              from target_user_agents tua
              where tua.forwarded_ip = si.forwarded_ip
            ),
            '[]'::jsonb
          )
        )
        order by si.last_seen_at desc, si.request_count desc
      )
      from selected_ips si
    ),
    '[]'::jsonb
  ),

  'relatedAccounts',
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'playerId', rp.user_id,
          'username', rp.username,
          'displayName', rp.display_name,
          'playerCreatedAt', rp.player_created_at,
          'sharedIpCount', rp.shared_ip_count,
          'requestCount', rp.request_count,
          'firstSeenAt', rp.first_seen_at,
          'lastSeenAt', rp.last_seen_at,
          'matchingUserAgentCount', rp.matching_user_agent_count,
          'sharedIps', rp.shared_ips
        )
        order by
          rp.shared_ip_count desc,
          rp.matching_user_agent_count desc,
          rp.last_seen_at desc,
          rp.request_count desc
      )
      from related_players rp
    ),
    '[]'::jsonb
  )
);
$function$;

revoke all on function public.admin_get_player_identity(text, integer, integer)
from public;

grant execute on function public.admin_get_player_identity(text, integer, integer)
to service_role;