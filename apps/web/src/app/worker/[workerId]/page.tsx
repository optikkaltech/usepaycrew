'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AppStrings,
  ArrowDownLeftIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { formatCurrency } from '@/utils';
import { KycSection } from './_components/KycSection';
import { BankSection } from './_components/BankSection';
import { WithdrawModal } from './_components/WithdrawModal';

export default function WorkerPortalPage({ params }: { params: Promise<{ workerId: string }> }) {
  const resolvedParams = use(params);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

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

  const refetchAll = () => {
    refetchWorker();
    refetchBalance();
    refetchMethods();
  };

  const availableUsd = balanceData?.availableBalance ? parseFloat(balanceData.availableBalance) : 0;
  const availableNgn = availableUsd * 1450;
  const isKycVerified = worker?.status === 'ACTIVE' || worker?.status === 'VERIFIED';
  const defaultMethod = payoutMethods.find((m: any) => m.isDefault);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <span className="text-overline text-brand-sky font-bold">Worker Portal</span>
          <h1 className="text-display-sm text-foreground font-extrabold">{worker?.name || 'Contractor'}</h1>
          <p className="text-caption text-muted-foreground">{worker?.role}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-brand">
          P
        </div>
      </div>

      {/* Balance Card */}
      <Card variant="glow" className="flex flex-col gap-2 bg-card">
        <span className="text-overline text-muted-foreground">Available Earnings</span>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
          <span className="text-display-xl font-black text-foreground">
            {formatCurrency(availableUsd, 'USD')}
          </span>
          <span className="text-display-sm font-semibold text-brand-sky">
            ≈ {formatCurrency(availableNgn, 'NGN')}
          </span>
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
