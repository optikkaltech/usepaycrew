'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/services';
import { FundingModal } from './_components/FundingModal';
import { ActivePayrollDisbursement } from './_components/ActivePayrollDisbursement';
import { TreasuryFlowChart } from './_components/TreasuryFlowChart';
import { RecentDisbursementsCard } from './_components/RecentDisbursementsCard';
import { DashboardPaymentItem, DashboardWorkerItem } from './_components/dashboard.types';

export default function DashboardPage() {
  const [fundingOpen, setFundingOpen] = useState(false);

  const { data: balanceData, refetch: refetchBalance } = useQuery({
    queryKey: ['companyBalance'],
    queryFn: () => http.get<{ availableBalance?: string }>('/ledger/company-balance?currency=USD'),
  });

  const { data: rateData, refetch: refetchRate } = useQuery({
    queryKey: ['marketRate'],
    queryFn: () => http.get<{ data?: { rate?: number }; rate?: number }>('/payments/rate?pair=USDT_NGN'),
  });

  const { data: workers = [] } = useQuery<DashboardWorkerItem[]>({
    queryKey: ['workers'],
    queryFn: () => http.get('/workers'),
  });

  const { data: payments = [], refetch: refetchPayments } = useQuery<DashboardPaymentItem[]>({
    queryKey: ['payments'],
    queryFn: () => http.get('/payments'),
  });

  const availableUsd = balanceData?.availableBalance ? parseFloat(balanceData.availableBalance) : 0;
  const rateNumber = rateData?.data?.rate || rateData?.rate || 1585;
  const availableNgn = availableUsd * rateNumber;

  const totalDisbursedUsd = payments
    .filter((p) => p.status === 'COMPLETED' || p.status === 'PAID')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const handleRefresh = () => {
    refetchBalance();
    refetchRate();
    refetchPayments();
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full max-w-7xl mx-auto">
      {/* 1. Active Payroll Disbursement (4 Department Cards) */}
      <ActivePayrollDisbursement totalDisbursedUsd={totalDisbursedUsd} />

      {/* 2. Treasury & Payroll Flow (Dual Wave Flow Chart) */}
      <TreasuryFlowChart
        availableUsd={availableUsd}
        availableNgn={availableNgn}
        onRefresh={handleRefresh}
        onOpenFunding={() => setFundingOpen(true)}
      />

      {/* 3. Recent Disbursements Feed */}
      <div className="mt-2">
        <RecentDisbursementsCard
          payments={payments}
          onOpenFunding={() => setFundingOpen(true)}
        />
      </div>

      {/* Funding Modal */}
      <FundingModal
        isOpen={fundingOpen}
        onClose={() => setFundingOpen(false)}
      />
    </div>
  );
}
