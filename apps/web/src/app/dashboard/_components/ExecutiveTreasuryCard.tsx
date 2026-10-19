'use client';

import { Card } from '@/components/ui/Card';
import { AppStrings, WalletIcon, ArrowUpRightIcon, ShieldCheckIcon } from '@/assets';
import { formatCurrency } from '@/utils';

interface ExecutiveTreasuryCardProps {
  availableUsd: number;
  availableNgn: number;
  marketRate: number;
  onOpenFunding: () => void;
}

export function ExecutiveTreasuryCard({
  availableUsd,
  availableNgn,
  marketRate,
  onOpenFunding,
}: ExecutiveTreasuryCardProps) {
  return (
    <Card
      variant="elevated"
      className="relative overflow-hidden bg-card/90 backdrop-blur-md p-5 sm:p-6 shadow-sm"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-[160px] w-[240px] rounded-full bg-brand-emerald/[0.07] dark:bg-brand-emerald/[0.12] blur-[50px]" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Top Meta Line */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-overline text-muted-foreground font-semibold">
              {AppStrings.dashboard.balanceTitle}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-caption font-medium text-muted-foreground">
              <ShieldCheckIcon className="h-3 w-3 text-emerald-400" />
              1:1 Treasury Backed
            </span>
          </div>

          <div className="flex items-center gap-2 text-caption text-muted-foreground">
            <span>OTC Rate:</span>
            <span className="font-semibold text-foreground">
              1 USDT ≈ ₦{marketRate.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Balance Display */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-display-md font-extrabold text-foreground tracking-tight">
              {formatCurrency(availableUsd, 'USD')}
            </span>
            <span className="text-body-sm font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg">
              ≈ {formatCurrency(availableNgn, 'NGN')}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenFunding}
            className="inline-flex items-center gap-1.5 text-label-sm font-medium text-foreground hover:text-muted-foreground transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Deposit Treasury Liquidity</span>
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Rail Badges & Status */}
        <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-caption text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">Active Corridors:</span>
            <span className="rounded-md bg-secondary px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              USDT (TRC-20 / BEP-20)
            </span>
            <span className="rounded-md bg-secondary px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              USDC (Base / Polygon)
            </span>
            <span className="rounded-md bg-secondary px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              Local Bank Off-Ramp (Instant)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <WalletIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Dedicated Multi-Chain Addresses</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
