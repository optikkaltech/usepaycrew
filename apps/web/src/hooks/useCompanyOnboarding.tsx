'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OnboardingService } from '@/services';
import { useToast } from './useToast';
import { normalizeError } from '@/utils';
import {
  CompanyProfileFormValues,
  CompanyComplianceFormValues,
} from '@/app/onboarding/company/_components/company-onboarding.types';

export function useCompanyOnboardingStatus(onStepLoaded?: (step: any) => void) {
  return useQuery({
    queryKey: ['companyOnboardingStatus'],
    queryFn: async () => {
      const res = await OnboardingService.getCompanyStatus();
      if (res?.currentStep) onStepLoaded?.(res.currentStep);
      return res;
    },
  });
}

export function useSaveCompanyProfile(onSuccessCallback?: () => void) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CompanyProfileFormValues) => OnboardingService.saveProfile(values),
    onSuccess: () => {
      toast.success('Organization profile saved');
      queryClient.invalidateQueries({ queryKey: ['companyOnboardingStatus'] });
      onSuccessCallback?.();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });
}

export function useSaveCompanyCompliance(onSuccessCallback?: () => void) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CompanyComplianceFormValues) => OnboardingService.saveCompliance(values),
    onSuccess: (_, variables) => {
      if (variables?.skip) {
        toast.info('Compliance deferred. Proceeding to billing.');
      } else {
        toast.success('Director compliance verified successfully');
      }
      queryClient.invalidateQueries({ queryKey: ['companyOnboardingStatus'] });
      onSuccessCallback?.();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });
}
