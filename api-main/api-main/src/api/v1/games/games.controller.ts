// Node Modules
import { Router, Request, Response } from 'express';
const router = Router();

// Routes
import wordle from './wordle/wordle.controller';
// Services
import { 
  getGames,
  getAvailableGames
} from './games.service'; 

// - /api/v1/games/wordle/
router.use('/wordle', wordle);

// Controller
router.get('/', async (req: Request, res: Response) => {
  const { error, ...games } = await getGames();
  return res.status(games.status).json(games);
});

router.get('/available', async (req: Request, res: Response) => {
  const { error, ...games } = await getAvailableGames();
  return res.status(games.status).json(games);
});

export default router;
