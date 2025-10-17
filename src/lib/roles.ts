export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CONTRIBUTOR' | 'VIEWER';

export const Roles = {
  SUPER_ADMIN: 'SUPER_ADMIN' as UserRole,
  ADMIN: 'ADMIN' as UserRole,
  CONTRIBUTOR: 'CONTRIBUTOR' as UserRole,
  VIEWER: 'VIEWER' as UserRole,
};

export const RoleHierarchy: Record<UserRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  CONTRIBUTOR: 2,
  VIEWER: 1,
};

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return RoleHierarchy[userRole] >= RoleHierarchy[requiredRole];
}