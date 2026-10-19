'use client';

import { useState } from 'react';
import { TrendingUpIcon, BuildingIcon } from '@/assets';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils';

interface QuickConvertCardProps {
  availableUsd: number;
  liveRate: number;
  defaultBankName?: string;
  defaultBankLast4?: string;
  onInitiateConvert: (amountUsd: number) => void;
}

export function QuickConvertCard({
  availableUsd,
  liveRate,
  defaultBankName,
  defaultBankLast4,
  onInitiateConvert,
}: QuickConvertCardProps) {
  const [amountStr, setAmountStr] = useState('');

  const parsedAmount = parseFloat(amountStr) || 0;
  const estimatedNgn = parsedAmount * liveRate;
  const isExceeding = parsedAmount > availableUsd;
  const isValid = parsedAmount > 0 && !isExceeding;

  const setPercent = (pct: number) => {
    const val = (availableUsd * pct).toFixed(2);
    setAmountStr(val);
  };

  return (
    <Card variant="elevated" className="p-6 border-border bg-card shadow-xs rounded-2xl flex flex-col justify-between">
      <div>
        <div className="pb-3 border-b border-border">
          <h3 className="text-display-xs font-bold text-foreground">Quick convert</h3>
          <p className="text-caption text-muted-foreground mt-0.5">
            Move USDT to your bank account in Naira.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {/* Amount input & presets */}
          <div>
            <div className="flex items-center justify-between text-caption font-semibold text-muted-foreground mb-1.5">
              <span>Amount (USDT)</span>
              <span>Available: {availableUsd.toFixed(2)} USDT</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0"
                max={availableUsd}
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full h-11 rounded-xl border border-input bg-background px-3.5 pr-16 text-body-md font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-caption font-bold text-muted-foreground">
                USDT
              </span>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-2">
            {[0.25, 0.5, 1].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setPercent(pct)}
                className="flex-1 py-1 px-2 rounded-lg border border-border bg-secondary/40 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                {pct === 1 ? 'Max' : `${pct * 100}%`}
              </button>
            ))}
          </div>

          {/* Estimation & Bank Preview */}
          <div className="rounded-xl border border-border bg-secondary/30 p-3 flex flex-col gap-1.5 text-caption">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Estimated payout</span>
              <span className="text-body-xs font-bold text-brand-emerald">
                ≈ {formatCurrency(estimatedNgn, 'NGN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Destination</span>
              <span className="font-semibold text-foreground flex items-center gap-1">
                <BuildingIcon className="h-3 w-3" />
                {defaultBankName ? `${defaultBankName} ••••${defaultBankLast4 || ''}` : 'No bank linked'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={() => onInitiateConvert(parsedAmount)}
        disabled={!isValid || !defaultBankName}
        className="mt-5 w-full min-h-[44px] bg-brand-emerald text-black hover:bg-brand-emerald/90 font-bold"
      >
        <TrendingUpIcon className="mr-2 h-4 w-4" />
        Convert to Naira Now
      </Button>
    </Card>
  );
}
