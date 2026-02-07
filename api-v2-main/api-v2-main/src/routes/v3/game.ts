import express from 'express';

import wordleController from '../../controllers/game/wordle';
import wordleWordsController from '../../controllers/game/wordle/words';
import wordleStateController from '../../controllers/game/wordle/state';
import spellbeeController from '../../controllers/game/spellbee';

export const router = express.Router();

/* Get routes */
router.get('/wordle/last-30/:wordPack', wordleController.getLast30);
router.get('/wordle/game-state', wordleStateController.getGameState);
router.get('/wordle/custom/:shareCode', wordleController.getCustom);
router.get('/wordle/wordpack/:wordPack', wordleWordsController.getWordPack);
router.get('/wordle/wordpacks', wordleWordsController.getMyWordPacks);
router.get(
  '/wordle/wordPack/:wordPack/todays-word',
  wordleWordsController.getTodaysWord,
);

/* Post routes */
router.post('/wordle/result', wordleController.submitWordleResult);
router.post('/wordle/custom', wordleController.createCustom);
router.post('/wordle/game-state', wordleStateController.updateGameState);
router.post('/spellbee/result', spellbeeController.submitSpellbeeResult);

/* Patch routes */

/* Delete routes */
