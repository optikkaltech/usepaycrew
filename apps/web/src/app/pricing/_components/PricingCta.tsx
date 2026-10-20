import Link from 'next/link';
import { ArrowRightIcon, SparklesIcon } from '@/assets';

export function PricingCta() {
  return (
    <section className="relative px-4 py-20 overflow-hidden transition-colors duration-200">
      <div className="mx-auto max-w-5xl rounded-3xl border border-black/[0.08] bg-gradient-to-b from-white to-[#f8fafc] dark:border-white/[0.08] dark:bg-gradient-to-b dark:from-[#121318] dark:to-[#0c0d10] p-8 sm:p-14 text-center shadow-xl dark:shadow-2xl relative">
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-48 w-80 rounded-full bg-brand-emerald/[0.1] blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.03] px-3.5 py-1 text-caption text-gray-700 dark:text-[#8a8f98] mb-6 shadow-sm">
          <SparklesIcon className="h-3 w-3 text-brand-emerald" />
          <span>Launch Your Team in 3 Minutes</span>
        </div>

        <h2 className="text-display-sm sm:text-display-md text-gray-900 dark:text-white font-normal tracking-tight max-w-xl mx-auto">
          Ready to streamline your global contractor payroll?
        </h2>

        <p className="mt-4 text-body-sm text-gray-600 dark:text-[#8a8f98] max-w-lg mx-auto leading-relaxed">
          Set up your corporate treasury, complete automated KYB, and invite your first contractor today.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            prefetch={true}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0b3d2e] hover:bg-[#0b3d2e]/90 text-white dark:bg-brand-emerald dark:hover:bg-brand-emerald/90 dark:text-black px-6 py-3 text-label-sm font-semibold transition-all shadow-md dark:shadow-[0_0_20px_rgba(57,255,20,0.3)]"
          >
            <span>Create Company Account</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            prefetch={true}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white hover:bg-gray-50 text-gray-900 border border-black/[0.08] dark:bg-[#18191e] dark:hover:bg-[#23252c] dark:text-white dark:border-white/[0.1] px-6 py-3 text-label-sm font-medium transition-all shadow-sm"
          >
            Explore Live Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
