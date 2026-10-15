'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionService, OnboardingService } from '@/services';
import { useToast } from './useToast';
import { normalizeError } from '@/utils';

export function useSubscriptionDeposit(planId: string, network: string) {
  return useQuery({
    queryKey: ['subscription-deposit-address', planId, network],
    queryFn: () =>
      SubscriptionService.initiate({
        currency: 'USDT',
        paymentMethod: 'CRYPTO',
        network,
        plan: planId,
      }),
    enabled: !!planId && !!network,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCompleteCompanyBilling(onSuccessCallback?: () => void) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: { plan: string; method: string }) =>
      OnboardingService.completeBilling(values),
    onSuccess: () => {
      toast.success('Subscription activated! Company setup completed.');
      queryClient.invalidateQueries({ queryKey: ['companyOnboardingStatus'] });
      onSuccessCallback?.();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });
}
