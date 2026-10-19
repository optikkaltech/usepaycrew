'use client';

import { ContractorHeroCard } from './ContractorHeroCard';
import { ContractorMetricsGrid } from './ContractorMetricsGrid';
import { EarningsTrendCard } from './EarningsTrendCard';
import { QuickConvertCard } from './QuickConvertCard';

interface ContractorOverviewTabProps {
  availableUsd: number;
  availableNgn: number;
  autoCashout: boolean;
  defaultBankName?: string;
  defaultBankLast4?: string;
  totalEarnedUsd: number;
  settledCount: number;
  liveRate: number;
  payments: any[];
  isTogglingPreference: boolean;
  onConvert: () => void;
  onWithdraw: () => void;
  onToggleAutoCashout: () => void;
  onViewAllEarnings: () => void;
}

export function ContractorOverviewTab({
  availableUsd,
  availableNgn,
  autoCashout,
  defaultBankName,
  defaultBankLast4,
  totalEarnedUsd,
  settledCount,
  liveRate,
  payments,
  isTogglingPreference,
  onConvert,
  onWithdraw,
  onToggleAutoCashout,
  onViewAllEarnings,
}: ContractorOverviewTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <ContractorHeroCard
        availableUsd={availableUsd}
        availableNgn={availableNgn}
        autoCashout={autoCashout}
        defaultBankName={defaultBankName}
        defaultBankLast4={defaultBankLast4}
        onConvert={onConvert}
        onWithdraw={onWithdraw}
        onToggleAutoCashout={onToggleAutoCashout}
        isTogglingPreference={isTogglingPreference}
      />

      <ContractorMetricsGrid
        totalEarnedUsd={totalEarnedUsd}
        settledCount={settledCount}
        availableUsd={availableUsd}
        availableNgn={availableNgn}
        liveRate={liveRate}
        defaultBankName={defaultBankName}
        defaultBankLast4={defaultBankLast4}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EarningsTrendCard
          payments={payments}
          liveRate={liveRate}
          onViewAll={onViewAllEarnings}
        />
        <QuickConvertCard
          availableUsd={availableUsd}
          liveRate={liveRate}
          defaultBankName={defaultBankName}
          defaultBankLast4={defaultBankLast4}
          onInitiateConvert={onConvert}
        />
      </div>
    </div>
  );
}
