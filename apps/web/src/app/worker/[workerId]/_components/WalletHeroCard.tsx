'use client';

import clsx from 'clsx';
import { formatCurrency } from '@/utils';

interface WalletHeroCardProps {
  availableUsd: number;
  availableNgn: number;
  autoCashout: boolean;
  defaultBankName?: string;
  isTogglingPreference: boolean;
  onToggleAutoCashout: () => void;
}

export function WalletHeroCard({
  availableUsd,
  availableNgn,
  autoCashout,
  defaultBankName = 'GTBank',
  isTogglingPreference,
  onToggleAutoCashout,
}: WalletHeroCardProps) {
  // Format approximate naira into short form e.g. ₦853.4K or full currency
  const formatCompactNgn = (val: number) => {
    if (val >= 1_000_000) {
      return `≈ ₦${(val / 1_000_000).toFixed(2)}M`;
    }
    if (val >= 1_000) {
      return `≈ ₦${(val / 1_000).toFixed(1)}K`;
    }
    return `≈ ${formatCurrency(val, 'NGN')}`;
  };

  return (
    <div className="bg-card border border-border/80 shadow-xs rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      {/* Left side: Balance display */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-body-xs">
            QD
          </span>
          <span className="text-body-xs sm:text-body-sm font-semibold text-muted-foreground">
            QDASH balance
          </span>
        </div>

        <div className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mt-1">
          {availableUsd.toFixed(2)} QD
        </div>

        <div className="text-body-sm sm:text-body-md font-semibold text-muted-foreground">
          {formatCompactNgn(availableNgn)}
        </div>
      </div>

      {/* Right side: Auto-convert & fee tip boxes */}
      <div className="flex flex-col gap-3 w-full lg:w-80 shrink-0">
        {/* Auto-convert card */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 rounded-2xl p-4 sm:p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-body-xs sm:text-body-sm font-bold text-foreground">
              Auto-convert
            </span>
            <span
              className={clsx(
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                autoCashout
                  ? 'bg-white dark:bg-emerald-900/60 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                  : 'bg-muted border-border text-muted-foreground'
              )}
            >
              <span
                className={clsx(
                  'h-1.5 w-1.5 rounded-full',
                  autoCashout ? 'bg-emerald-500' : 'bg-muted-foreground'
                )}
              />
              {autoCashout ? 'On' : 'Off'}
            </span>
          </div>

          <p className="text-caption text-muted-foreground leading-relaxed">
            Incoming QDASH is auto-converted to NGN and sent to {defaultBankName}.
          </p>

          <button
            type="button"
            disabled={isTogglingPreference}
            onClick={onToggleAutoCashout}
            className="text-left text-body-xs font-bold text-[#008774] dark:text-emerald-400 hover:underline cursor-pointer pt-1"
          >
            {isTogglingPreference ? 'Updating...' : 'Change preference'}
          </button>
        </div>

        {/* Tip pill */}
        <div className="bg-secondary/40 rounded-2xl p-3.5 flex items-center gap-2.5 text-caption text-muted-foreground border border-border/40">
          <span className="text-base select-none shrink-0">💡</span>
          <span>Holding saves on fees — convert when the rate is favorable.</span>
        </div>
      </div>
    </div>
  );
}
