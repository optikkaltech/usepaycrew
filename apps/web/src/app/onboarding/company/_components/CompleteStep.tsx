'use client';

import { AppStrings, CheckCircleIcon, BuildingIcon, WalletIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface CompleteStepProps {
  company: any;
  onGoToDashboard: () => void;
}

export function CompleteStep({ company, onGoToDashboard }: CompleteStepProps) {
  return (
    <Card variant="elevated" className="flex flex-col gap-5 border-border text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
        <CheckCircleIcon className="h-8 w-8" />
      </div>

      <div>
        <h2 className="text-display-sm text-foreground">{AppStrings.onboarding.stepComplete}</h2>
        <p className="mt-1 text-body-xs text-muted-foreground">
          {company?.name || 'Your company'} is fully verified and ready for automated payroll disbursements.
        </p>
      </div>

      <div className="flex flex-col gap-3 text-left">
        <div className="rounded-xl border border-border bg-secondary/50 p-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <BuildingIcon className="h-4 w-4" />
            <span className="text-label-md font-bold">Korapay Dedicated Virtual Account</span>
          </div>
          <p className="text-body-xs text-muted-foreground">Settlement Bank: {company?.virtualAccountBank || 'Providus Bank (Korapay)'}</p>
          <p className="text-display-sm font-extrabold text-primary mt-1">
            {company?.virtualAccountNumber || '0129481920'}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-secondary/50 p-4">
          <div className="flex items-center gap-2 text-brand-emerald mb-1">
            <WalletIcon className="h-4 w-4" />
            <span className="text-label-md font-bold">Multi-Chain Stablecoin Deposit</span>
          </div>
          <p className="text-body-xs text-muted-foreground">Supports TRON, Polygon, Base, Ethereum &amp; Solana</p>
          <p className="text-label-sm font-mono truncate text-foreground mt-1">
            {company?.depositWalletAddress || '0x4982...c7'}
          </p>
        </div>
      </div>

      <Button onClick={onGoToDashboard} className="w-full min-h-[44px]">
        Launch Company Dashboard
      </Button>
    </Card>
  );
}
