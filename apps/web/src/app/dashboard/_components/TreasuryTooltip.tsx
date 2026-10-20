'use client';

import { CalendarIcon, MousePointerIcon } from '@/assets';

interface TreasuryTooltipProps {
  isHovered: boolean;
}

export function TreasuryTooltip({ isHovered }: TreasuryTooltipProps) {
  return (
    <div
      className={`absolute left-[54%] top-[10%] -translate-x-1/2 -translate-y-full mb-2 pointer-events-none transition-transform duration-200 ${
        isHovered ? 'scale-105' : 'scale-100'
      }`}
    >
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

      {/* Pointer cursor */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 translate-y-1 flex items-center justify-center">
        <MousePointerIcon className="h-4 w-4 text-gray-900 fill-gray-900 dark:text-white dark:fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] rotate-[-45deg]" />
      </div>
    </div>
  );
}
