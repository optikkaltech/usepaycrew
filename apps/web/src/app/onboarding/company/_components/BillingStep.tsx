'use client';

import { useState } from 'react';
import { CreditCardIcon, CheckCircleIcon, WalletIcon } from '@/assets';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BillingPlanSelector } from './BillingPlanSelector';
import { BillingCardForm } from './BillingCardForm';
import { BillingCryptoTransfer } from './BillingCryptoTransfer';

interface BillingStepProps {
  onSubmit: (plan: string, method: 'CARD' | 'CRYPTO' | 'FREE') => Promise<void>;
  isLoading: boolean;
}

export function BillingStep({ onSubmit, isLoading }: BillingStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<'FREE' | 'STARTER' | 'GROWTH' | 'ENTERPRISE'>('FREE');
  const [selectedMethod, setSelectedMethod] = useState<'CARD' | 'CRYPTO'>('CARD');

  const planAmountUsd = selectedPlan === 'GROWTH' ? 30 : selectedPlan === 'STARTER' ? 10 : 0;
  const planAmountNgn = selectedPlan === 'GROWTH' ? '₦45,000' : selectedPlan === 'STARTER' ? '₦15,000' : '₦0';

  const handleFreeActivation = () => {
    onSubmit('FREE', 'FREE');
  };

  const handlePaidActivation = () => {
    onSubmit(selectedPlan, selectedMethod);
  };

  return (
    <Card variant="elevated" className="flex flex-col gap-5 border-border">
      <div className="flex items-center gap-2.5 text-primary">
        <CreditCardIcon className="h-5 w-5" />
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">Subscription Billing</h2>
          <p className="mt-0.5 text-body-xs text-muted-foreground">
            Activate your organization subscription to start disbursing stablecoins
          </p>
        </div>
      </div>

      {/* 1. Plans List (Including Free) */}
      <BillingPlanSelector selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />

      {/* 2. Free Plan Instant Activation */}
      {selectedPlan === 'FREE' ? (
        <div className="flex flex-col gap-3 rounded-xl border border-success/30 bg-success/5 p-4 text-left">
          <div className="flex items-center gap-2 text-success font-bold text-label-sm">
            <CheckCircleIcon className="h-4 w-4" />
            <span>Free Forever Plan Selected</span>
          </div>
          <p className="text-body-xs text-muted-foreground leading-relaxed">
            No credit card or crypto deposit required. You can disburse payroll on-demand and upgrade anytime as your team grows.
          </p>
          <Button
            type="button"
            onClick={handleFreeActivation}
            isLoading={isLoading}
            className="w-full min-h-[44px] bg-primary text-primary-foreground font-bold"
          >
            Activate Free Plan &amp; Launch Dashboard
          </Button>
        </div>
      ) : (
        /* 3. Paid Plan Payment Method Selector */
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-label-sm font-semibold text-foreground">Select Payment Method</label>
            <span className="text-caption font-bold text-primary">
              {planAmountNgn} (${planAmountUsd} USD) / month
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedMethod('CARD')}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left min-h-[44px] transition-all cursor-pointer ${
                selectedMethod === 'CARD'
                  ? 'border-primary bg-primary/10 font-bold shadow-xs'
                  : 'border-border bg-card hover:border-muted-foreground/30'
              }`}
            >
              <CreditCardIcon className={`h-4 w-4 shrink-0 ${selectedMethod === 'CARD' ? 'text-primary' : 'text-muted'}`} />
              <div>
                <p className="text-label-sm text-foreground leading-none">Debit / Credit Card</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Instant Card Payment</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('CRYPTO')}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left min-h-[44px] transition-all cursor-pointer ${
                selectedMethod === 'CRYPTO'
                  ? 'border-primary bg-primary/10 font-bold shadow-xs'
                  : 'border-border bg-card hover:border-muted-foreground/30'
              }`}
            >
              <WalletIcon className={`h-4 w-4 shrink-0 ${selectedMethod === 'CRYPTO' ? 'text-primary' : 'text-muted'}`} />
              <div>
                <p className="text-label-sm text-foreground leading-none">USDT / USDC</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Dedicated Quidax Deposit</p>
              </div>
            </button>
          </div>

          {/* Payment Method Details */}
          {selectedMethod === 'CARD' ? (
            <BillingCardForm
              amountLabel={`${planAmountNgn} ($${planAmountUsd} USD)`}
              onPay={handlePaidActivation}
              isLoading={isLoading}
            />
          ) : (
            <BillingCryptoTransfer
              amountUsd={planAmountUsd}
              planId={selectedPlan}
              onConfirm={handlePaidActivation}
              isLoading={isLoading}
            />
          )}
        </div>
      )}
    </Card>
  );
}
