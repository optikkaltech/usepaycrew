'use client';

import Link from 'next/link';
import {
  AppStrings,
  PlusIcon,
  ArrowUpRightIcon,
  UserPlusIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';

interface DashboardOverviewHeaderProps {
  onOpenFunding: () => void;
}

export function DashboardOverviewHeader({ onOpenFunding }: DashboardOverviewHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-display-xs text-foreground font-bold tracking-tight">
            {AppStrings.navigation.dashboard}
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-caption font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live OTC Rails
          </span>
        </div>
        <p className="mt-0.5 text-body-xs text-muted-foreground">
          Stablecoin Treasury & Global Contractor Payroll Operations
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          onClick={onOpenFunding}
          className="flex-1 sm:flex-none min-h-[40px] px-4 font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all rounded-lg shadow-sm"
        >
          <PlusIcon className="mr-1.5 h-3.5 w-3.5" />
          {AppStrings.dashboard.fundAccount}
        </Button>

        <Link href="/dashboard/payroll" className="flex-1 sm:flex-none">
          <Button
            variant="secondary"
            className="w-full min-h-[40px] px-4 border border-border bg-card text-foreground hover:bg-secondary font-medium transition-colors rounded-lg"
          >
            <ArrowUpRightIcon className="mr-1.5 h-3.5 w-3.5" />
            {AppStrings.dashboard.payWorker}
          </Button>
        </Link>

        <Link href="/dashboard/workers" className="hidden md:inline-flex">
          <Button
            variant="secondary"
            className="min-h-[40px] px-3.5 border border-border bg-card text-foreground hover:bg-secondary font-medium transition-colors rounded-lg"
          >
            <UserPlusIcon className="mr-1.5 h-3.5 w-3.5" />
            Add Contractor
          </Button>
        </Link>
      </div>
    </div>
  );
}
