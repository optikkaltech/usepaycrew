'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TokenService, http } from '@/services';
import { useAuthStore } from '@/store';

export function useOnboardingGate() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!TokenService.hasTokens()) {
      if (!pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/onboard')) {
        router.push('/login');
      }
      return;
    }

    const checkStatus = async () => {
      try {
        let currentUser = user;
        if (!currentUser) {
          currentUser = await http.get('/auth/me');
          setUser(currentUser);
        }

        if (currentUser?.role === 'COMPANY_OWNER') {
          const onboarding = await http.get('/onboarding/company');
          if (onboarding && onboarding.currentStep !== 'COMPLETED') {
            if (!pathname.startsWith('/onboarding/company')) {
              router.push('/onboarding/company');
              return;
            }
          }
        }
        setIsReady(true);
      } catch {
        TokenService.clearTokens();
        router.push('/login');
      }
    };

    checkStatus();
  }, [pathname]);

  return { isReady };
}
