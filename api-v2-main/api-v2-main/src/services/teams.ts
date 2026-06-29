import * as changeKeys from 'change-case/keys';
import { db } from '../models';
import generateRandomString from '../utils/random';

async function getTeamsLength() {
  const { count, error } = await db
    .from('_teams')
    .select('id', { count: 'exact' });

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getTeamMembersLength(teamId: string) {
  const { count, error } = await db
    .from('_team_member')
    .select('id', { count: 'exact' })
    .eq('team', teamId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

async function getTeamByLeader(userId: string) {
  const { data, error } = await db
    .from('_teams')
    .select('*')
    .eq('leader', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  if (!data) return null;

  return changeKeys.camelCase({
    teamId: data.id,
    teamName: data.name,
    leader: data.leader,
    minimumLevel: data.minimum_level,
    createdAt: data.created_at,
    inviteCode: data.invite_code,
  }, 10);
}

async function getTeamByName(teamName: string) {
  const { data, error } = await db
    .from('_teams')
    .select('*')
    .eq('name', teamName)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  if (data) {
    const transformedData = {
      teamId: data.id,
      teamName: data.name,
      leader: data.leader,
      minimumLevel: data.minimum_level,
      createdAt: data.created_at,
      inviteCode: data.invite_code,
    };

    return changeKeys.camelCase(transformedData, 10);
  }

  return {};
}

async function getTeamById(teamId: string) {
  const { data, error } = await db
    .from('_mv_team_wordle_stats')
    .select('*')
    .eq('team_id', teamId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  // Transform data to match frontend expectations
  if (data) {
    const transformedData = {
      teamId: data.team_id,
      teamName: data.team_name,
      leader: data.leader,
      minimumLevel: data.minimum_level,
      createdAt: data.created_at,
      inviteCode: data.invite_code,

      memberCount: data.member_count,
      averageLevel: data.average_level,
      totalCoins: data.total_coins,

      alltimeGamesPlayed: data.alltime_games_played,
      alltimeGamesWon: data.alltime_games_won,
      alltimeGamesLost: data.alltime_games_lost,
      alltimeGamesWonIn_1: data.alltime_games_won_in_1,
      alltimeGamesWonIn_2: data.alltime_games_won_in_2,
      alltimeGamesWonIn_3: data.alltime_games_won_in_3,
      alltimeGamesWonIn_4: data.alltime_games_won_in_4,
      alltimeGamesWonIn_5: data.alltime_games_won_in_5,
      alltimeGamesWonIn_6: data.alltime_games_won_in_6,

      dailyGamesPlayed: data.daily_games_played,
      dailyGamesWon: data.daily_games_won,
      dailyGamesLost: data.daily_games_lost,
      dailyGamesWonIn_1: data.daily_games_won_in_1,
      dailyGamesWonIn_2: data.daily_games_won_in_2,
      dailyGamesWonIn_3: data.daily_games_won_in_3,
      dailyGamesWonIn_4: data.daily_games_won_in_4,
      dailyGamesWonIn_5: data.daily_games_won_in_5,
      dailyGamesWonIn_6: data.daily_games_won_in_6,

      weeklyGamesPlayed: data.weekly_games_played,
      weeklyGamesWon: data.weekly_games_won,
      weeklyGamesLost: data.weekly_games_lost,
      weeklyGamesWonIn_1: data.weekly_games_won_in_1,
      weeklyGamesWonIn_2: data.weekly_games_won_in_2,
      weeklyGamesWonIn_3: data.weekly_games_won_in_3,
      weeklyGamesWonIn_4: data.weekly_games_won_in_4,
      weeklyGamesWonIn_5: data.weekly_games_won_in_5,
      weeklyGamesWonIn_6: data.weekly_games_won_in_6,

      monthlyGamesPlayed: data.monthly_games_played,
      monthlyGamesWon: data.monthly_games_won,
      monthlyGamesLost: data.monthly_games_lost,
      monthlyGamesWonIn_1: data.monthly_games_won_in_1,
      monthlyGamesWonIn_2: data.monthly_games_won_in_2,
      monthlyGamesWonIn_3: data.monthly_games_won_in_3,
      monthlyGamesWonIn_4: data.monthly_games_won_in_4,
      monthlyGamesWonIn_5: data.monthly_games_won_in_5,
      monthlyGamesWonIn_6: data.monthly_games_won_in_6,

      yearlyGamesPlayed: data.yearly_games_played,
      yearlyGamesWon: data.yearly_games_won,
      yearlyGamesLost: data.yearly_games_lost,
      yearlyGamesWonIn_1: data.yearly_games_won_in_1,
      yearlyGamesWonIn_2: data.yearly_games_won_in_2,
      yearlyGamesWonIn_3: data.yearly_games_won_in_3,
      yearlyGamesWonIn_4: data.yearly_games_won_in_4,
      yearlyGamesWonIn_5: data.yearly_games_won_in_5,
      yearlyGamesWonIn_6: data.yearly_games_won_in_6,
    };
    return changeKeys.camelCase(transformedData, 10);
  }

  return {};
}

async function getTeamByInviteCode(inviteCode: string) {
  const { data, error } = await db
    .from('_teams')
    .select('*')
    .eq('invite_code', inviteCode)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  // Transform data to match frontend expectations
  if (data) {
    const transformedData = {
      teamId: data.id,
      teamName: data.name,
      leader: data.leader,
      minimumLevel: data.minimum_level,
      createdAt: data.created_at,
      inviteCode: data.invite_code,
    };
    return changeKeys.camelCase(transformedData, 10);
  }

  return {};
}

async function getTeams(offset: number = 0, limit: number = 10) {
  const { data, error } = await db
    .from('_teams')
    .select('*')
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getAllTeamsForLeaderboard(
  orderBy: string = 'overall_rank',
  orderDirection: string = 'asc',
  offset: number = 0,
  limit: number = 10,
) {
  const { data, error } = await db
    .from('_v_team_leaderboard')
    .select('*')
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getMyTeam(userId: string) {
  // First check if user is a member of any team
  const { data: memberData, error: memberError } = await db
    .from('_team_member')
    .select(
      `
        _teams (*)
      `,
    )
    .eq('player', userId)
    .limit(1);

  if (memberError) {
    console.error('Error checking team membership:', memberError);
  }

  // If found as member, return that team
  const firstMembership = memberData?.[0];

  if (firstMembership && firstMembership._teams) {
    const transformedData = {
      vTeams: {
        teamId: firstMembership._teams.id,
        teamName: firstMembership._teams.name,
        leader: firstMembership._teams.leader,
        minimumLevel: firstMembership._teams.minimum_level,
        createdAt: firstMembership._teams.created_at,
        inviteCode: firstMembership._teams.invite_code,
      }
    };

    return changeKeys.camelCase(transformedData, 10);
  }

  // If not found as member, check if user is a leader of any team
  const { data: leaderData, error: leaderError } = await db
    .from('_teams')
    .select('*')
    .eq('leader', userId)
    .maybeSingle();

  if (leaderError) {
    console.error('Error checking team leadership:', leaderError);
    return {};
  }

  // If found as leader, return that team
  if (leaderData) {
    const transformedData = {
      vTeams: {
        teamId: leaderData.id,
        teamName: leaderData.name,
        leader: leaderData.leader,
        minimumLevel: leaderData.minimum_level,
        createdAt: leaderData.created_at,
        inviteCode: leaderData.invite_code,
      }
    };
    return changeKeys.camelCase(transformedData, 10);
  }

  // User has no team at all
  return {};
}

async function getMyTeams(userId: string) {
  const { data, error } = await db
    .from('_team_member')
    .select(
      `
      _teams (*)
    `,
    )
    .eq('player', userId);

  if (error) {
    console.error('Error checking team memberships:', error);
    return [];
  }

  const teams = (data || [])
    .filter((member: any) => member._teams)
    .map((member: any) => ({
      teamId: member._teams.id,
      teamName: member._teams.name,
      leader: member._teams.leader,
      minimumLevel: member._teams.minimum_level,
      createdAt: member._teams.created_at,
      inviteCode: member._teams.invite_code,
    }));

  return changeKeys.camelCase({ teams }, 10);
}

async function getTeamMembers(
  teamId: string,
  offset: number = 0,
  limit: number = 10,
) {
  const { data, error } = await db
    .from('_team_member')
    .select(
      `
      _players (
        id,
        display_name,
        profile_image,
        _levels (
          level
        )
      )
    `,
    )
    .eq('team', teamId)
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getTeamMembershipsForPlayer(userId: string) {
  const { data, error } = await db
    .from('_team_member')
    .select('id, team')
    .eq('player', userId);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

async function isPlayerMemberOfTeam(userId: string, teamId: string) {
  const { data, error } = await db
    .from('_team_member')
    .select('id')
    .eq('player', userId)
    .eq('team', teamId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return false;
  }

  return !!data;
}

async function createTeam(
  userId: string,
  teamName: string,
  minimumLevel: number,
) {
  // Generate a unique invite code for the team
  const inviteCode = generateRandomString(6);
  
  const { data, error: createTeamError } = await db
    .from('_teams')
    .insert(
      changeKeys.snakeCase({
        name: teamName,
        leader: userId,
        minimum_level: minimumLevel,
        invite_code: inviteCode,
      }),
    )
    .select('id, name, minimum_level, invite_code')
    .maybeSingle();

  if (createTeamError) {
    console.error(createTeamError);
    return null;
  }

  return changeKeys.camelCase(data);
}

async function getTeamLeaderboard(
  orderBy: string = 'overall_rank',
  orderDirection: string = 'asc',
  offset: number = 0,
  limit: number = 5,
) {
  const { data, error } = await db
    .from('_v_team_leaderboard')
    .select('*')
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function joinTeam(userId: string, teamId: string) {
  const { data, error: joinTeamError } = await db
    .from('_team_member')
    .insert({
      player: userId,
      team: teamId,
    })
    .select('id')
    .maybeSingle();

  if (joinTeamError) {
    console.error(joinTeamError);
    return {};
  }

  return changeKeys.camelCase(data);
}

async function leaveTeam(userId: string, teamId: string) {
  // First, confirm the user is actually a member of this specific team
  const isMember = await isPlayerMemberOfTeam(userId, teamId);

  if (!isMember) {
    console.error('User is not a member of this team');
    return {};
  }

  // Check if this user is the leader of this specific team
  const { data: leaderTeam } = await db
    .from('_teams')
    .select('id')
    .eq('id', teamId)
    .eq('leader', userId)
    .maybeSingle();

  if (leaderTeam) {
    // User is this team's leader - transfer leadership or delete the team

    const { data: otherMembers } = await db
      .from('_team_member')
      .select('player')
      .eq('team', teamId)
      .neq('player', userId)
      .limit(1);

    if (otherMembers && otherMembers.length > 0) {
      const newLeader = otherMembers[0].player;

      const { error: transferError } = await db
        .from('_teams')
        .update({ leader: newLeader })
        .eq('id', teamId);

      if (transferError) {
        console.error('Failed to transfer leadership:', transferError);
        return {};
      }

      const { error: removeLeaderError } = await db
        .from('_team_member')
        .delete()
        .eq('player', userId)
        .eq('team', teamId);

      if (removeLeaderError) {
        console.error('Failed to remove old leader:', removeLeaderError);
        return {};
      }
    } else {
      const { error: deleteMembershipError } = await db
        .from('_team_member')
        .delete()
        .eq('player', userId)
        .eq('team', teamId);

      if (deleteMembershipError) {
        console.error('Failed to delete leader membership:', deleteMembershipError);
        return {};
      }

      const { error: deleteTeamError } = await db
        .from('_teams')
        .delete()
        .eq('id', teamId);

      if (deleteTeamError) {
        console.error('Failed to delete empty team:', deleteTeamError);
        return {};
      }
    }
  } else {
    // User is a regular member of this specific team
    const { error: leaveTeamError } = await db
      .from('_team_member')
      .delete()
      .eq('player', userId)
      .eq('team', teamId);

    if (leaveTeamError) {
      console.error('Failed to leave team:', leaveTeamError);
      return {};
    }
  }

  return changeKeys.camelCase({
    message: 'Successfully left team',
  });
}

export default {
  getTeamsLength,
  getTeamMembersLength,
  getMyTeam,
  getTeams,
  getAllTeamsForLeaderboard,
  getTeamMembers,
  getTeamLeaderboard,
  getTeamByName,
  getTeamByLeader,
  getTeamById,
  getTeamMembershipsForPlayer,
  isPlayerMemberOfTeam,
  getTeamByInviteCode,
  getMyTeams,
  createTeam,
  joinTeam,
  leaveTeam,
};
