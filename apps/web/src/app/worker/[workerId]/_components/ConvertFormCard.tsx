'use client';

import { useState } from 'react';
import { ArrowDownIcon, ChevronDownIcon, TrendingUpIcon } from '@/assets';
import { formatCurrency } from '@/utils';

interface ConvertFormCardProps {
  availableUsd: number;
  liveRate: number;
  payoutMethods: any[];
  workerName?: string;
  onReviewConversion: (amountUsd: number, methodId?: string) => void;
}

export function ConvertFormCard({
  availableUsd,
  liveRate,
  payoutMethods = [],
  workerName = 'Adaeze Okonkwo',
  onReviewConversion,
}: ConvertFormCardProps) {
  const [amountStr, setAmountStr] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    payoutMethods.find((m) => m.isDefault)?.id || payoutMethods[0]?.id || ''
  );

  const parsedAmount = parseFloat(amountStr) || 0;
  const grossNgn = parsedAmount * liveRate;
  const feeRate = 0.005; // 0.5%
  const feeNgn = grossNgn * feeRate;
  const netNgn = Math.max(0, grossNgn - feeNgn);
  const isValid = parsedAmount > 0 && parsedAmount <= availableUsd;

  const setPercent = (pct: number) => {
    const val = (availableUsd * pct).toFixed(2);
    setAmountStr(val);
  };

  return (
    <div className="bg-card border border-border/80 shadow-xs rounded-2xl p-6 sm:p-7 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-body-lg sm:text-display-xs font-bold text-foreground">
          Convert QDASH to Naira
        </h2>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live rate
        </span>
      </div>

      {/* From Card */}
      <div className="rounded-2xl border border-border/80 p-4 bg-background/50 flex flex-col gap-3">
        <div className="flex items-center justify-between text-body-xs font-medium text-muted-foreground">
          <span>From</span>
          <span>Balance: {availableUsd.toFixed(2)} QD</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1">
            <span className="px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-body-xs">
              QD
            </span>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full text-2xl sm:text-3xl font-extrabold text-foreground bg-transparent focus:outline-none placeholder:text-muted-foreground/40"
            />
          </div>
          <span className="text-body-sm font-bold text-muted-foreground">QDASH</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          {[0.25, 0.5, 1].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setPercent(pct)}
              className="py-1 px-3 rounded-lg border border-border bg-secondary/40 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              {pct === 1 ? 'Max' : `${pct * 100}%`}
            </button>
          ))}
        </div>
      </div>

      {/* Centered Down Arrow */}
      <div className="flex justify-center -my-2.5 z-10">
        <div className="h-9 w-9 rounded-full bg-card border border-border shadow-xs flex items-center justify-center text-muted-foreground">
          <ArrowDownIcon className="h-4 w-4" />
        </div>
      </div>

      {/* To Naira Card */}
      <div className="rounded-2xl border border-border/80 p-4 bg-background/50 flex flex-col gap-2">
        <div className="text-body-xs font-medium text-muted-foreground">To (Naira)</div>
        <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {formatCurrency(grossNgn, 'NGN')}
        </div>
        <div className="mt-2 rounded-xl bg-secondary/50 p-2.5 text-[11px] text-muted-foreground">
          1 QDASH = {formatCurrency(liveRate, 'NGN')} · Updates every 60s
        </div>
      </div>

      {/* Destination Bank Account */}
      <div className="flex flex-col gap-1.5">
        <label className="text-body-xs font-medium text-foreground">
          Destination bank account
        </label>
        <div className="relative">
          <select
            value={selectedMethodId}
            onChange={(e) => setSelectedMethodId(e.target.value)}
            className="w-full h-12 appearance-none rounded-xl border border-input bg-background px-3.5 pr-10 text-body-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-[#008774]"
          >
            {payoutMethods.length > 0 ? (
              payoutMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.bankName || 'Bank'} — {m.accountReference} ({workerName})
                </option>
              ))
            ) : (
              <option value="">
                GTBank — 0123456789 ({workerName})
              </option>
            )}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="rounded-xl bg-secondary/40 p-4 flex flex-col gap-2 text-body-xs border border-border/40">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Gross amount</span>
          <span className="font-medium text-foreground">{formatCurrency(grossNgn, 'NGN')}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Conversion fee (0.5%)</span>
          <span className="font-medium text-foreground">- {formatCurrency(feeNgn, 'NGN')}</span>
        </div>
        <div className="border-t border-border/60 pt-2 flex items-center justify-between font-bold text-foreground">
          <span>You receive</span>
          <span className="text-body-sm text-foreground">{formatCurrency(netNgn, 'NGN')}</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        disabled={!isValid}
        onClick={() => onReviewConversion(parsedAmount, selectedMethodId)}
        className="w-full min-h-[48px] rounded-xl bg-[#008774] hover:bg-[#007060] disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-body-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <TrendingUpIcon className="h-4 w-4" />
        Review conversion
      </button>
    </div>
  );
}
