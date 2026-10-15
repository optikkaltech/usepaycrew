'use client';

import { useState } from 'react';
import { CreditCardIcon, ShieldCheckIcon } from '@/assets';

interface BillingCardFormProps {
  amountLabel: string;
  onPay: () => void;
  isLoading: boolean;
}

export function BillingCardForm({ amountLabel, onPay, isLoading }: BillingCardFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholder, setCardholder] = useState('');

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 16);
    return clean.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length >= 2) return `${clean.substring(0, 2)}/${clean.substring(2)}`;
    return clean;
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-bold text-label-sm">
          <CreditCardIcon className="h-4 w-4" />
          <span>Pay Directly with Debit / Credit Card</span>
        </div>
        <span className="text-label-md font-extrabold text-foreground">{amountLabel}</span>
      </div>

      <div className="space-y-2.5">
        <div>
          <label className="block text-caption font-semibold text-muted-foreground mb-1">Card Number</label>
          <input
            type="text"
            placeholder="4242 •••• •••• 4242"
            value={cardNumber}
            maxLength={19}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className="w-full h-10 px-3 text-body-xs font-mono bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-caption font-semibold text-muted-foreground mb-1">Expires (MM/YY)</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              maxLength={5}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              className="w-full h-10 px-3 text-body-xs font-mono bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-caption font-semibold text-muted-foreground mb-1">CVC</label>
            <input
              type="password"
              placeholder="•••"
              value={cvc}
              maxLength={4}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
              className="w-full h-10 px-3 text-body-xs font-mono bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-caption font-semibold text-muted-foreground mb-1">Cardholder Name</label>
          <input
            type="text"
            placeholder="Jane Doe"
            value={cardholder}
            onChange={(e) => setCardholder(e.target.value)}
            className="w-full h-10 px-3 text-body-xs bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
        <ShieldCheckIcon className="h-3.5 w-3.5 text-success shrink-0" />
        <span>PCI-DSS Compliant 256-Bit SSL Encrypted Checkout</span>
      </div>

      <button
        type="button"
        disabled={isLoading || cardNumber.length < 15}
        onClick={onPay}
        className="w-full min-h-[44px] mt-1 bg-primary text-primary-foreground rounded-lg font-bold text-label-sm hover:opacity-90 shadow-brand transition disabled:opacity-50 cursor-pointer flex items-center justify-center"
      >
        {isLoading ? 'Processing Card Payment...' : `Pay ${amountLabel} & Activate`}
      </button>
    </div>
  );
}
