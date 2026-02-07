// Node Modules
import express from 'express';

// Routes
import account from './account/account.controller';

const router = express.Router();

// - /api/v1/auth/account
router.use('/account', account);

export default router;
