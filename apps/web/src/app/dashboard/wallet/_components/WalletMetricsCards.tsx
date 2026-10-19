'use client';

import {
  AppStrings,
  ZapIcon,
  CreditCardIcon,
  DownloadIcon,
} from '@/assets';
import { Card } from '@/components/ui/Card';

interface WalletMetricsCardsProps {
  monthlyBurnUsdt: number;
  rateNgn: number;
  pendingDepositsCount?: number;
}

export function WalletMetricsCards({
  monthlyBurnUsdt,
  rateNgn,
  pendingDepositsCount = 0,
}: WalletMetricsCardsProps) {
  const burnNgn = monthlyBurnUsdt * rateNgn;
  const formattedBurnUsdt =
    monthlyBurnUsdt >= 1000
      ? `${(monthlyBurnUsdt / 1000).toFixed(1)}K`
      : monthlyBurnUsdt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formattedBurnNgn =
    burnNgn >= 1_000_000
      ? `≈ ₦${(burnNgn / 1_000_000).toFixed(2)}M`
      : `≈ ₦${burnNgn.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formattedRate = `₦${rateNgn.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <div className="flex flex-col gap-4 h-full justify-between">
      {/* Monthly Burn Card */}
      <Card variant="elevated" className="p-5 border-border flex items-start justify-between">
        <div>
          <span className="text-overline text-muted-foreground font-bold tracking-wider">
            {AppStrings.wallet.monthlyBurn}
          </span>
          <h4 className="text-display-sm font-extrabold text-foreground mt-1">
            {formattedBurnUsdt} <span className="text-body-sm font-bold text-muted-foreground">USDT</span>
          </h4>
          <span className="text-body-xs font-semibold text-muted-foreground mt-0.5 block">
            {formattedBurnNgn}
          </span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning shrink-0">
          <ZapIcon className="h-5 w-5" />
        </div>
      </Card>

      {/* Live Rate Card */}
      <Card variant="elevated" className="p-5 border-border flex items-start justify-between">
        <div>
          <span className="text-overline text-muted-foreground font-bold tracking-wider">
            {AppStrings.wallet.liveRate}
          </span>
          <h4 className="text-display-sm font-extrabold text-foreground mt-1">
            {formattedRate}
          </h4>
          <span className="text-body-xs font-semibold text-muted-foreground mt-0.5 block">
            1 USDT → NGN
          </span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal/15 text-brand-emerald shrink-0">
          <CreditCardIcon className="h-5 w-5" />
        </div>
      </Card>

      {/* Pending Deposits Card */}
      <Card variant="elevated" className="p-5 border-border flex items-start justify-between">
        <div>
          <span className="text-overline text-muted-foreground font-bold tracking-wider">
            {AppStrings.wallet.pendingDeposits}
          </span>
          <h4 className="text-display-sm font-extrabold text-foreground mt-1">
            {pendingDepositsCount}
          </h4>
          <span className="text-body-xs text-muted-foreground mt-0.5 block">
            {AppStrings.wallet.allDepositsConfirmed}
          </span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground shrink-0 border border-border">
          <DownloadIcon className="h-5 w-5" />
        </div>
      </Card>
    </div>
  );
}
