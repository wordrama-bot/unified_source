import express from 'express';

import liveDevController from '../../controllers/live/dev';

export const router = express.Router();

router.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({
      data: {},
      metadata: {},
      count: 0,
      message: 'Not found',
      status: 404,
    }).end();
  }

  return next();
});

router.post('/entitlements/grant', liveDevController.grantEntitlement);

router.post(
  '/tournaments/:tournamentId/open-registration',
  liveDevController.openRegistration,
);

router.post(
  '/tournaments/:tournamentId/start',
  liveDevController.startTournament,
);

router.post('/matches', liveDevController.createMatch);
