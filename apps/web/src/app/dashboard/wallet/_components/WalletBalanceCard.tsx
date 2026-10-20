'use client';

import clsx from 'clsx';
import {
  AppStrings,
  DownloadIcon,
  ArrowUpRightIcon,
} from '@/assets';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { usePrivacyStore } from '@/store';

interface WalletBalanceCardProps {
  balanceUsdt: number;
  rateNgn: number;
  runwayMonths: number;
  onDepositClick: () => void;
  onWithdrawClick: () => void;
}

export function WalletBalanceCard({
  balanceUsdt,
  rateNgn,
  runwayMonths,
  onDepositClick,
  onWithdrawClick,
}: WalletBalanceCardProps) {
  const { isPrivacyMode } = usePrivacyStore();

  const balanceNgn = balanceUsdt * rateNgn;
  const formattedUsdt = balanceUsdt.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedNgn =
    balanceNgn >= 1_000_000
      ? `₦${(balanceNgn / 1_000_000).toFixed(2)}M`
      : `₦${balanceNgn.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const isFunded = balanceUsdt > 0;

  return (
    <Card variant="elevated" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 sm:p-8 border-border">
      <div className="flex flex-col gap-3">
        <span className="text-body-xs font-medium text-muted-foreground">
          {AppStrings.wallet.availableBalance}
        </span>

        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className={clsx(
            'text-display-lg sm:text-display-xl font-extrabold text-foreground tracking-tight',
            isPrivacyMode && 'select-none blur-md transition-all'
          )}>
            {formattedUsdt} <span className="text-display-sm text-brand-emerald">USDT</span>
          </h2>
          <span className={clsx(
            'text-body-md text-muted-foreground font-semibold',
            isPrivacyMode && 'select-none blur-sm transition-all'
          )}>
            ≈ {formattedNgn}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant={isFunded ? 'success' : 'warning'} withDot>
            {isFunded ? AppStrings.wallet.funded : AppStrings.wallet.unfunded}
          </Badge>
          <span className="text-body-xs font-medium text-muted-foreground px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border">
            {isFunded
              ? `Runway ≈ ${runwayMonths >= 1 ? `${runwayMonths.toFixed(1)} months` : `${Math.max(1, Math.round(runwayMonths * 30))} days`}`
              : 'Runway: 0 days'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={onDepositClick}
          className="min-h-[44px] px-5 bg-[#0b3d2e] hover:bg-[#0b3d2e]/90 text-white dark:bg-brand-emerald dark:hover:bg-brand-emerald/90 dark:text-black font-bold shadow-md dark:shadow-brand"
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          {AppStrings.wallet.depositUsdt}
        </Button>
        <Button
          variant="outline"
          onClick={onWithdrawClick}
          className="min-h-[44px] px-5"
        >
          <ArrowUpRightIcon className="mr-2 h-4 w-4" />
          {AppStrings.wallet.withdraw}
        </Button>
      </div>
    </Card>
  );
}
