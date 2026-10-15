import Link from 'next/link';
import { ArrowRightIcon } from '@/assets';

export function PreFooterHorizonCta() {
  return (
    <section className="relative px-4 pt-28 pb-36 sm:pt-40 sm:pb-48 text-center overflow-hidden bg-gradient-to-b from-transparent via-[#f8fafc] to-[#edf2f7] dark:from-[#08090b] dark:via-[#08090b] dark:to-[#040507] transition-colors duration-200">
      {/* ── Panoramic Curved Earth Horizon Lighting ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        {/* Curved atmosphere corona plume */}
        <div className="absolute bottom-[-140px] sm:bottom-[-220px] h-[300px] sm:h-[450px] w-[160%] sm:w-[130%] rounded-[100%_100%_0_0] bg-gradient-to-t from-brand-emerald/[0.12] via-brand-emerald/[0.03] to-transparent dark:from-white/[0.05] dark:via-transparent blur-2xl" />

        {/* Glowing Earth horizon arc */}
        <div className="relative bottom-[-120px] sm:bottom-[-200px] h-[250px] sm:h-[380px] w-[180%] sm:w-[140%] rounded-[100%_100%_0_0] bg-gradient-to-b from-white via-[#f8fafc] to-[#edf2f7] border-t border-black/[0.08] shadow-[0_-20px_50px_rgba(6,214,160,0.1)] dark:lighting-earth-arc dark:bg-gradient-to-b dark:from-[#0c0e14] dark:via-[#08090b] dark:to-[#040507] dark:border-none" />

        {/* Central apex starburst highlight */}
        <div className="absolute bottom-28 sm:bottom-40 left-1/2 -translate-x-1/2 h-16 w-80 bg-brand-emerald/15 dark:bg-transparent blur-2xl rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl">
        <h2 className="text-display-md sm:text-display-xl lg:text-display-2xl font-heading font-semibold tracking-tight text-glow-silver leading-[1.12]">
          Take the first step toward
          <br />
          effortless contractor payroll
        </h2>

        <p className="mt-5 text-body-sm sm:text-body-md text-gray-600 dark:text-[#8a8f98] max-w-xl mx-auto leading-relaxed">
          Join African tech companies using PayCrew to fund in Naira, disburse stablecoins in seconds,
          and give contractors instant local bank off-ramps.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/register"
            prefetch={true}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0f1115] hover:bg-[#1e2025] text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black px-7 py-3 text-label-sm font-semibold transition-all shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:shadow-md"
          >
            <span>Start Free Today</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            prefetch={true}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white hover:bg-gray-50 text-gray-900 border border-black/[0.08] dark:bg-[#14151a] dark:hover:bg-[#1f2129] dark:text-white dark:border-white/[0.12] px-7 py-3 text-label-sm font-medium transition-all shadow-sm"
          >
            Explore Demo Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
