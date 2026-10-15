import Link from 'next/link';
import {
  ArrowRightIcon,
  SparklesIcon,
} from '@/assets';

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center px-4 pt-32 pb-14 sm:pt-40 sm:pb-20 text-center overflow-hidden">
      {/* Top Ambient Horizon Halo Lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        {/* Massive top-centered silver ambient flare */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[580px] w-[1100px] rounded-full bg-gradient-to-b from-brand-emerald/[0.12] via-brand-emerald/[0.03] to-transparent dark:from-white/[0.24] dark:via-white/[0.06] dark:to-transparent blur-[110px]" />
        {/* Soft secondary emerald tint */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 h-[350px] w-[550px] rounded-full bg-brand-emerald/[0.06] dark:bg-brand-emerald/[0.08] blur-[90px]" />
        {/* Subtle starry backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 dark:opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main heading with Specular Silver Lighting */}
      <h1 className="text-display-md sm:text-display-xl lg:text-display-2xl max-w-3xl tracking-tight leading-[1.08] text-glow-silver font-heading">
        Pay remote teams in stablecoins.
      </h1>

      {/* Subtitle */}
      <p className="mt-5 text-body-sm sm:text-body-md text-gray-600 dark:text-[#8a8f98] max-w-2xl leading-relaxed">
        PayCrew empowers African tech companies to fund corporate treasuries via Korapay or crypto,
        disburse USDC/USDT payroll in 1-click, and let remote contractors cash out straight to their local bank accounts.
      </p>

      {/* CTA buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
        <Link
          href="/register"
          prefetch={true}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0f1115] hover:bg-[#1e2025] text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black px-6 py-2.5 text-label-sm font-semibold transition-all shadow-[0_4px_14px_rgba(0,0,0,0.12)] dark:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
        >
          <span>Start Paying Contractors</span>
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/dashboard"
          prefetch={true}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white hover:bg-gray-50 text-gray-900 border border-black/[0.08] dark:bg-[#16171d] dark:hover:bg-[#20222a] dark:text-white dark:border-white/[0.12] px-6 py-2.5 text-label-sm font-medium transition-all shadow-sm"
        >
          Explore Demo Dashboard
        </Link>
      </div>
    </section>
  );
}
