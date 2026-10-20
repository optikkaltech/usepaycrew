'use client';

import {
  CalendarIcon,
  InfoIcon,
  MoreHorizontalIcon,
  MousePointerIcon,
  RefreshCwIcon,
} from '@/assets';

export function DashboardCashflow() {
  return (
    <div className="mt-4 rounded-xl border border-black/[0.06] bg-white shadow-xs dark:border-white/[0.04] dark:bg-[#121317] p-4 sm:p-5 transition-colors duration-200">
      {/* Cashflow Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-label-sm font-semibold text-gray-900 dark:text-white">Treasury &amp; Payroll Flow</span>
          <InfoIcon className="h-3 w-3 text-gray-400 dark:text-[#6b7280]" />
          <span className="rounded-full border border-[#0b3d2e]/20 bg-[#0b3d2e]/10 text-[#0b3d2e] dark:border-brand-emerald/20 dark:bg-brand-emerald/10 dark:text-brand-emerald px-2 py-0.5 text-[10px] font-medium">
            Card NGN + Stablecoins
          </span>
        </div>

        {/* Range selectors and controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-900 dark:text-[#6b7280] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Refresh"
          >
            <RefreshCwIcon className="h-3 w-3" />
          </button>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-900 dark:text-[#6b7280] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Options"
          >
            <MoreHorizontalIcon className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-[#f1f5f9] dark:bg-[#0c0d10] p-0.5 text-[10px]">
            <span className="px-2 py-0.5 text-gray-500 dark:text-[#8a8f98] cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
              7 days
            </span>
            <span className="rounded bg-white dark:bg-white/[0.1] px-2 py-0.5 font-semibold text-gray-900 dark:text-white shadow-xs">
              30 days
            </span>
            <span className="px-2 py-0.5 text-gray-500 dark:text-[#8a8f98] cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
              3 months
            </span>
          </div>
        </div>
      </div>

      {/* Main Metric & Legend */}
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <span className="text-display-sm font-bold text-gray-900 dark:text-white tracking-tight">
            $56,148.45
          </span>
          <span className="text-[11px] text-gray-500 dark:text-[#8a8f98]">USDC (≈ ₦84,222,675)</span>
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

      {/* Dual Wave SVG Chart with Tooltip */}
      <div className="relative mt-4 h-48 w-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[10px] text-gray-400 dark:text-[#4b5563]">
          <span>$50k</span>
          <span>$25k</span>
          <span>$10k</span>
          <span>$5k</span>
        </div>

        {/* Chart Graphic Area */}
        <div className="ml-8 h-full relative">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 600 160"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Subtle grid lines */}
            <line x1="0" y1="10" x2="600" y2="10" className="stroke-black/[0.06] dark:stroke-white/[0.03]" strokeDasharray="3 3" />
            <line x1="0" y1="55" x2="600" y2="55" className="stroke-black/[0.06] dark:stroke-white/[0.03]" strokeDasharray="3 3" />
            <line x1="0" y1="105" x2="600" y2="105" className="stroke-black/[0.06] dark:stroke-white/[0.03]" strokeDasharray="3 3" />
            <line x1="0" y1="150" x2="600" y2="150" className="stroke-black/[0.06] dark:stroke-white/[0.03]" />

            {/* Disbursements line (Red / Rose) */}
            <path
              d="M0,140 Q60,135 120,138 T240,145 T360,130 T480,142 T600,135"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeOpacity="0.85"
            />

            {/* Treasury Inflow fill area */}
            <path
              d="M0,85 Q60,80 120,95 T240,82 T360,45 T480,95 T600,75 L600,160 L0,160 Z"
              fill="url(#revenueGlow)"
            />

            {/* Inflow line (Cyan / Teal) */}
            <path
              d="M0,85 Q60,80 120,95 T240,82 T360,45 T480,95 T600,75"
              fill="none"
              stroke="#0891b2"
              className="dark:stroke-[#22d3ee]"
              strokeWidth="2"
            />

            {/* Highlighted point at peak (360, 45) */}
            <circle cx="360" cy="45" r="4.5" className="fill-[#0891b2] dark:fill-[#22d3ee]" />
            <circle cx="360" cy="45" r="8" className="fill-[#0891b2]/30 dark:fill-[#22d3ee]/30" />
          </svg>

          {/* Interactive Floating Tooltip at Oct 21 */}
          <div className="absolute left-[54%] top-[10%] -translate-x-1/2 -translate-y-full mb-2 pointer-events-none">
            <div className="rounded-xl border border-black/[0.08] bg-white/95 text-gray-900 shadow-xl backdrop-blur-md dark:border-white/[0.1] dark:bg-[#161820]/95 dark:text-white p-2.5 min-w-[200px]">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-[#9ca3af] pb-1.5 border-b border-black/[0.06] dark:border-white/[0.06]">
                <CalendarIcon className="h-3 w-3 text-gray-700 dark:text-white" />
                <span>Oct 21 Batch Payroll Run</span>
              </div>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-[#d1d5db]">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    Treasury Inflow
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">$25,000</span>
                  <span className="text-[10px] font-semibold text-[#0b3d2e] dark:text-brand-emerald">₦37.5M</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-[#d1d5db]">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 dark:bg-rose-400" />
                    Disbursements
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">$16,278</span>
                  <span className="text-[10px] font-semibold text-[#0b3d2e] dark:text-brand-emerald">24 Paid</span>
                </div>
              </div>
            </div>

            {/* Cursor pointing at dot */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 translate-y-1 flex items-center justify-center">
              <MousePointerIcon className="h-4 w-4 text-gray-900 fill-gray-900 dark:text-white dark:fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] rotate-[-45deg]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
