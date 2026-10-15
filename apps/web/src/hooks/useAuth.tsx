'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { TokenService, AuthService } from '@/services';
import { useRouter } from 'next/navigation';
import { useToast } from './useToast';

export function useAuth() {
  const { user, isAuthenticated, setUser, logout: storeLogout } = useAuthStore();
  const router = useRouter();

  const logout = () => {
    storeLogout();
    router.push('/login');
  };

  const profileQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const data = await AuthService.getMe();
      setUser(data);
      return data;
    },
    enabled: typeof window !== 'undefined' && TokenService.hasTokens(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: user || profileQuery.data,
    isAuthenticated,
    logout,
    fetchProfile: profileQuery.refetch,
    isLoading: profileQuery.isLoading,
  };
}

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const toast = useToast();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      TokenService.setAccessToken(data.accessToken);
      TokenService.setRefreshToken(data.refreshToken);
      setUser(data.user);
      toast.success('Signed in successfully');
      router.push('/dashboard');
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const toast = useToast();

  return useMutation({
    mutationFn: AuthService.register,
    onSuccess: (data) => {
      TokenService.setAccessToken(data.accessToken);
      TokenService.setRefreshToken(data.refreshToken);
      setUser(data.user);
      toast.success('Account created successfully');
      router.push('/dashboard');
    },
  });
}

