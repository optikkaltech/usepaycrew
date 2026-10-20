'use client';

import { usePrivacyStore } from '@/store';
import { formatCurrency } from '@/utils';

interface EarningsMetricsRowProps {
  totalUsd: number;
  totalNgn: number;
  count: number;
}

export function EarningsMetricsRow({ totalUsd, totalNgn, count }: EarningsMetricsRowProps) {
  const { isPrivacyMode } = usePrivacyStore();
  const avgNgn = count > 0 ? totalNgn / count : 0;

  const formatCompactNgn = (val: number) => {
    if (val === 0) return '₦0.00';
    if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `₦${(val / 1_000).toFixed(1)}K`;
    return formatCurrency(val, 'NGN');
  };

  const formatCompactUsd = (val: number) => {
    if (val === 0) return '$0.00';
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
  };

  const displayTotalNgn = isPrivacyMode ? '••••••' : formatCompactNgn(totalNgn);
  const displayTotalUsd = isPrivacyMode ? '••••••' : formatCompactUsd(totalUsd);
  const displayAvgNgn = isPrivacyMode ? '••••••' : formatCompactNgn(avgNgn);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {/* Total earned (NGN) */}
      <div className="bg-card border border-border/80 shadow-xs rounded-2xl p-5 sm:p-6 flex flex-col gap-1.5">
        <span className="text-body-xs font-semibold text-muted-foreground">
          Total earned (NGN)
        </span>
        <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {displayTotalNgn}
        </span>
      </div>

      {/* Total received (USDT) */}
      <div className="bg-card border border-border/80 shadow-xs rounded-2xl p-5 sm:p-6 flex flex-col gap-1.5">
        <span className="text-body-xs font-semibold text-muted-foreground">
          Total received (USDT)
        </span>
        <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {displayTotalUsd}
        </span>
      </div>

      {/* Avg. per payment */}
      <div className="bg-card border border-border/80 shadow-xs rounded-2xl p-5 sm:p-6 flex flex-col gap-1.5">
        <span className="text-body-xs font-semibold text-muted-foreground">
          Avg. per payment
        </span>
        <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {displayAvgNgn}
        </span>
      </div>
    </div>
  );
}
