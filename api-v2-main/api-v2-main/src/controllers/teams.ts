import { type Response } from 'express';
import { ApiRequest } from '../types';

import {
  notFoundResponse,
  badRequest,
  successfulResponse,
} from '../utils/responses';

import teamService from '../services/teams';
import levelService from '../services/levels';

import { FEATURES } from '../config/features';
import { hasPlayerEntitlement } from '../services/marketplaceV2/entitlements';

async function getTeamById(teamId: string, req: ApiRequest, res: Response) {
  const team = await teamService.getTeamById(teamId);
  if (!team) return notFoundResponse(req, res);

  return successfulResponse(req, res, team, 'Team returned', 1);
}

async function getTeamByName(teamName: string, req: ApiRequest, res: Response) {
  const team = await teamService.getTeamByName(teamName);
  if (!team) return notFoundResponse(req, res);

  return successfulResponse(req, res, team, 'Team returned', 1);
}

async function getTeamByLeader(
  leaderId: string,
  req: ApiRequest,
  res: Response,
) {
  const team = await teamService.getTeamByLeader(leaderId);
  if (!team) return notFoundResponse(req, res);

  return successfulResponse(req, res, team, 'Team returned', 1);
}

async function getTeam(req: ApiRequest, res: Response) {
  const { teamId, leader, teamName } = req.query;
  if (teamId) return getTeamById(teamId, req, res);
  else if (teamName) return getTeamByName(teamName, req, res);
  else if (leader) return getTeamByLeader(leader, req, res);
}

async function getTeams(req: ApiRequest, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const teamsLength = await teamService.getTeamsLength();

  const teams = await teamService.getTeams(offset, limit);
  if (!teams) return notFoundResponse(req, res);

  const totalPages = Math.ceil(teamsLength / limit);
  return successfulResponse(req, res, teams, 'Teams returned', teams.length, {
    previousPage: page - 1 > 0 ? page - 1 : 1,
    currentPage: page,
    nextPage: page + 1 < totalPages ? page + 1 : totalPages,
    totalPages,
    totalItems: teamsLength,
  });
}

async function getMyTeam(req: ApiRequest, res: Response) {
  const team = await teamService.getMyTeam(req.userId);
  if (!team) return notFoundResponse(req, res);

  return successfulResponse(req, res, team, 'Team returned', 1);
}

async function getMyTeams(req: ApiRequest, res: Response) {
  const teams = await teamService.getMyTeams(req.userId);

  return successfulResponse(
    req,
    res,
    teams,
    'Teams returned',
    teams?.teams?.length || 0,
  );
}

async function getTeamMembers(req: ApiRequest, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const teamMembersLength = await teamService.getTeamMembersLength(
    req.params.teamId,
  );

  const team = await teamService.getTeamMembers(
    req.params.teamId,
    offset,
    limit,
  );
  if (!team) return notFoundResponse(req, res);

  const totalPages = Math.ceil(teamMembersLength / limit);
  return successfulResponse(
    req,
    res,
    team,
    'Team members returned',
    team.length,
    {
      previousPage: page - 1 > 0 ? page - 1 : 1,
      currentPage: page,
      nextPage: page + 1 < totalPages ? page + 1 : totalPages,
      totalPages,
      totalItems: teamMembersLength,
    },
  );
}

async function getTeamLeaderboard(req: ApiRequest, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  const teamsLength = await teamService.getTeamsLength();

  const learderboard = await teamService.getAllTeamsForLeaderboard(
    req.query.orderBy || 'overall_rank',
    req.query.order || 'asc',
    offset,
    limit,
  );

  const totalPages = Math.ceil(teamsLength / limit);
  return successfulResponse(
    req,
    res,
    learderboard,
    'Team Leaderboard returned',
    learderboard.length,
    {
      previousPage: page - 1 > 0 ? page - 1 : 1,
      currentPage: page,
      nextPage: page + 1 < totalPages ? page + 1 : totalPages,
      totalPages,
      totalItems: teamsLength,
    },
  );
}

function onlyLettersAndNumbers(str: string) {
  return /^[A-Za-z0-9]*$/.test(str);
}

async function validateTeamJoinAccess(userId: string, teamId: string) {
  const alreadyMember = await teamService.isPlayerMemberOfTeam(userId, teamId);

  if (alreadyMember) {
    return { allowed: false, message: 'You are already a member of this team' };
  }

  const memberships = await teamService.getTeamMembershipsForPlayer(userId);

  if (memberships.length === 0) {
    return { allowed: true };
  }

  const canJoinMultipleTeams = await hasPlayerEntitlement(
    userId,
    FEATURES.TEAMS_MULTI_JOIN,
  );

  if (!canJoinMultipleTeams) {
    return {
      allowed: false,
      message: 'Plus or Creator access is required to join multiple teams',
    };
  }

  return { allowed: true };
}

async function createTeam(req: ApiRequest, res: Response) {
  const teamName = req.body.teamName;
  if (!teamName) return badRequest(req, res, 'Team name is required');

  const canCreateTeam = await hasPlayerEntitlement(
    req.userId,
    FEATURES.TEAMS_CREATE,
  );

  if (!canCreateTeam) {
    return badRequest(req, res, 'Premium access required to create a team');
  }

  const existingTeam = await teamService.getTeamByLeader(req.userId);

  if (existingTeam) {
    return badRequest(req, res, 'You already own a team');
  }
  
  if (teamName.length > 23)
    return badRequest(req, res, 'Team name is too long');

  if (teamName.length < 4) return badRequest(req, res, 'Team name is too short');

  if (!onlyLettersAndNumbers(teamName))
    return badRequest(
      req,
      res,
      'Only letters and numbers are allowed in team name',
    );

  const newTeam = await teamService.createTeam(
    req.userId,
    teamName.toUpperCase(),
    req?.body?.minimumLevel || 1,
  );
  if (!newTeam?.id) {
    return badRequest(req, res, 'Error creating team');
  }

  // Automatically add the creator as a team member
  const memberResult = await teamService.joinTeam(req.userId, newTeam.id);
  if (!memberResult) {
    console.warn('Failed to add creator as team member, but team was created');
  }

  return successfulResponse(req, res, newTeam, 'Team Created', 1);
}

async function joinTeam(req: ApiRequest, res: Response) {
  const team = await teamService.getTeamByName(req.params.teamName);
  if (!team) return notFoundResponse(req, res, 'Team not found');

  const { level } = await levelService.getLevel(req.userId);
  if (level < team.minimumLevel)
    return badRequest(
      req,
      res,
      'You are not high enough level to join this team',
    );

  const joinAccess = await validateTeamJoinAccess(req.userId, team.teamId);

  if (!joinAccess.allowed) {
    return badRequest(req, res, joinAccess.message);
  }
  
  const teamJoined = await teamService.joinTeam(req.userId, team.teamId);
  if (!teamJoined) return badRequest(req, res, 'Error joining team');

  return successfulResponse(req, res, teamJoined, 'Joined team', 1);
}

async function leaveTeam(req: ApiRequest, res: Response) {
  const { teamId } = req.body;

  if (!teamId) {
    return badRequest(req, res, 'Team ID is required');
  }

  const teamLeft = await teamService.leaveTeam(req.userId, teamId);

  if (!teamLeft) {
    return badRequest(req, res, 'Error leaving team');
  }

  return successfulResponse(req, res, teamLeft, 'Team left', 1);
}

async function joinTeamByInviteCode(req: ApiRequest, res: Response) {
  const { inviteCode } = req.body;
  if (!inviteCode) return badRequest(req, res, 'Invite code is required');

  const team = await teamService.getTeamByInviteCode(inviteCode);
  if (!team) return notFoundResponse(req, res, 'Invalid invite code');

  const { level } = await levelService.getLevel(req.userId);
  if (level < team.minimumLevel)
    return badRequest(
      req,
      res,
      'You are not high enough level to join this team',
    );

  const joinAccess = await validateTeamJoinAccess(req.userId, team.teamId);

  if (!joinAccess.allowed) {
    return badRequest(req, res, joinAccess.message);
  }
  
  const teamJoined = await teamService.joinTeam(req.userId, team.teamId);
  if (!teamJoined) return badRequest(req, res, 'Error joining team');

  return successfulResponse(req, res, teamJoined, 'Joined team', 1);
}

export default {
  getTeam,
  getTeams,
  getMyTeam,
  getMyTeams,
  getTeamMembers,
  getTeamLeaderboard,
  createTeam,
  joinTeam,
  joinTeamByInviteCode,
  leaveTeam,
};
