'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppStrings, MoonIcon, SunIcon } from '@/assets';
import {
  useTheme,
  useCompanyOnboardingStatus,
  useSaveCompanyProfile,
  useSaveCompanyCompliance,
  useCompleteCompanyBilling,
} from '@/hooks';
import { ProfileStep } from './_components/ProfileStep';
import { ComplianceStep } from './_components/ComplianceStep';
import { BillingStep } from './_components/BillingStep';
import { CompleteStep } from './_components/CompleteStep';
import { OnboardingStepper } from './_components/OnboardingStepper';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDark, toggleTheme, mounted } = useTheme();
  const [activeStep, setActiveStep] = useState<'PROFILE' | 'COMPLIANCE' | 'BILLING' | 'COMPLETED'>('PROFILE');
  const processedPaymentRef = useRef<string | null>(null);

  const { data: statusData, isLoading } = useCompanyOnboardingStatus((step) => setActiveStep(step));
  const profileMutation = useSaveCompanyProfile(() => setActiveStep('COMPLIANCE'));
  const complianceMutation = useSaveCompanyCompliance(() => setActiveStep('BILLING'));
  const billingMutation = useCompleteCompanyBilling(() => setActiveStep('COMPLETED'));

  // Handle returning from checkout redirect
  useEffect(() => {
    const status = searchParams.get('status') || searchParams.get('payment');
    const ref = searchParams.get('ref');
    const plan = searchParams.get('plan') || 'STARTER';

    if (status === 'success' && ref && processedPaymentRef.current !== ref) {
      processedPaymentRef.current = ref;
      window.history.replaceState({}, '', window.location.pathname);
      billingMutation.mutate({ plan, method: 'CARD' });
    }
  }, [searchParams, billingMutation]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-background">
        <p className="text-body-md text-muted-foreground">{AppStrings.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-[#fafbfc] text-[#0c1f1a] dark:bg-[#08090b] dark:text-[#f4f5f7] transition-colors duration-200 overflow-x-hidden">
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[550px] rounded-full bg-brand-emerald/[0.08] dark:bg-brand-emerald/[0.12] blur-[120px]" />

      {/* Top Header with Brand Emblem & Theme Toggle */}
      <header className="w-full max-w-xl flex items-center justify-between mb-6 z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-emerald text-black font-black text-caption shadow-[0_0_12px_rgba(6,214,160,0.4)]">
            P
          </div>
          <span className="text-label-md font-bold text-foreground tracking-tight">
            {AppStrings.appName}
          </span>
        </Link>

        {mounted && (
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>
        )}
      </header>

      {/* Main Form Container */}
      <div className="w-full max-w-xl relative z-10">
        {/* Stepper Progress */}
        <OnboardingStepper currentStep={activeStep} />

        {activeStep === 'PROFILE' && (
          <ProfileStep
            initialValues={statusData?.company}
            onSubmit={async (values) => profileMutation.mutate(values)}
            isLoading={profileMutation.isPending}
          />
        )}

        {activeStep === 'COMPLIANCE' && (
          <ComplianceStep
            country={statusData?.company?.country}
            onSubmit={async (values) => complianceMutation.mutate(values)}
            isLoading={complianceMutation.isPending}
          />
        )}

        {activeStep === 'BILLING' && (
          <BillingStep
            companyCountry={statusData?.company?.country}
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

export default function CompanyOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
          <p className="text-body-md text-muted-foreground">{AppStrings.common.loading}</p>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
