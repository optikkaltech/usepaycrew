'use client';

import { useState } from 'react';
import { AppStrings, CreditCardIcon, CheckCircleIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface BillingStepProps {
  onSubmit: (plan: string, method: 'KORAPAY' | 'CRYPTO') => Promise<void>;
  isLoading: boolean;
}

export function BillingStep({ onSubmit, isLoading }: BillingStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<'KORAPAY' | 'CRYPTO'>('KORAPAY');

  return (
    <Card variant="elevated" className="flex flex-col gap-5 border-border">
      <div className="flex items-center gap-2.5 text-primary">
        <CreditCardIcon className="h-6 w-6" />
        <div>
          <h2 className="text-display-sm text-foreground">{AppStrings.onboarding.stepBilling}</h2>
          <p className="mt-0.5 text-body-xs text-muted-foreground">
            Activate your organization subscription to start disbursing stablecoins
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-primary bg-primary/5 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-label-lg font-bold text-foreground">PayCrew Starter Plan</span>
          <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-caption font-bold">
            Recommended
          </span>
        </div>
        <p className="text-display-sm font-extrabold text-foreground">
          ₦15,000 <span className="text-body-sm font-normal text-muted-foreground">/ $10 USD per month</span>
        </p>
        <p className="text-body-xs text-muted-foreground">
          Includes 10 active contractor seats, unlimited payroll runs, and auto-settlement.
        </p>
        <p className="text-caption text-brand-emerald font-semibold">
          {AppStrings.subscriptions.extraWorkerRate}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-label-md text-foreground">Payment Method</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelectedMethod('KORAPAY')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left min-h-[44px] transition-all ${
              selectedMethod === 'KORAPAY'
                ? 'border-primary bg-primary/10 font-bold'
                : 'border-border bg-card'
            }`}
          >
            <CheckCircleIcon className={`h-5 w-5 ${selectedMethod === 'KORAPAY' ? 'text-primary' : 'text-muted'}`} />
            <div>
              <p className="text-label-md text-foreground">Korapay Bank Transfer</p>
              <p className="text-caption text-muted-foreground">Dedicated Naira NUBAN</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('CRYPTO')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left min-h-[44px] transition-all ${
              selectedMethod === 'CRYPTO'
                ? 'border-primary bg-primary/10 font-bold'
                : 'border-border bg-card'
            }`}
          >
            <CheckCircleIcon className={`h-5 w-5 ${selectedMethod === 'CRYPTO' ? 'text-primary' : 'text-muted'}`} />
            <div>
              <p className="text-label-md text-foreground">USDT / USDC</p>
              <p className="text-caption text-muted-foreground">Polygon / Base / TRON</p>
            </div>
          </button>
        </div>
      </div>

      <Button
        type="button"
        onClick={() => onSubmit('STARTER', selectedMethod)}
        isLoading={isLoading}
        className="mt-2 w-full min-h-[44px]"
      >
        {AppStrings.onboarding.activatePlan}
      </Button>
    </Card>
  );
}
