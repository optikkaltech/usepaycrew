'use client';

import clsx from 'clsx';
import { TrendingUpIcon, DownloadIcon, BuildingIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils';
import { usePrivacyStore } from '@/store';

interface ContractorHeroCardProps {
  availableUsd: number;
  availableNgn: number;
  autoCashout: boolean;
  defaultBankName?: string;
  defaultBankLast4?: string;
  onConvert: () => void;
  onWithdraw: () => void;
  onToggleAutoCashout: () => void;
  isTogglingPreference?: boolean;
}

export function ContractorHeroCard({
  availableUsd,
  availableNgn,
  autoCashout,
  defaultBankName,
  defaultBankLast4,
  onConvert,
  onWithdraw,
  onToggleAutoCashout,
  isTogglingPreference = false,
}: ContractorHeroCardProps) {
  const { isPrivacyMode } = usePrivacyStore();
  return (
    <Card
      variant="elevated"
      className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-7 border-border bg-card shadow-sm rounded-2xl"
    >
      {/* Balance Details */}
      <div className="flex flex-col gap-3">
        <span className="text-body-xs font-semibold text-muted-foreground tracking-wide">
          USDT balance
        </span>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3">
          <span className="text-display-md sm:text-display-lg font-black text-foreground tracking-tight">
            {isPrivacyMode ? '••••••' : `${availableUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`}
          </span>
          <span className="text-body-md font-semibold text-muted-foreground">
            ≈ {isPrivacyMode ? '••••••' : formatCurrency(availableNgn, 'NGN')}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onToggleAutoCashout}
            disabled={isTogglingPreference}
            className={clsx(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-semibold border transition-all cursor-pointer min-h-[32px]',
              autoCashout
                ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30 hover:bg-brand-emerald/20'
                : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted/70'
            )}
            title="Click to toggle automatic payout conversion"
          >
            <span
              className={clsx(
                'h-1.5 w-1.5 rounded-full',
                autoCashout ? 'bg-brand-emerald animate-pulse' : 'bg-muted-foreground'
              )}
            />
            <span>{autoCashout ? 'Auto-convert on' : 'Auto-convert off'}</span>
          </button>

          {defaultBankName && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-semibold bg-secondary/60 text-foreground border border-border min-h-[32px]">
              <span className="text-muted-foreground">→</span>
              <BuildingIcon className="h-3 w-3 text-muted-foreground" />
              <span>{defaultBankName}</span>
              {defaultBankLast4 && <span className="text-muted-foreground font-mono">••••{defaultBankLast4}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
        <Button
          onClick={onConvert}
          className="bg-[#0b3d2e] hover:bg-[#0b3d2e]/90 text-white dark:bg-brand-emerald dark:hover:bg-brand-emerald/90 dark:text-black font-bold shadow-sm min-h-[44px] px-5"
        >
          <TrendingUpIcon className="mr-2 h-4 w-4 text-white dark:text-black" />
          Convert to Naira
        </Button>

        <Button
          variant="outline"
          onClick={onWithdraw}
          className="border-border text-foreground hover:bg-secondary min-h-[44px] px-5 font-semibold"
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          Withdraw
        </Button>
      </div>
    </Card>
  );
}
