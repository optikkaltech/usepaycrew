'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { AuthService, TokenService } from '@/services';
import { useAuthStore, useLoadingStore } from '@/store';
import { useToast } from './useToast';
import { normalizeError } from '@/utils';

export function useGoogleAuth(redirectPath: '/login' | '/register' = '/login', defaultRole?: string) {
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const toast = useToast();
  const exchangedCodeRef = useRef<string | null>(null);

  // TanStack Mutation for Google code exchange
  const exchangeMutation = useMutation({
    mutationFn: async ({ code, redirectUri }: { code: string; redirectUri: string }) => {
      let role = defaultRole;
      try {
        const saved = sessionStorage.getItem('paycrew_pending_oauth_role');
        if (saved) {
          role = saved;
          sessionStorage.removeItem('paycrew_pending_oauth_role');
        }
      } catch (_) {}

      return AuthService.exchangeGoogleCode({
        code,
        redirectUri,
        role,
      });
    },
    onSuccess: (data) => {
      window.history.replaceState({}, '', window.location.pathname);
      TokenService.setAccessToken(data.accessToken);
      TokenService.setRefreshToken(data.refreshToken);
      setUser(data.user);
      toast.success(`Welcome, ${data.user.fullName || data.user.email}! Signed in with Google`);
      useLoadingStore.getState().startLoading('Launching your workspace...');
      if (data.user?.role === 'WORKER') {
        const workerId = data.user.workerId || data.user.id;
        window.location.href = `/worker/${workerId}`;
      } else {
        window.location.href = '/dashboard';
      }
    },
    onError: (err) => {
      window.history.replaceState({}, '', window.location.pathname);
      toast.error(normalizeError(err).message);
    },
  });

  // TanStack Mutation for fetching Google OAuth authorization URL
  const authUrlMutation = useMutation({
    mutationFn: async (redirectUri: string) => {
      return AuthService.getGoogleAuthUrl(redirectUri);
    },
    onSuccess: (res) => {
      if (res?.url) {
        window.location.href = res.url;
      } else {
        toast.error('Google OAuth URL was not returned by server');
      }
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) return;

    if (exchangedCodeRef.current === code) return;
    exchangedCodeRef.current = code;

    const redirectUri = `${window.location.origin}${window.location.pathname}`;
    exchangeMutation.mutate({ code, redirectUri });
  }, [searchParams, exchangeMutation]);

  const initiateGoogleAuth = (roleOverride?: string) => {
    useLoadingStore.getState().startLoading('Connecting to Google...');
    const roleToSend = roleOverride || defaultRole;
    if (roleToSend) {
      try {
        sessionStorage.setItem('paycrew_pending_oauth_role', roleToSend);
      } catch (_) {}
    }
    const redirectUri = `${window.location.origin}${window.location.pathname}`;
    authUrlMutation.mutate(redirectUri);
  };

  const isGoogleLoading = exchangeMutation.isPending || authUrlMutation.isPending;

  return {
    initiateGoogleAuth,
    isGoogleLoading,
  };
}
