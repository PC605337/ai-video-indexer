import { create } from 'zustand';
import { type UserRole, Roles, hasPermission } from './roles';

interface UserRoleState {
  role: UserRole;
  setRole: (role: UserRole) => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

export const useUserRole = create<UserRoleState>((set, get) => ({
  role: Roles.VIEWER, // Default role
  setRole: (role: UserRole) => set({ role }),
  hasPermission: (requiredRole: UserRole) => hasPermission(get().role, requiredRole),
}));