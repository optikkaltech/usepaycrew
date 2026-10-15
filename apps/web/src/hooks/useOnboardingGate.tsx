'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { TokenService, AuthService, OnboardingService } from '@/services';
import { useAuthStore } from '@/store';

export function useOnboardingGate() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuthStore();

  const hasTokens = typeof window !== 'undefined' && TokenService.hasTokens();

  // Query user profile if not cached in store
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const data = await AuthService.getMe();
      setUser(data);
      return data;
    },
    enabled: hasTokens && !user,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const currentUser = user || profile;

  // Query onboarding status for company owners
  const { data: onboarding, isLoading: isOnboardingLoading } = useQuery({
    queryKey: ['companyOnboardingStatus'],
    queryFn: OnboardingService.getCompanyStatus,
    enabled: hasTokens && currentUser?.role === 'COMPANY_OWNER',
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (!hasTokens) {
      if (!pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/onboard')) {
        router.push('/login');
      }
      return;
    }

    if (currentUser?.role === 'COMPANY_OWNER' && onboarding) {
      if (onboarding.currentStep && onboarding.currentStep !== 'COMPLETED') {
        if (!pathname.startsWith('/onboarding/company')) {
          router.push('/onboarding/company');
        }
      }
    }
  }, [hasTokens, pathname, currentUser, onboarding, router]);

  const isReady = hasTokens ? !isProfileLoading && !isOnboardingLoading && !!currentUser : false;

  return { isReady };
}
