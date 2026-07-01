import { db } from '../../models';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'ADMINISTRATOR'
  | 'MODERATOR'
  | 'SUPPORT'
  | 'READ_ONLY';

export async function getActiveAdminRole(playerId: string) {
  const { data, error } = await db
    .from('_admin_roles')
    .select('id, player_id, role, granted_at, metadata')
    .eq('player_id', playerId)
    .eq('is_active', true)
    .is('revoked_at', null)
    .maybeSingle();

  if (error) {
    console.error('[admin.roles] getActiveAdminRole error', error);
    throw new Error('Unable to verify admin role.');
  }

  return data;
}

export function getPermissions(role: AdminRole | string) {
  const permissionsByRole: Record<string, string[]> = {
    SUPER_ADMIN: ['*'],
    ADMINISTRATOR: [
      'admin:read',
      'players:read',
      'moderation:write',
      'economy:write',
      'entitlements:write',
      'leaderboards:write',
      'system:write',
    ],
    MODERATOR: [
      'admin:read',
      'players:read',
      'moderation:write',
      'leaderboards:write',
    ],
    SUPPORT: [
      'admin:read',
      'players:read',
      'support:write',
    ],
    READ_ONLY: [
      'admin:read',
      'players:read',
    ],
  };

  return permissionsByRole[role] ?? [];
}

export function hasPermission(role: AdminRole | string, permission: string) {
  const permissions = getPermissions(role);
  return permissions.includes('*') || permissions.includes(permission);
}
