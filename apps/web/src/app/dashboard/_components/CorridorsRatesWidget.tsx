'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowLeftRightIcon, ZapIcon, ShieldCheckIcon } from '@/assets';

interface CorridorsRatesWidgetProps {
  marketRate: number;
}

export function CorridorsRatesWidget({ marketRate }: CorridorsRatesWidgetProps) {
  const [calcUsd, setCalcUsd] = useState('500');
  const usdNum = parseFloat(calcUsd) || 0;
  const ngnEquivalent = usdNum * marketRate;

  return (
    <Card className="flex flex-col gap-4 bg-card/90 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="text-label-md font-bold text-foreground">
            Corridors & OTC Rails
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Live off-ramp exchange rates
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Realtime
        </span>
      </div>

      {/* Corridor Rates List */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-caption text-foreground">USDT / NGN</span>
              <span className="rounded bg-secondary text-muted-foreground text-[10px] font-mono px-1.5 py-0.5">Bank Rail</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Nigeria Local Payouts</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-caption font-bold text-foreground">
              ₦{marketRate.toLocaleString()}
            </span>
            <p className="text-[10px] text-muted-foreground">0% OTC Slippage</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-caption text-foreground">USDC / USD</span>
              <span className="rounded bg-secondary text-muted-foreground text-[10px] font-mono px-1.5 py-0.5">Treasury</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Base & Polygon Rails</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-caption font-bold text-foreground">$1.0000</span>
            <p className="text-[10px] text-muted-foreground">1:1 Reserves</p>
          </div>
        </div>
      </div>

      {/* Mini Conversion Estimator */}
      <div className="pt-2 border-t border-border flex flex-col gap-2">
        <div className="flex items-center justify-between text-caption font-semibold text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowLeftRightIcon className="h-3 w-3" />
            Quick Rate Preview
          </span>
          <span className="text-[10px]">Zero Spread</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-2 text-caption text-muted-foreground font-semibold">$</span>
            <input
              type="number"
              value={calcUsd}
              onChange={(e) => setCalcUsd(e.target.value)}
              className="w-full rounded-lg border border-border bg-card pl-6 pr-2 py-1.5 text-caption font-mono text-foreground focus:outline-none focus:border-foreground/30"
              placeholder="0"
            />
          </div>
          <span className="text-caption text-muted-foreground">≈</span>
          <div className="flex-1 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-caption font-mono text-foreground truncate">
            ₦{ngnEquivalent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Network Health Line */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
        <span className="flex items-center gap-1">
          <ZapIcon className="h-3 w-3 text-emerald-400" />
          Off-Ramp Speed: &lt;60s
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheckIcon className="h-3 w-3 text-emerald-400" />
          KYC / AML Compliant
        </span>
      </div>
    </Card>
  );
}
