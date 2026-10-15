'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  AppStrings,
  WalletIcon,
  UsersIcon,
  CreditCardIcon,
  PlusIcon,
  ArrowUpRightIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { formatCurrency } from '@/utils';
import { FundingModal } from './_components/FundingModal';

export default function DashboardPage() {
  const [fundingOpen, setFundingOpen] = useState(false);

  const { data: balanceData } = useQuery({
    queryKey: ['companyBalance'],
    queryFn: () => http.get('/ledger/company-balance?currency=USD'),
  });

  const { data: fundingInfo } = useQuery({
    queryKey: ['fundingInfo'],
    queryFn: () => http.get('/companies/funding-info'),
  });

  const { data: workers = [] } = useQuery({
    queryKey: ['workers'],
    queryFn: () => http.get('/workers'),
  });

  const availableUsd = balanceData?.availableBalance ? parseFloat(balanceData.availableBalance) : 0;
  const availableNgn = availableUsd * 1450;

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Top Banner & Balance */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-md text-foreground font-extrabold">{AppStrings.navigation.dashboard}</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">{AppStrings.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setFundingOpen(true)} className="flex-1 sm:flex-none">
            <PlusIcon className="mr-2 h-4 w-4" />
            {AppStrings.dashboard.fundAccount}
          </Button>
          <Link href="/dashboard/payroll" className="flex-1 sm:flex-none">
            <Button variant="secondary" className="w-full">
              <ArrowUpRightIcon className="mr-2 h-4 w-4" />
              {AppStrings.dashboard.payWorker}
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Balance Card with Specular Backlight */}
      <Card variant="elevated" className="relative overflow-hidden bg-card/90 backdrop-blur-md border border-border shadow-sm">
        <div className="pointer-events-none absolute -right-10 -top-10 h-[180px] w-[260px] rounded-full bg-brand-emerald/[0.08] dark:bg-brand-emerald/[0.14] blur-[60px]" />
        <div className="flex flex-col gap-2 relative z-10">
          <span className="text-overline text-muted-foreground">{AppStrings.dashboard.balanceTitle}</span>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
            <span className="text-display-xl font-extrabold text-foreground">
              {formatCurrency(availableUsd, 'USD')}
            </span>
            <span className="text-display-sm font-semibold text-brand-emerald">
              ≈ {formatCurrency(availableNgn, 'NGN')}
            </span>
          </div>
          <p className="mt-2 text-caption text-muted-foreground">
            Backed 1:1 by USDC/USDT treasury reserves and licensed settlement partners
          </p>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4 bg-card/80 border-border hover:border-primary/40 transition-all shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UsersIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-caption text-muted-foreground">{AppStrings.dashboard.activeWorkers}</p>
            <p className="text-display-sm font-bold text-foreground">{workers.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-card/80 border-border hover:border-primary/40 transition-all shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
            <CreditCardIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-caption text-muted-foreground">{AppStrings.dashboard.pendingPayouts}</p>
            <p className="text-display-sm font-bold text-foreground">0</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-card/80 border-border hover:border-primary/40 transition-all shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-emerald/10 text-brand-emerald">
            <WalletIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-caption text-muted-foreground">{AppStrings.dashboard.totalDisbursed}</p>
            <p className="text-display-sm font-bold text-foreground">$0.00</p>
          </div>
        </Card>
      </div>

      <FundingModal
        isOpen={fundingOpen}
        onClose={() => setFundingOpen(false)}
        fundingInfo={fundingInfo}
      />
    </div>
  );
}
