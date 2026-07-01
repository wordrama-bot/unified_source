import { Router } from 'express';
import adminController from '../../controllers/admin';
import {
  requireAdmin,
  requireAdminPermission,
} from '../../middleware/adminAuth';

export const router = Router();

router.use(requireAdmin);

router.get('/me', adminController.me);

router.get(
  '/overview',
  requireAdminPermission('admin:read'),
  adminController.overview,
);

router.get(
  '/players/search',
  requireAdminPermission('players:read'),
  adminController.playerSearch,
);

router.get(
  '/players/:playerId',
  requireAdminPermission('players:read'),
  adminController.playerProfile,
);

export default router;
