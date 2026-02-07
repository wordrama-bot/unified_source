import express from 'express';

import teamController from '../../controllers/teams';

export const router = express.Router();

/* Get routes */
router.get('/me', teamController.getMyTeam);
router.get('/leaderboard', teamController.getTeamLeaderboard);
router.get('/members/:teamId', teamController.getTeamMembers);
router.get('/teams', teamController.getTeams);
router.get('/', teamController.getTeam);

/* Post routes */
router.post('/join/:teamName', teamController.joinTeam);
router.post('/join-by-code', teamController.joinTeamByInviteCode);
router.post('/leave', teamController.leaveTeam);
router.post('/', teamController.createTeam);

/* Patch routes */

/* Delete routes */
