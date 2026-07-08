import express from 'express';

import liveMatchesController from '../../controllers/live/matches';
import liveRegistrationController from '../../controllers/live/registration';
import liveStateController from '../../controllers/live/state';
import liveTournamentsController from '../../controllers/live/tournaments';

export const router = express.Router();

router.post('/tournaments', liveTournamentsController.create);

router.post(
  '/tournaments/:tournamentId/join',
  liveRegistrationController.join,
);

router.post(
  '/tournaments/:tournamentId/ready',
  liveRegistrationController.ready,
);

router.post('/matches/:matchId/start', liveMatchesController.start);

router.post('/matches/:matchId/guesses', liveMatchesController.submitGuess);

router.get('/matches/:matchId/state', liveStateController.getMatch);
