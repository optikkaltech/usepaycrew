'use client';

import { useAuthStore } from '@/store';
import { TokenService, http } from '@/services';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, isAuthenticated, setUser, logout: storeLogout } = useAuthStore();
  const router = useRouter();

  const logout = () => {
    storeLogout();
    router.push('/login');
  };

  const fetchProfile = async () => {
    if (!TokenService.hasTokens()) return null;
    try {
      const data = await http.get('/auth/me');
      setUser(data);
      return data;
    } catch {
      logout();
      return null;
    }
  };

  return {
    user,
    isAuthenticated,
    logout,
    fetchProfile,
  };
}
