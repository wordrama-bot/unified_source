import express from 'express';
import uiStateController from '../../controllers/ui/state';

export const router = express.Router();

router.get('/state', uiStateController.getUiState);
router.post('/state', uiStateController.updateUiState);