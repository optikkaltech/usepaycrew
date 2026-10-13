'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppStrings, BuildingIcon } from '@/assets';
import { http } from '@/services';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';
import { ProfileStep } from './_components/ProfileStep';
import { ComplianceStep } from './_components/ComplianceStep';
import { BillingStep } from './_components/BillingStep';
import { CompleteStep } from './_components/CompleteStep';
import {
  CompanyProfileFormValues,
  CompanyComplianceFormValues,
} from './_components/company-onboarding.types';

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState<'PROFILE' | 'COMPLIANCE' | 'BILLING' | 'COMPLETED'>('PROFILE');

  const { data: statusData, isLoading } = useQuery({
    queryKey: ['companyOnboardingStatus'],
    queryFn: async () => {
      const res = await http.get('/onboarding/company');
      if (res.currentStep) setActiveStep(res.currentStep);
      return res;
    },
  });

  const profileMutation = useMutation({
    mutationFn: (values: CompanyProfileFormValues) => http.post('/onboarding/company/profile', values),
    onSuccess: () => {
      toast.success('Organization profile saved');
      setActiveStep('COMPLIANCE');
      queryClient.invalidateQueries({ queryKey: ['companyOnboardingStatus'] });
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });

  const complianceMutation = useMutation({
    mutationFn: (values: CompanyComplianceFormValues) => http.post('/onboarding/company/compliance', values),
    onSuccess: () => {
      toast.success('Director KYB verified successfully');
      setActiveStep('BILLING');
      queryClient.invalidateQueries({ queryKey: ['companyOnboardingStatus'] });
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });

  const billingMutation = useMutation({
    mutationFn: ({ plan, method }: { plan: string; method: string }) =>
      http.post('/onboarding/company/complete', { plan, method }),
    onSuccess: () => {
      toast.success('Subscription activated! Company setup completed.');
      setActiveStep('COMPLETED');
      queryClient.invalidateQueries({ queryKey: ['companyOnboardingStatus'] });
    },
    onError: (err) => toast.error(normalizeError(err).message),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-body-md text-muted-foreground">{AppStrings.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-secondary">
      <div className="w-full max-w-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-brand">
            <BuildingIcon className="h-6 w-6" />
          </div>
          <h1 className="text-display-sm text-foreground">{AppStrings.onboarding.title}</h1>
          <p className="mt-1 text-body-xs text-muted-foreground">
            Complete compliance to unlock Korapay settlements and multi-chain stablecoin payroll
          </p>
        </div>

        {activeStep === 'PROFILE' && (
          <ProfileStep
            initialValues={statusData?.company}
            onSubmit={async (values) => profileMutation.mutate(values)}
            isLoading={profileMutation.isPending}
          />
        )}

        {activeStep === 'COMPLIANCE' && (
          <ComplianceStep
            onSubmit={async (values) => complianceMutation.mutate(values)}
            isLoading={complianceMutation.isPending}
          />
        )}

        {activeStep === 'BILLING' && (
          <BillingStep
            onSubmit={async (plan, method) => billingMutation.mutate({ plan, method })}
            isLoading={billingMutation.isPending}
          />
        )}

        {activeStep === 'COMPLETED' && (
          <CompleteStep
            company={statusData?.company}
            onGoToDashboard={() => router.push('/dashboard')}
          />
        )}
      </div>
    </div>
  );
}
