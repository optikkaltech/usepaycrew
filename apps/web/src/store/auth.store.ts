import { create } from 'zustand';
import { UserRole, UserStatus } from '@paycrew/shared-types';
import { TokenService } from '@/services/token.service';

export interface UserProfile {
  id: string;
  email: string;
  maskedEmail?: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  twoFactorEnabled: boolean;
  companyId: string | null;
  workerId?: string | null;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: TokenService.hasTokens(),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    TokenService.clearTokens();
    set({ user: null, isAuthenticated: false });
  },
}));
