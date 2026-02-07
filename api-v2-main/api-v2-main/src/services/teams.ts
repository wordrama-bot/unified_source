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
    return {};
  }

  return changeKeys.camelCase(data, 10);
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

async function getTeamById(teamId: string) {
  const { data, error } = await db
    .from('_teams')
    .select('*')
    .eq('id', teamId)
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
  orderBy: string = 'name',
  orderDirection: string = 'asc',
  offset: number = 0,
  limit: number = 5,
) {
  const { data, error } = await db
    .from('_teams')
    .select('id, name, leader, minimum_level, created_at')
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    return {};
  }

  // Transform data to match frontend expectations
  const transformedData = data?.map((team, index) => ({
    teamId: team.id,
    teamName: team.name,
    leader: team.leader,
    minimumLevel: team.minimum_level,
    createdAt: team.created_at,
    overallRank: offset + index + 1, // Calculate rank based on position
  }));

  return changeKeys.camelCase(transformedData, 10);
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
    .maybeSingle();

  if (memberError) {
    console.error('Error checking team membership:', memberError);
  }

  // If found as member, return that team
  if (memberData && memberData._teams) {
    const transformedData = {
      vTeams: {
        teamId: memberData._teams.id,
        teamName: memberData._teams.name,
        leader: memberData._teams.leader,
        minimumLevel: memberData._teams.minimum_level,
        createdAt: memberData._teams.created_at,
        inviteCode: memberData._teams.invite_code,
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
    return {};
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

async function leaveTeam(userId: string) {
  // First, check if this user is the leader of any team
  const { data: leaderTeam } = await db
    .from('_teams')
    .select('id')
    .eq('leader', userId)
    .maybeSingle();

  if (leaderTeam) {
    // User is a team leader - need to handle leadership transfer
    
    // Get other team members (excluding the leaving leader)
    const { data: otherMembers } = await db
      .from('_team_member')
      .select('player')
      .eq('team', leaderTeam.id)
      .neq('player', userId)
      .limit(1);

    if (otherMembers && otherMembers.length > 0) {
      // Transfer leadership to the first available member
      const newLeader = otherMembers[0].player;
      
      const { error: transferError } = await db
        .from('_teams')
        .update({ leader: newLeader })
        .eq('id', leaderTeam.id);

      if (transferError) {
        console.error('Failed to transfer leadership:', transferError);
        return {};
      }

      // Remove the old leader from team members
      const { error: removeLeaderError } = await db
        .from('_team_member')
        .delete()
        .eq('player', userId);

      if (removeLeaderError) {
        console.error('Failed to remove old leader:', removeLeaderError);
        return {};
      }

    } else {
      // No other members - delete the entire team
      const { error: deleteTeamError } = await db
        .from('_teams')
        .delete()
        .eq('id', leaderTeam.id);

      if (deleteTeamError) {
        console.error('Failed to delete empty team:', deleteTeamError);
        return {};
      }

      // Note: _team_member will be empty anyway since leader was the only member
    }

  } else {
    // User is just a regular member - remove them normally
    const { error: leaveTeamError } = await db
      .from('_team_member')
      .delete()
      .eq('player', userId);

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
  getTeamByInviteCode,
  createTeam,
  joinTeam,
  leaveTeam,
};
