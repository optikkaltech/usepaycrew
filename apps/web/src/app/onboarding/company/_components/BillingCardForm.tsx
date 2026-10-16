'use client';

import { useState } from 'react';
import { CreditCardIcon, ShieldCheckIcon, ArrowUpRightIcon, RefreshCwIcon } from '@/assets';
import { SubscriptionService } from '@/services';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';

interface BillingCardFormProps {
  amountLabel: string;
  selectedPlan: string;
  onPay: () => void;
  isLoading: boolean;
}

export function BillingCardForm({ amountLabel, selectedPlan, onPay, isLoading }: BillingCardFormProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const toast = useToast();

  const handleCardCheckout = async () => {
    setIsRedirecting(true);
    try {
      const res = await SubscriptionService.initiate({
        currency: 'NGN',
        paymentMethod: 'CARD',
        plan: selectedPlan,
      });

      if (res?.checkoutUrl) {
        toast.success('Redirecting to Secure Checkout...');
        window.location.href = res.checkoutUrl;
      } else {
        onPay();
      }
    } catch (err) {
      setIsRedirecting(false);
      toast.error(normalizeError(err).message || 'Failed to initialize checkout');
    }
  };

  const isProcessing = isLoading || isRedirecting;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/[0.03] p-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-bold text-label-sm">
          <CreditCardIcon className="h-4 w-4" />
          <span>Secure Card Checkout</span>
        </div>
        <span className="text-label-md font-extrabold text-foreground">{amountLabel}</span>
      </div>

      <div className="rounded-xl border border-border bg-card p-3.5 space-y-3">
        <div className="flex items-center justify-between text-caption font-semibold text-muted-foreground border-b border-border/60 pb-2">
          <span>Supported Payment Channels</span>
          <span className="text-[10px] text-brand-emerald font-bold uppercase tracking-wider bg-brand-emerald/10 px-2 py-0.5 rounded">
            Live Gateway
          </span>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-secondary/30 border border-border/40 text-caption">
          <CreditCardIcon className="h-4 w-4 text-primary shrink-0" />
          <span className="text-foreground font-medium text-body-xs">
            Debit / Credit Cards (Mastercard, Visa, Verve)
          </span>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          You will be seamlessly redirected to the secure checkout page to complete your payment with full fraud protection. Your subscription will be activated automatically once the transaction is authorized.
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheckIcon className="h-3.5 w-3.5 text-success shrink-0" />
        <span>PCI-DSS Level 1 Compliant • 256-Bit SSL Encrypted</span>
      </div>

      <button
        type="button"
        disabled={isProcessing}
        onClick={handleCardCheckout}
        className="w-full min-h-[44px] mt-1 bg-primary text-primary-foreground rounded-lg font-bold text-label-sm hover:opacity-90 shadow-brand transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <RefreshCwIcon className="h-4 w-4 animate-spin" />
            <span>Connecting to Secure Checkout...</span>
          </>
        ) : (
          <>
            <span>Proceed to Checkout ({amountLabel})</span>
            <ArrowUpRightIcon className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}
