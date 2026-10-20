'use client';

import { SparklesIcon, ZapIcon } from '@/assets';
import { BrandLogo } from '@/components/ui';

interface AuthShowcaseCardProps {
  headline?: string;
}

export function AuthShowcaseCard({
  headline = 'One Click Away from Effortless Stablecoin Payroll',
}: AuthShowcaseCardProps) {
  return (
    <div className="relative m-3 hidden lg:flex flex-col justify-between rounded-[28px] bg-[#F4F6F9] dark:bg-[#141519] p-8 xl:p-10 border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden select-none transition-colors duration-200">
      {/* Halftone / dot pattern background */}
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top Header: Brand Name & Chiclet Badge */}
      <div className="relative z-10 flex flex-col gap-6">
        <BrandLogo variant="full" size="md" />

        {/* Floating audio/chiclet key with indicator */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-[#1a1b20] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/70 dark:border-white/[0.08]">
            <ZapIcon className="h-5 w-5 text-brand-emerald fill-brand-emerald/10" />
          </div>
          <div className="h-1 w-6 rounded-full bg-brand-emerald" />
        </div>
      </div>

      {/* Floating Center Showcase Card matching reference */}
      <div className="relative z-10 my-8 mx-auto w-full max-w-sm rounded-2xl bg-white/95 dark:bg-[#121316]/95 p-5 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.06)] border border-black/[0.04] dark:border-white/[0.08] backdrop-blur-md transition-colors duration-200">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.06] pb-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-[#0b3d2e]/10 dark:bg-brand-emerald/10 border border-[#0b3d2e]/20 dark:border-brand-emerald/20 px-3 py-1 text-[11px] font-semibold text-[#0b3d2e] dark:text-brand-emerald shadow-xs">
            <SparklesIcon className="h-3 w-3 text-[#0b3d2e] dark:text-brand-emerald" />
            <span>Stablecoin Payroll</span>
          </div>
          <div className="px-2 py-1 text-[11px] font-medium text-gray-400 dark:text-[#8a8f98]">
            Instant Cashout
          </div>
        </div>

        {/* Card Copy */}
        <p className="mt-3 text-body-xs text-gray-600 dark:text-[#8a8f98] leading-relaxed">
          Fund treasury in Naira or crypto, run 1-click batch runs in USDC &amp; USDT, and let remote
          contractors cash out directly to local bank accounts in seconds.
        </p>

        {/* Micro-chips row */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="rounded-md border border-gray-200/80 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-gray-700 dark:text-[#8a8f98]">
            USDC Base
          </span>
          <span className="rounded-md border border-gray-200/80 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-gray-700 dark:text-[#8a8f98]">
            TRON USDT
          </span>
          <span className="rounded-md border border-gray-200/80 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-gray-700 dark:text-[#8a8f98]">
            Local Bank Cashout
          </span>
          <span className="rounded-md border border-[#0b3d2e]/20 dark:border-brand-emerald/20 bg-[#0b3d2e]/10 dark:bg-brand-emerald/10 px-2 py-0.5 text-[10px] font-semibold text-[#0b3d2e] dark:text-brand-emerald">
            14s Settlement
          </span>
        </div>
      </div>

      {/* Bottom Floating Accent + Display Title */}
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-end gap-2.5 pr-4">
          <div className="h-1 w-6 rounded-full bg-brand-emerald" />
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#1a1b20] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/70 dark:border-white/[0.08] text-label-md font-bold text-gray-800 dark:text-white">
            ₦
          </div>
        </div>

        <h2 className="text-display-xs sm:text-display-sm font-heading font-bold text-[#0F172A] dark:text-white tracking-tight leading-snug max-w-sm">
          {headline}
        </h2>
      </div>
    </div>
  );
}
