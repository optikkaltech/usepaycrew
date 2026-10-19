'use client';

import { BanknoteIcon, WalletIcon, ZapIcon, BuildingIcon } from '@/assets';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils';

interface ContractorMetricsGridProps {
  totalEarnedUsd: number;
  settledCount: number;
  availableUsd: number;
  availableNgn: number;
  liveRate: number;
  defaultBankName?: string;
  defaultBankLast4?: string;
}

export function ContractorMetricsGrid({
  totalEarnedUsd,
  settledCount,
  availableUsd,
  availableNgn,
  liveRate,
  defaultBankName = 'No Bank Linked',
  defaultBankLast4,
}: ContractorMetricsGridProps) {
  const earnedNgn = totalEarnedUsd * liveRate;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Earned This Period */}
      <Card variant="elevated" className="p-5 border-border bg-card shadow-xs rounded-2xl flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Earned This Period
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-emerald/10 text-brand-emerald">
            <BanknoteIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-display-xs font-black text-foreground">
            {formatCurrency(earnedNgn, 'NGN')}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-caption text-muted-foreground">
              {settledCount} settled {settledCount === 1 ? 'payment' : 'payments'}
            </span>
            <span className="text-[10px] font-bold text-brand-emerald bg-brand-emerald/10 px-1.5 py-0.5 rounded">
              ▲ Active
            </span>
          </div>
        </div>
      </Card>

      {/* 2. USDT Held */}
      <Card variant="elevated" className="p-5 border-border bg-card shadow-xs rounded-2xl flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            USDT Held
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <WalletIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-display-xs font-black text-foreground">
            {availableUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
          </p>
          <p className="text-caption text-muted-foreground mt-1">
            ≈ {formatCurrency(availableNgn, 'NGN')}
          </p>
        </div>
      </Card>

      {/* 3. Live Rate */}
      <Card variant="elevated" className="p-5 border-border bg-card shadow-xs rounded-2xl flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Live Rate
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
            <ZapIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-display-xs font-black text-foreground">
            {formatCurrency(liveRate, 'NGN')}
          </p>
          <p className="text-caption text-muted-foreground mt-1">
            1 USDT → NGN (Quidax OTC)
          </p>
        </div>
      </Card>

      {/* 4. Default Bank */}
      <Card variant="elevated" className="p-5 border-border bg-card shadow-xs rounded-2xl flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Default Bank
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
            <BuildingIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-display-xs font-black text-foreground truncate">
            {defaultBankName}
          </p>
          <p className="text-caption text-muted-foreground font-mono mt-1">
            {defaultBankLast4 ? `••••${defaultBankLast4}` : 'Pending Setup'}
          </p>
        </div>
      </Card>
    </div>
  );
}
