import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'SYSTEM_ADMIN' | 'CHAIN_MANAGER' | 'FRANCHISE_OWNER' | 'STORE_MANAGER' | 'STAFF_POS' | 'BARISTA' | 'WAREHOUSE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
