'use client';

import { SparklesIcon } from '@/assets';

interface PricingHeroProps {
  annual: boolean;
  setAnnual: (val: boolean) => void;
}

export function PricingHero({ annual, setAnnual }: PricingHeroProps) {
  return (
    <section className="relative flex flex-col items-center px-4 pt-32 pb-12 sm:pt-40 sm:pb-16 text-center overflow-hidden transition-colors duration-200">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[400px] w-[650px] rounded-full bg-brand-emerald/[0.06] blur-[140px]" />
      </div>

      {/* Pill badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.03] px-3.5 py-1 text-caption text-gray-700 dark:text-[#8a8f98] mb-8 shadow-sm">
        <SparklesIcon className="h-3 w-3 text-brand-emerald" />
        <span>Transparent, Predictable Pricing</span>
      </div>

      {/* Main heading */}
      <h1 className="text-display-md sm:text-display-xl lg:text-display-2xl max-w-4xl tracking-tight leading-[1.12] text-glow-silver font-heading">
        Predictable pricing for
        <br />
        modern African tech teams
      </h1>

      {/* Subtitle */}
      <p className="mt-5 text-body-sm sm:text-body-md text-gray-600 dark:text-[#8a8f98] max-w-2xl leading-relaxed">
        No hidden parallel market FX markups, no expensive SWIFT wire charges.
        A transparent monthly plan with a flat 1.0% disburse fee on payroll.
      </p>

      {/* Billing toggle */}
      <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.04] dark:border-white/[0.08] dark:bg-[#121317] p-1.5 shadow-sm dark:shadow-lg">
        <button
          type="button"
          onClick={() => setAnnual(false)}
          className={`rounded-full px-4 py-1.5 text-label-sm font-semibold transition-all cursor-pointer ${
            !annual
              ? 'bg-white text-gray-900 shadow-sm dark:bg-white dark:text-black'
              : 'text-gray-600 hover:text-black dark:text-[#8a8f98] dark:hover:text-white'
          }`}
        >
          Monthly billing
        </button>
        <button
          type="button"
          onClick={() => setAnnual(true)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-label-sm font-semibold transition-all cursor-pointer ${
            annual
              ? 'bg-white text-gray-900 shadow-sm dark:bg-white dark:text-black'
              : 'text-gray-600 hover:text-black dark:text-[#8a8f98] dark:hover:text-white'
          }`}
        >
          <span>Annual billing</span>
          <span className="rounded-full bg-brand-emerald/15 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-brand-emerald">
            Save 20%
          </span>
        </button>
      </div>
    </section>
  );
}
