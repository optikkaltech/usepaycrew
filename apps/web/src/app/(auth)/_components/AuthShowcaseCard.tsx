'use client';

import { SparklesIcon, ZapIcon } from '@/assets';

interface AuthShowcaseCardProps {
  headline?: string;
}

export function AuthShowcaseCard({
  headline = 'One Click Away from Effortless Stablecoin Payroll',
}: AuthShowcaseCardProps) {
  return (
    <div className="relative m-3 hidden lg:flex flex-col justify-between rounded-[28px] bg-[#F4F6F9] p-8 xl:p-10 border border-neutral-200/60 overflow-hidden select-none">
      {/* Halftone / dot pattern background */}
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top Header: Brand Name & Chiclet Badge */}
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-emerald text-black font-black text-caption shadow-sm">
            P
          </div>
          <span className="text-label-md font-bold tracking-wider text-[#0F172A] uppercase">
            PayCrew
          </span>
        </div>

        {/* Floating audio/chiclet key with indicator */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/70">
            <ZapIcon className="h-5 w-5 text-brand-emerald fill-brand-emerald/10" />
          </div>
          <div className="h-1 w-6 rounded-full bg-brand-emerald" />
        </div>
      </div>

      {/* Floating Center Showcase Card matching reference */}
      <div className="relative z-10 my-8 mx-auto w-full max-w-sm rounded-2xl bg-white/95 p-5 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.06)] border border-black/[0.04] backdrop-blur-md">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-[11px] font-semibold text-emerald-800 shadow-xs">
            <SparklesIcon className="h-3 w-3 text-emerald-600" />
            <span>Stablecoin Payroll</span>
          </div>
          <div className="px-2 py-1 text-[11px] font-medium text-gray-400">
            NUBAN Cashout
          </div>
        </div>

        {/* Card Copy */}
        <p className="mt-3 text-body-xs text-gray-600 leading-relaxed">
          Fund treasury in Naira or crypto, run 1-click batch runs in USDC &amp; USDT, and let remote
          contractors cash out directly to local bank accounts in seconds.
        </p>

        {/* Micro-chips row */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="rounded-md border border-gray-200/80 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-700">
            USDC Base
          </span>
          <span className="rounded-md border border-gray-200/80 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-700">
            TRON USDT
          </span>
          <span className="rounded-md border border-gray-200/80 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-700">
            GTBank NUBAN
          </span>
          <span className="rounded-md border border-emerald-200 bg-emerald-50/50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            14s Cashout
          </span>
        </div>
      </div>

      {/* Bottom Floating Accent + Display Title */}
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-end gap-2.5 pr-4">
          <div className="h-1 w-6 rounded-full bg-brand-emerald" />
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/70 text-label-md font-bold text-gray-800">
            ₦
          </div>
        </div>

        <h2 className="text-display-xs sm:text-display-sm font-heading font-bold text-[#0F172A] tracking-tight leading-snug max-w-sm">
          {headline}
        </h2>
      </div>
    </div>
  );
}
