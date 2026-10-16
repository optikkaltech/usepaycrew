'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/services';
import { FundingModal } from './_components/FundingModal';
import { DashboardOverviewHeader } from './_components/DashboardOverviewHeader';
import { ExecutiveTreasuryCard } from './_components/ExecutiveTreasuryCard';
import { DashboardMetricsGrid } from './_components/DashboardMetricsGrid';
import { RecentDisbursementsCard } from './_components/RecentDisbursementsCard';
import { CorridorsRatesWidget } from './_components/CorridorsRatesWidget';
import { ContractorSnapshotWidget } from './_components/ContractorSnapshotWidget';
import { DashboardPaymentItem, DashboardWorkerItem } from './_components/dashboard.types';

export default function DashboardPage() {
  const [fundingOpen, setFundingOpen] = useState(false);

  const { data: balanceData } = useQuery({
    queryKey: ['companyBalance'],
    queryFn: () => http.get<{ availableBalance?: string }>('/ledger/company-balance?currency=USD'),
  });

  const { data: rateData } = useQuery({
    queryKey: ['marketRate'],
    queryFn: () => http.get<{ data?: { rate?: number }; rate?: number }>('/payments/rate?pair=USDT_NGN'),
  });

  const { data: workers = [] } = useQuery<DashboardWorkerItem[]>({
    queryKey: ['workers'],
    queryFn: () => http.get('/workers'),
  });

  const { data: payments = [] } = useQuery<DashboardPaymentItem[]>({
    queryKey: ['payments'],
    queryFn: () => http.get('/payments'),
  });

  const availableUsd = balanceData?.availableBalance ? parseFloat(balanceData.availableBalance) : 0;
  const rateNumber = rateData?.data?.rate || rateData?.rate || 1585;
  const availableNgn = availableUsd * rateNumber;

  const pendingPayoutsCount = payments.filter((p) => p.status === 'PENDING').length;
  const totalDisbursedUsd = payments
    .filter((p) => p.status === 'COMPLETED' || p.status === 'PAID')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full">
      {/* Top Header with Actions */}
      <DashboardOverviewHeader onOpenFunding={() => setFundingOpen(true)} />

      {/* Scaled & Refined Treasury Balance Card */}
      <ExecutiveTreasuryCard
        availableUsd={availableUsd}
        availableNgn={availableNgn}
        marketRate={rateNumber}
        onOpenFunding={() => setFundingOpen(true)}
      />

      {/* 4 Focused Proportional Metrics */}
      <DashboardMetricsGrid
        workersCount={workers.length}
        pendingPayoutsCount={pendingPayoutsCount}
        totalDisbursedUsd={totalDisbursedUsd}
      />

      {/* Core Operational Details & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: Recent Settlements / Payroll Pipeline */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
          <RecentDisbursementsCard
            payments={payments}
            onOpenFunding={() => setFundingOpen(true)}
          />
        </div>

        {/* Right Column: Corridors & Contractor Snapshot */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
          <CorridorsRatesWidget marketRate={rateNumber} />
          <ContractorSnapshotWidget workers={workers} />
        </div>
      </div>

      <FundingModal
        isOpen={fundingOpen}
        onClose={() => setFundingOpen(false)}
      />
    </div>
  );
}
