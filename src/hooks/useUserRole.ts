import { useState, useEffect } from 'react';
import { UserRole, getRolePermissions } from '@/lib/roles';

const ROLE_STORAGE_KEY = 'user_role_demo';

export const useUserRole = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY);
    return (stored as UserRole) || 'super_admin';
  });

  useEffect(() => {
    localStorage.setItem(ROLE_STORAGE_KEY, currentRole);
  }, [currentRole]);

  const permissions = getRolePermissions(currentRole);

  return {
    currentRole,
    setCurrentRole,
    permissions,
  };
};
