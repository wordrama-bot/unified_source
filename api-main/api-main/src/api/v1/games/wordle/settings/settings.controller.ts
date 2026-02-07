// Node Modules
import express, { Response } from 'express';

// Types
import { SettingsBodyRequest } from './settings.types';

// Middleware
import {
  authWithSupabaseJWT,
  RequestWithUserId
} from '../../../../../middleware/auth';

// Schema
import { settingsBodySchema } from './settings.schema';

// Services
import { getSettings, updateSettings } from './settings.service';

const router = express.Router();

// GET - /api/v1/games/wordle/settings
router.get('/', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  const { error, ...stats } = await getSettings(req.userId);
  return res.status(stats.status).json(stats);
});

// POST - /api/v1/games/wordle/settings
router.post('/', authWithSupabaseJWT, async (req: RequestWithUserId, res: Response) => {
  try {
    const {
      isHighContrast,
      isDarkMode,
      isHardMode,
      wordLength,
      isConfettiEnabled
    }: SettingsBodyRequest = await settingsBodySchema
      .validateAsync(req.body);

    const { error, ...stats } = await updateSettings(
      req.userId, 
      isHighContrast,
      isDarkMode,
      isHardMode,
      wordLength,
      isConfettiEnabled
    );
    return res.status(stats.status).json(stats);
  } catch (err){
    console.log(err)
    return res.status(422).json({
      status: 422,
      statusText: err.details[0].message
    });
  }
});

export default router;
