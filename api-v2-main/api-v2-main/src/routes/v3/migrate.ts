import express from 'express';
import migrateController from '../../controllers/migrate';

export const router = express.Router();

/**
 * Uses validateToken's SERVICE_TOKEN mode:
 * ?authMethod=SERVICE_TOKEN&apiKey=...&action=migrate&userId=...
 */
router.post('/challenges', migrateController.backfillChallenges);

export default router;