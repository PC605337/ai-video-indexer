export type UserRole = 'viewer' | 'contributor' | 'admin' | 'super_admin';

export interface RolePermissions {
  canViewMedia: boolean;
  canUpload: boolean;
  canViewAdvancedFeatures: boolean;
  canViewAnalytics: boolean;
  canViewAdministration: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  viewer: {
    canViewMedia: true,
    canUpload: false,
    canViewAdvancedFeatures: false,
    canViewAnalytics: false,
    canViewAdministration: false,
  },
  contributor: {
    canViewMedia: true,
    canUpload: true,
    canViewAdvancedFeatures: false,
    canViewAnalytics: false,
    canViewAdministration: false,
  },
  admin: {
    canViewMedia: true,
    canUpload: true,
    canViewAdvancedFeatures: true,
    canViewAnalytics: true,
    canViewAdministration: true,
  },
  super_admin: {
    canViewMedia: true,
    canUpload: true,
    canViewAdvancedFeatures: true,
    canViewAnalytics: true,
    canViewAdministration: true,
  },
};

export const roleLabels: Record<UserRole, string> = {
  viewer: 'Viewer',
  contributor: 'Contributor',
  admin: 'Admin',
  super_admin: 'Super Admin',
};

export const getRolePermissions = (role: UserRole): RolePermissions => {
  return rolePermissions[role];
};
