// Node Modules
import express, { Request, Response } from 'express';

import wordleConstants from '../constants'; 
const { validWordLengths } = wordleConstants;

// Services
import { 
  getTop15Players,
} from './leaderboard.service';

const router = express.Router();

// GET - /api/v1/games/wordle/leaderboard
router.get('/', async (req: Request, res: Response) => {
  try {
    const startIndex = req.query.offset as string || '0';
    const count = req.query.count as string || '14';
    let wordLength = req.query.wordlength as string;
    if (!validWordLengths.includes(wordLength)) {
      return res.status(400).json({
        status: 400,
        statusText: 'Invalid word length'
      });
    }

    const {
      error,
      ...leaderboard 
    } = await getTop15Players(wordLength, Number(startIndex), Number(count));

    return res.status(leaderboard.status).json(leaderboard);
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: 500,
      statusText: error.details[0].message
    });
  }
  
});

export default router;
