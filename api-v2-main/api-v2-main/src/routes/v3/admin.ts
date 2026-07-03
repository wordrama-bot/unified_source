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
  '/players/:playerId/notes',
  requireAdminPermission('players:read'),
  adminController.playerNotes,
);

router.post(
  '/players/:playerId/notes',
  requireAdminPermission('support:write'),
  adminController.createPlayerNote,
);

router.post(
  '/players/:playerId/coins/grant',
  requireAdminPermission('economy:write'),
  adminController.grantCoins,
);

router.post(
  '/players/:playerId/ban',
  requireAdminPermission('moderation:write'),
  adminController.banPlayerAccount,
);

router.post(
  '/players/:playerId/unban',
  requireAdminPermission('moderation:write'),
  adminController.unbanPlayerAccount,
);

router.get(
  '/players/:playerId/entitlements',
  requireAdminPermission('players:read'),
  adminController.playerEntitlements,
);

router.post(
  '/players/:playerId/entitlements/grant/preview',
  requireAdminPermission('economy:write'),
  adminController.previewGrantEntitlement,
);

router.post(
  '/players/:playerId/entitlements/grant',
  requireAdminPermission('economy:write'),
  adminController.grantEntitlement,
);

router.get(
  '/catalog',
  requireAdminPermission('players:read'),
  adminController.catalog,
);

router.get(
  '/suspicious-gameplay',
  requireAdminPermission('players:read'),
  adminController.suspiciousGameplay,
);

router.get(
  '/players/:playerId',
  requireAdminPermission('players:read'),
  adminController.playerProfile,
);

export default router;
