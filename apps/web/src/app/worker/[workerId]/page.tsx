'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AppStrings,
  ArrowDownLeftIcon,
  CheckCircleIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { formatCurrency } from '@/utils';
import { useToast } from '@/hooks';
import clsx from 'clsx';
import { KycSection } from './_components/KycSection';
import { BankSection } from './_components/BankSection';
import { WithdrawModal } from './_components/WithdrawModal';

export default function WorkerPortalPage({ params }: { params: Promise<{ workerId: string }> }) {
  const resolvedParams = use(params);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [isUpdatingPreference, setIsUpdatingPreference] = useState(false);
  const toast = useToast();

  const { data: worker, refetch: refetchWorker } = useQuery({
    queryKey: ['worker', resolvedParams.workerId],
    queryFn: () => http.get(`/workers/${resolvedParams.workerId}`),
  });

  const { data: balanceData, refetch: refetchBalance } = useQuery({
    queryKey: ['workerBalance', resolvedParams.workerId],
    queryFn: () => http.get(`/ledger/worker-balance?currency=USD`),
  });

  const { data: payoutMethods = [], refetch: refetchMethods } = useQuery({
    queryKey: ['payoutMethods', resolvedParams.workerId],
    queryFn: () => http.get(`/payout-methods/${resolvedParams.workerId}`),
  });

  const { data: rateData } = useQuery({
    queryKey: ['marketRate'],
    queryFn: () => http.get('/payments/rate'),
  });

  const refetchAll = () => {
    refetchWorker();
    refetchBalance();
    refetchMethods();
  };

  const liveRate = rateData?.rate || 1540;
  const availableUsd = balanceData?.availableBalance ? parseFloat(balanceData.availableBalance) : 0;
  const availableNgn = availableUsd * liveRate;
  const isKycVerified = worker?.status === 'ACTIVE' || worker?.status === 'VERIFIED';
  const defaultMethod = payoutMethods.find((m: any) => m.isDefault);

  const toggleAutoCashout = async () => {
    setIsUpdatingPreference(true);
    try {
      const nextState = !worker?.autoCashoutEnabled;
      await http.patch(`/workers/${resolvedParams.workerId}/preferences`, {
        autoCashoutEnabled: nextState,
      });
      await refetchWorker();
      toast.success(
        nextState
          ? 'Auto-Cashout enabled: Salary will automatically deposit to your bank'
          : 'Auto-Cashout disabled: Salary will remain safely in USDT',
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update preferences');
    } finally {
      setIsUpdatingPreference(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <span className="text-overline text-brand-emerald font-bold">Worker Portal</span>
          <h1 className="text-display-sm text-foreground font-extrabold">{worker?.name || 'Contractor'}</h1>
          <p className="text-caption text-muted-foreground">{worker?.role}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-brand">
          P
        </div>
      </div>

      {/* Compliance Onboarding Progress Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-secondary/60 p-3 rounded-xl border border-border">
        <div className="flex items-center gap-1.5 text-caption font-semibold text-success">
          <CheckCircleIcon className="h-3.5 w-3.5 shrink-0" />
          <span>1. Invite Signed</span>
        </div>
        <div className={`flex items-center gap-1.5 text-caption font-semibold ${isKycVerified ? 'text-success' : 'text-warning'}`}>
          <CheckCircleIcon className="h-3.5 w-3.5 shrink-0" />
          <span>2. Identity Check</span>
        </div>
        <div className={`flex items-center gap-1.5 text-caption font-semibold ${defaultMethod ? 'text-success' : 'text-warning'}`}>
          <CheckCircleIcon className="h-3.5 w-3.5 shrink-0" />
          <span>3. Bank Linked</span>
        </div>
        <div className={`flex items-center gap-1.5 text-caption font-semibold ${(isKycVerified && defaultMethod) ? 'text-success' : 'text-muted-foreground'}`}>
          <CheckCircleIcon className="h-3.5 w-3.5 shrink-0" />
          <span>4. Payout Ready</span>
        </div>
      </div>

      {/* Balance Card */}
      <Card variant="glow" className="flex flex-col gap-2 bg-card">
        <div className="flex items-center justify-between">
          <span className="text-overline text-muted-foreground">Available Earnings</span>
          <span className="text-caption font-medium text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded-full">
            ⚡ 1 USDT ≈ ₦{liveRate.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
          <span className="text-display-xl font-black text-foreground">
            {formatCurrency(availableUsd, 'USD')}
          </span>
          <span className="text-display-sm font-semibold text-brand-emerald">
            ≈ {formatCurrency(availableNgn, 'NGN')}
          </span>
        </div>

        {/* Auto-Cashout Preference Toggle */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary/50 p-3.5 border border-border">
          <div>
            <p className="text-label-md font-semibold text-foreground">Auto-Cashout on Payday</p>
            <p className="text-caption text-muted-foreground">
              {worker?.autoCashoutEnabled
                ? 'Active: Payouts automatically convert & deposit to your bank'
                : 'Inactive: Payouts stay safely in USDT until you cash out'}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleAutoCashout}
            disabled={isUpdatingPreference}
            className={clsx(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              worker?.autoCashoutEnabled ? 'bg-primary' : 'bg-muted',
            )}
            aria-label="Toggle Auto-Cashout"
          >
            <span
              className={clsx(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                worker?.autoCashoutEnabled ? 'translate-x-5' : 'translate-x-0',
              )}
            />
          </button>
        </div>

        <Button
          onClick={() => setWithdrawOpen(true)}
          disabled={availableUsd <= 0}
          className="mt-3 w-full"
        >
          <ArrowDownLeftIcon className="mr-2 h-5 w-5" />
          Cash Out to Bank Account
        </Button>
      </Card>

      {/* KYC Card */}
      <KycSection
        workerId={resolvedParams.workerId}
        isVerified={isKycVerified}
        onSuccess={refetchAll}
      />

      {/* Bank Account Card */}
      <BankSection
        workerId={resolvedParams.workerId}
        workerName={worker?.name}
        payoutMethods={payoutMethods}
        onSuccess={refetchAll}
      />

      <WithdrawModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onSuccess={refetchAll}
        workerId={resolvedParams.workerId}
        defaultMethod={defaultMethod}
      />
    </div>
  );
}

