'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  InfoIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  PlusIcon,
  SendIcon,
} from '@/assets';
import { TreasuryTooltip } from './TreasuryTooltip';
import { TreasurySvgCanvas } from './TreasurySvgCanvas';

interface TreasuryFlowChartProps {
  availableUsd: number;
  availableNgn: number;
  onRefresh?: () => void;
  onOpenFunding?: () => void;
}

export function TreasuryFlowChart({
  availableUsd,
  availableNgn,
  onRefresh,
  onOpenFunding,
}: TreasuryFlowChartProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | '3m'>('30d');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // If real balance exists, show it; else use original mockup default
  const displayUsd = availableUsd > 0
    ? `$${availableUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '$56,148.45';

  const displayNgn = availableNgn > 0
    ? `₦${Math.round(availableNgn).toLocaleString('en-US')}`
    : '₦84,222,675';

  return (
    <div className="mt-4 rounded-xl border border-black/[0.06] bg-white shadow-xs dark:border-white/[0.04] dark:bg-[#121317] p-4 sm:p-5 transition-colors duration-200">
      {/* Cashflow Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-label-sm font-semibold text-gray-900 dark:text-white">Treasury &amp; Payroll Flow</span>
          <span title="Real-time multi-rail stablecoin and local currency flow">
            <InfoIcon className="h-3 w-3 text-gray-400 dark:text-[#6b7280] cursor-help" />
          </span>
          <span className="rounded-full border border-[#0b3d2e]/20 bg-[#0b3d2e]/10 text-[#0b3d2e] dark:border-brand-emerald/20 dark:bg-brand-emerald/10 dark:text-brand-emerald px-2 py-0.5 text-[10px] font-medium">
            Card NGN + Stablecoins
          </span>
        </div>

        {/* Range selectors and controls */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="text-gray-400 hover:text-gray-900 dark:text-[#6b7280] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Refresh data"
            >
              <RefreshCwIcon className="h-3 w-3" />
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-gray-900 dark:text-[#6b7280] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Options"
            >
              <MoreHorizontalIcon className="h-3.5 w-3.5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-6 z-20 w-44 rounded-xl border border-border bg-card p-1.5 shadow-lg text-body-xs">
                {onOpenFunding && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenFunding();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary text-foreground font-medium"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    Fund treasury
                  </button>
                )}
                <Link
                  href="/dashboard/payroll"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary text-foreground font-medium"
                >
                  <SendIcon className="h-3.5 w-3.5" />
                  Run payroll
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-[#f1f5f9] dark:bg-[#0c0d10] p-0.5 text-[10px]">
            {(['7d', '30d', '3m'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  period === p
                    ? 'bg-white dark:bg-white/[0.1] font-semibold text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 dark:text-[#8a8f98] hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {p === '7d' ? '7 days' : p === '30d' ? '30 days' : '3 months'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Metric & Legend */}
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <span className="text-display-sm font-bold text-gray-900 dark:text-white tracking-tight">
            {displayUsd}
          </span>
          <span className="text-[11px] text-gray-500 dark:text-[#8a8f98]">
            USDC (≈ {displayNgn})
          </span>
          <span className="rounded-full bg-[#0b3d2e]/10 text-[#0b3d2e] dark:bg-brand-emerald/10 dark:text-brand-emerald px-2 py-0.5 text-[11px] font-semibold">
            ↑ +18.4%
          </span>
        </div>
        <div className="flex items-center gap-4 text-caption text-gray-600 dark:text-[#8a8f98]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400" />
            <span>Treasury Inflow (Card/Crypto)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 dark:bg-rose-400" />
            <span>Contractor Disbursements</span>
          </div>
        </div>
      </div>

      {/* Dual Wave SVG Chart with Interactive Tooltip */}
      <div
        className="relative mt-4 h-48 w-full select-none cursor-crosshair"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[10px] text-gray-400 dark:text-[#4b5563]">
          <span>$50k</span>
          <span>$25k</span>
          <span>$10k</span>
          <span>$5k</span>
        </div>

        {/* Chart Graphic Area */}
        <div className="ml-8 h-full relative">
          <TreasurySvgCanvas />
          <TreasuryTooltip isHovered={isHovered} />
        </div>
      </div>
    </div>
  );
}
