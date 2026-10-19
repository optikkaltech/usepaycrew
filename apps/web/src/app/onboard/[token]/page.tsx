'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { AppStrings, SunIcon, MoonIcon } from '@/assets';
import { Card } from '@/components/ui/Card';
import { http, TokenService } from '@/services';
import { useToast, useTheme } from '@/hooks';
import { normalizeError } from '@/utils';
import { KycCheckType } from '@paycrew/shared-types';
import { OnboardStepper, OnboardStep } from './_components/OnboardStepper';
import { ContractStep, ContractFormValues } from './_components/ContractStep';
import { KycStep } from './_components/KycStep';
import { BankStep } from './_components/BankStep';
import { OnboardCompleteStep } from './_components/OnboardCompleteStep';

export default function OnboardWorkerPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const toast = useToast();
  const { isDark, toggleTheme, mounted } = useTheme();

  const [step, setStep] = useState<OnboardStep>('CONTRACT');
  const [workerState, setWorkerState] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const { data: worker, isLoading, error } = useQuery({
    queryKey: ['workerInvite', resolvedParams.token],
    queryFn: () => http.get(`/workers/invite/${resolvedParams.token}`),
  });

  const activeWorker = workerState || worker;

  useEffect(() => {
    if (worker) {
      if (worker.status === 'ACTIVE') {
        setStep('DONE');
      } else if (worker.status === 'ONBOARDING' || worker.contracts?.[0]?.status === 'SIGNED') {
        setStep(worker.hasVerifiedKyc ? 'BANK' : 'KYC');
      }
    }
  }, [worker]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-background">
        <p className="text-body-md text-muted-foreground">{AppStrings.common.loading}</p>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-background">
        <Card className="max-w-md text-center p-6 border-border">
          <p className="text-display-sm text-destructive">Invalid or Expired Link</p>
          <p className="mt-2 text-body-sm text-muted-foreground">
            This invitation link is no longer valid or has already been used. Please contact your employer.
          </p>
        </Card>
      </div>
    );
  }

  const handleContractSubmit = async (values: ContractFormValues) => {
    try {
      setIsSubmitting(true);
      const onboardRes = await http.post('/workers/accept-invite', {
        token: resolvedParams.token,
        password: values.password,
      });

      if (onboardRes?.token) {
        TokenService.setAccessToken(onboardRes.token);
      }
      setWorkerState(onboardRes.worker || worker);

      const contract = worker.contracts?.[0];
      if (contract?.id) {
        await http.post(`/contracts/${contract.id}/sign`, {
          typedName: values.typedSignature,
        });
      }

      toast.success('Contract signed and account created');
      setStep('KYC');
    } catch (err) {
      toast.error(normalizeError(err).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKycSubmit = async (checkType: KycCheckType, identifier: string) => {
    try {
      setIsSubmitting(true);
      const workerId = activeWorker.id;
      await http.post(`/kyc/${workerId}/submit`, { checkType, identifier });
      toast.success('Identity verified with Prembly KYC');
      setStep('BANK');
    } catch (err) {
      toast.error(normalizeError(err).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBankSubmit = async (autoCashout: boolean, bankData?: any, existingMethodId?: string) => {
    try {
      setIsSubmitting(true);
      const workerId = activeWorker.id;
      if (existingMethodId) {
        await http.post(`/payout-methods/${workerId}/link-existing`, { existingMethodId });
      } else if (bankData) {
        await http.post(`/payout-methods/${workerId}/bank`, bankData);
      }
      await http.patch(`/workers/${workerId}/preferences`, { autoCashoutEnabled: autoCashout });
      toast.success('Payout preference configured');
      setStep('DONE');
    } catch (err) {
      toast.error(normalizeError(err).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-[#fafbfc] text-[#0c1f1a] dark:bg-[#08090b] dark:text-[#f4f5f7] transition-colors duration-200 overflow-x-hidden">
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[550px] rounded-full bg-brand-emerald/[0.08] dark:bg-brand-emerald/[0.12] blur-[120px]" />

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
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>
        )}
      </header>

      <div className="w-full max-w-xl relative z-10">
        <OnboardStepper currentStep={step} />

        {step === 'CONTRACT' && (
          <ContractStep
            worker={worker}
            onSubmit={handleContractSubmit}
            isLoading={isSubmitting}
          />
        )}

        {step === 'KYC' && (
          <KycStep
            hasVerifiedKyc={activeWorker.hasVerifiedKyc}
            onSubmit={handleKycSubmit}
            onSkip={() => setStep('BANK')}
            isLoading={isSubmitting}
          />
        )}

        {step === 'BANK' && (
          <BankStep
            workerId={activeWorker.id}
            existingPayoutMethods={activeWorker.existingPayoutMethods}
            onComplete={handleBankSubmit}
            isLoading={isSubmitting}
          />
        )}

        {step === 'DONE' && (
          <OnboardCompleteStep
            workerName={activeWorker.name}
            companyName={activeWorker.company?.name || 'Your Company'}
            isLoading={isNavigating}
            onGoToDashboard={() => {
              setIsNavigating(true);
              router.push(`/worker/${activeWorker.id}`);
            }}
          />
        )}
      </div>
    </div>
  );
}
